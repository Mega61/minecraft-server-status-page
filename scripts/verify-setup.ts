#!/usr/bin/env tsx
/**
 * Setup Verification Script
 *
 * This script verifies that your environment is configured correctly
 * and all components can communicate with each other.
 *
 * Usage:
 *   npm run verify
 *   or
 *   npx tsx scripts/verify-setup.ts
 */

import { config } from 'dotenv';
import { verifyConnection, getContainerState } from '../lib/portainer';
import { getServerStatus } from '../lib/minecraft';

// Load environment variables
config({ path: '.env.local' });

const REQUIRED_ENV_VARS = [
  'PORTAINER_URL',
  'PORTAINER_API_KEY',
  'PORTAINER_CONTAINER_ID',
  'MINECRAFT_HOST',
  'MINECRAFT_PORT',
];

function printHeader(text: string) {
  console.log('\n' + '='.repeat(60));
  console.log(text);
  console.log('='.repeat(60));
}

function printSuccess(text: string) {
  console.log('✅', text);
}

function printError(text: string) {
  console.log('❌', text);
}

function printWarning(text: string) {
  console.log('⚠️ ', text);
}

function printInfo(text: string) {
  console.log('ℹ️ ', text);
}

async function verifyEnvironmentVariables(): Promise<boolean> {
  printHeader('1. Checking Environment Variables');

  let allPresent = true;

  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];

    if (!value || value === 'your_api_key_here') {
      printError(`${varName} is not set or has default value`);
      allPresent = false;
    } else {
      printSuccess(`${varName} is set`);
    }
  }

  if (!allPresent) {
    printError('Some required environment variables are missing');
    printInfo('Please check your .env.local file');
    return false;
  }

  printSuccess('All required environment variables are set');
  return true;
}

async function verifyPortainerConnection(): Promise<boolean> {
  printHeader('2. Testing Portainer Connection');

  try {
    const result = await verifyConnection();

    if (result.success) {
      printSuccess('Portainer connection successful');
      printInfo(result.message);
      return true;
    } else {
      printError('Portainer connection failed');
      printInfo(result.message);
      return false;
    }
  } catch (error) {
    printError('Portainer connection failed with error');
    console.error(error);
    return false;
  }
}

async function checkContainerStatus(): Promise<void> {
  printHeader('3. Checking Container Status');

  try {
    const state = await getContainerState();

    printInfo(`Container: ${state.containerName || 'Unknown'}`);
    printInfo(`Status: ${state.status}`);

    if (state.status === 'running') {
      printSuccess('Container is currently running');
    } else if (state.status === 'stopped') {
      printWarning('Container is currently stopped');
      printInfo('This is normal if the server is not in use');
    } else {
      printWarning(`Container status is: ${state.status}`);
    }
  } catch (error) {
    printError('Failed to check container status');
    console.error(error);
  }
}

async function checkMinecraftServer(): Promise<void> {
  printHeader('4. Checking Minecraft Server');

  try {
    printInfo('Attempting to connect to Minecraft server...');
    printInfo('This may take a few seconds...');

    const status = await getServerStatus();

    if (status.online) {
      printSuccess('Minecraft server is online and responding');
      printInfo(`Players online: ${status.playerCount}/${status.maxPlayers}`);
      printInfo(`Version: ${status.version || 'Unknown'}`);
      if (status.motd) {
        printInfo(`MOTD: ${status.motd}`);
      }
    } else {
      printWarning('Minecraft server is not responding');
      printInfo('This is normal if the container is stopped or starting up');
      printInfo('Try starting the container and run this script again');
    }
  } catch (error) {
    printError('Failed to check Minecraft server status');
    console.error(error);
  }
}

function printSummary() {
  printHeader('Setup Verification Summary');

  printInfo('If all checks passed, your setup is ready!');
  printInfo('If there were errors, check SETUP.md for troubleshooting');

  console.log('\nNext steps:');
  console.log('  1. Start the development server: npm run dev');
  console.log('  2. Open http://localhost:3000 in your browser');
  console.log('  3. Test starting the server from the UI');
  console.log('  4. (Optional) Start auto-shutdown monitor: npm run auto-shutdown');

  console.log('\nFor detailed setup instructions, see SETUP.md');
  console.log('For troubleshooting, see SETUP.md#troubleshooting\n');
}

async function main() {
  console.log('\n🔍 KUMAFORCE Minecraft Server - Setup Verification\n');

  // Check environment variables
  const envOk = await verifyEnvironmentVariables();
  if (!envOk) {
    printInfo('Skipping remaining checks due to missing environment variables');
    printSummary();
    process.exit(1);
  }

  // Check Portainer connection
  const portainerOk = await verifyPortainerConnection();
  if (!portainerOk) {
    printWarning('Portainer connection failed, skipping container checks');
  } else {
    // Check container status
    await checkContainerStatus();
  }

  // Check Minecraft server
  await checkMinecraftServer();

  // Print summary
  printSummary();
}

// Run verification
main().catch((error) => {
  console.error('\n❌ Verification failed with error:');
  console.error(error);
  process.exit(1);
});
