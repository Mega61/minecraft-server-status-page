#!/usr/bin/env tsx
/**
 * Auto-Shutdown Monitor
 *
 * This script monitors the Minecraft server for player activity and automatically
 * shuts down the container after a period of inactivity.
 *
 * Usage:
 *   npm run auto-shutdown
 *   or
 *   npx tsx scripts/auto-shutdown.ts
 */

import { config } from 'dotenv';
import { getContainerState, stopContainer } from '../lib/portainer';
import { hasActivePlayers } from '../lib/minecraft';

// Load environment variables
config({ path: '.env.local' });

// Configuration
const INACTIVITY_TIMEOUT_MINUTES = parseInt(
  process.env.INACTIVITY_TIMEOUT_MINUTES || '15',
  10
);
const CHECK_INTERVAL_MINUTES = parseInt(
  process.env.ACTIVITY_CHECK_INTERVAL_MINUTES || '5',
  10
);

// Convert minutes to milliseconds
const INACTIVITY_TIMEOUT_MS = INACTIVITY_TIMEOUT_MINUTES * 60 * 1000;
const CHECK_INTERVAL_MS = CHECK_INTERVAL_MINUTES * 60 * 1000;

let lastActiveTime: number | null = null;
let isMonitoring = false;

function log(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

async function checkAndShutdown() {
  try {
    // Check if container is running
    const containerState = await getContainerState();

    if (containerState.status !== 'running') {
      log(
        `Container is ${containerState.status}, skipping activity check`
      );
      lastActiveTime = null;
      return;
    }

    // Check for active players
    const playersActive = await hasActivePlayers();

    if (playersActive) {
      log('Players are active, resetting inactivity timer');
      lastActiveTime = Date.now();
      return;
    }

    // No players online
    if (lastActiveTime === null) {
      // First time detecting no players
      log(
        'No players detected, starting inactivity timer'
      );
      lastActiveTime = Date.now();
      return;
    }

    // Calculate how long the server has been empty
    const inactiveTimeMs = Date.now() - lastActiveTime;
    const inactiveMinutes = Math.floor(inactiveTimeMs / 60000);

    log(
      `Server has been empty for ${inactiveMinutes} minutes (threshold: ${INACTIVITY_TIMEOUT_MINUTES} minutes)`
    );

    // Check if inactivity threshold has been reached
    if (inactiveTimeMs >= INACTIVITY_TIMEOUT_MS) {
      log(
        `Inactivity threshold reached! Shutting down container...`
      );

      await stopContainer();

      log('Container shutdown successful');
      lastActiveTime = null;
    }
  } catch (error) {
    console.error('Error in monitoring loop:', error);
  }
}

async function startMonitoring() {
  if (isMonitoring) {
    log('Monitoring is already running');
    return;
  }

  isMonitoring = true;

  log('=== Auto-Shutdown Monitor Started ===');
  log(`Inactivity timeout: ${INACTIVITY_TIMEOUT_MINUTES} minutes`);
  log(`Check interval: ${CHECK_INTERVAL_MINUTES} minutes`);
  log('=====================================');

  // Initial check
  await checkAndShutdown();

  // Set up periodic checks
  setInterval(checkAndShutdown, CHECK_INTERVAL_MS);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start monitoring
startMonitoring().catch((error) => {
  console.error('Failed to start monitoring:', error);
  process.exit(1);
});
