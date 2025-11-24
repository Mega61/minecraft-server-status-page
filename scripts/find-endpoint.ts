#!/usr/bin/env tsx
/**
 * Find Portainer Endpoint ID
 *
 * This script queries your Portainer instance to find available endpoints
 */

import { config } from 'dotenv';
import https from 'https';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.local' });

const PORTAINER_URL = process.env.PORTAINER_URL || '';
const PORTAINER_API_KEY = process.env.PORTAINER_API_KEY || '';
const REJECT_UNAUTHORIZED = process.env.PORTAINER_REJECT_UNAUTHORIZED !== 'false';

async function findEndpoints() {
  console.log('\n🔍 Finding Portainer Endpoints...\n');

  if (!PORTAINER_URL) {
    console.error('❌ PORTAINER_URL not set in .env.local');
    process.exit(1);
  }

  if (!PORTAINER_API_KEY) {
    console.error('❌ PORTAINER_API_KEY not set in .env.local');
    process.exit(1);
  }

  try {
    const httpsAgent = PORTAINER_URL.startsWith('https') && !REJECT_UNAUTHORIZED
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

    const response = await fetch(`${PORTAINER_URL}/api/endpoints`, {
      headers: {
        'X-API-Key': PORTAINER_API_KEY,
      },
      agent: httpsAgent,
    } as any);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const endpoints: any[] = await response.json();

    if (endpoints.length === 0) {
      console.log('⚠️  No endpoints found in Portainer');
      return;
    }

    console.log('✅ Found endpoints:\n');

    endpoints.forEach((endpoint) => {
      console.log(`  📍 ID: ${endpoint.Id}`);
      console.log(`     Name: ${endpoint.Name}`);
      console.log(`     Type: ${endpoint.Type === 1 ? 'Docker' : 'Other'}`);
      console.log(`     URL: ${endpoint.URL || 'N/A'}`);
      console.log('');
    });

    // Find the Docker endpoint
    const dockerEndpoint = endpoints.find(e => e.Type === 1);

    if (dockerEndpoint) {
      console.log(`💡 Recommended: Use endpoint ID ${dockerEndpoint.Id} (${dockerEndpoint.Name})`);
      console.log(`\nAdd this to your .env.local file:`);
      console.log(`PORTAINER_ENDPOINT_ID=${dockerEndpoint.Id}\n`);
    }

  } catch (error) {
    console.error('❌ Error fetching endpoints:', error);
    process.exit(1);
  }
}

findEndpoints();
