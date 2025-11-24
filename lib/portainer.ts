/**
 * Portainer API Utility
 * Handles all interactions with the Portainer API for container management
 */

import https from 'https';
import fetch from 'node-fetch';

const PORTAINER_URL = process.env.PORTAINER_URL || 'http://localhost:9000';
const PORTAINER_API_KEY = process.env.PORTAINER_API_KEY || '';
const CONTAINER_ID = process.env.PORTAINER_CONTAINER_ID || '';

// SSL certificate verification setting (for self-signed certificates)
// Set to 'false' in .env.local if using HTTPS with self-signed certificate
const REJECT_UNAUTHORIZED = process.env.PORTAINER_REJECT_UNAUTHORIZED !== 'false';

// Portainer endpoint ID (find this in Portainer > Environments)
// Usually 1 or 2, but can vary depending on your setup
const ENDPOINT_ID = process.env.PORTAINER_ENDPOINT_ID || '2';

// Debug logging
console.log('[Portainer Config]');
console.log('  URL:', PORTAINER_URL);
console.log('  Endpoint ID:', ENDPOINT_ID);
console.log('  REJECT_UNAUTHORIZED env:', process.env.PORTAINER_REJECT_UNAUTHORIZED);
console.log('  REJECT_UNAUTHORIZED:', REJECT_UNAUTHORIZED);
console.log('  Is HTTPS:', PORTAINER_URL.startsWith('https'));
console.log('  Will use custom agent:', PORTAINER_URL.startsWith('https') && !REJECT_UNAUTHORIZED);

// Create HTTPS agent for self-signed certificates if needed
const httpsAgent = PORTAINER_URL.startsWith('https') && !REJECT_UNAUTHORIZED
  ? new https.Agent({ rejectUnauthorized: false })
  : undefined;

interface ContainerState {
  status: 'running' | 'stopped' | 'starting' | 'unknown';
  uptime?: number;
  containerName?: string;
}

interface PortainerContainer {
  Id: string;
  Names: string[];
  State: string;
  Status: string;
}

/**
 * Makes an authenticated request to the Portainer API
 */
async function portainerRequest(
  endpoint: string,
  options: any = {}
): Promise<any> {
  const url = `${PORTAINER_URL}/api${endpoint}`;

  const headers: Record<string, string> = {
    'X-API-Key': PORTAINER_API_KEY,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const fetchOptions: any = {
    ...options,
    headers,
  };

  // Add agent for HTTPS with self-signed certificates
  if (httpsAgent) {
    fetchOptions.agent = httpsAgent;
    console.log('[Portainer] Using custom HTTPS agent for self-signed certificate');
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Portainer API error (${response.status}): ${errorText}`
    );
  }

  return response;
}

/**
 * Get the current state of the Minecraft container
 */
export async function getContainerState(): Promise<ContainerState> {
  try {
    const response = await portainerRequest(
      `/endpoints/${ENDPOINT_ID}/docker/containers/json?all=true`
    );

    const containers: PortainerContainer[] = await response.json();

    // Find our container by ID or name
    const container = containers.find(
      (c) => c.Id.startsWith(CONTAINER_ID) || c.Names.some(name => name.includes(CONTAINER_ID))
    );

    if (!container) {
      return {
        status: 'unknown',
        containerName: CONTAINER_ID,
      };
    }

    // Map Docker state to our status
    let status: ContainerState['status'] = 'unknown';
    if (container.State === 'running') {
      status = 'running';
    } else if (container.State === 'exited' || container.State === 'created') {
      status = 'stopped';
    }

    return {
      status,
      containerName: container.Names[0]?.replace(/^\//, '') || CONTAINER_ID,
    };
  } catch (error) {
    console.error('Error getting container state:', error);
    throw error;
  }
}

/**
 * Start the Minecraft container
 */
export async function startContainer(): Promise<void> {
  try {
    await portainerRequest(
      `/endpoints/${ENDPOINT_ID}/docker/containers/${CONTAINER_ID}/start`,
      { method: 'POST' }
    );
  } catch (error) {
    console.error('Error starting container:', error);
    throw error;
  }
}

/**
 * Stop the Minecraft container
 */
export async function stopContainer(): Promise<void> {
  try {
    // Use a graceful shutdown with 30 second timeout
    await portainerRequest(
      `/endpoints/${ENDPOINT_ID}/docker/containers/${CONTAINER_ID}/stop?t=30`,
      { method: 'POST' }
    );
  } catch (error) {
    console.error('Error stopping container:', error);
    throw error;
  }
}

/**
 * Verify that we can connect to Portainer and access the container
 */
export async function verifyConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  if (!PORTAINER_API_KEY) {
    return {
      success: false,
      message: 'PORTAINER_API_KEY not configured',
    };
  }

  if (!CONTAINER_ID) {
    return {
      success: false,
      message: 'PORTAINER_CONTAINER_ID not configured',
    };
  }

  try {
    const state = await getContainerState();

    if (state.status === 'unknown') {
      return {
        success: false,
        message: `Container '${CONTAINER_ID}' not found in Portainer`,
      };
    }

    return {
      success: true,
      message: `Connected successfully. Container status: ${state.status}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
