/**
 * Minecraft Server Status Utility
 * Handles checking the Minecraft server status and player information
 */

import * as minecraft from 'minecraft-server-util';

const MINECRAFT_HOST = process.env.MINECRAFT_HOST || 'localhost';
const MINECRAFT_PORT = parseInt(process.env.MINECRAFT_PORT || '25565', 10);

export interface MinecraftServerStatus {
  online: boolean;
  playerCount: number;
  maxPlayers: number;
  version?: string;
  motd?: string;
  players?: string[];
}

/**
 * Check if the Minecraft server is online and get status information
 */
export async function getServerStatus(): Promise<MinecraftServerStatus> {
  try {
    // Query the server with a timeout of 5 seconds
    const response = await minecraft.status(MINECRAFT_HOST, MINECRAFT_PORT, {
      timeout: 5000,
      enableSRV: true,
    });

    return {
      online: true,
      playerCount: response.players.online,
      maxPlayers: response.players.max,
      version: response.version.name,
      motd: response.motd.clean,
      players: response.players.sample?.map((p) => p.name) || [],
    };
  } catch (error) {
    // Server is offline or unreachable
    return {
      online: false,
      playerCount: 0,
      maxPlayers: 0,
    };
  }
}

/**
 * Check if there are any players currently online
 */
export async function hasActivePlayers(): Promise<boolean> {
  const status = await getServerStatus();
  return status.online && status.playerCount > 0;
}

/**
 * Wait for the Minecraft server to become online (useful after starting container)
 * @param maxAttempts Maximum number of attempts (default: 20)
 * @param delayMs Delay between attempts in milliseconds (default: 3000)
 */
export async function waitForServerOnline(
  maxAttempts: number = 20,
  delayMs: number = 3000
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await getServerStatus();
    if (status.online) {
      return true;
    }

    // Wait before next attempt
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return false;
}
