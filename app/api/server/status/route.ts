/**
 * API Route: Server Status
 * GET /api/server/status
 *
 * Returns the combined status of both the container and Minecraft server
 */

import { NextResponse } from 'next/server';
import { getContainerState } from '@/lib/portainer';
import { getServerStatus } from '@/lib/minecraft';

export interface ServerStatusResponse {
  container: {
    status: 'running' | 'stopped' | 'starting' | 'unknown';
    containerName?: string;
  };
  minecraft: {
    online: boolean;
    playerCount: number;
    maxPlayers: number;
    version?: string;
    motd?: string;
  };
  overallStatus: 'online' | 'offline' | 'starting';
  displayAddress?: string;
}

export async function GET() {
  try {
    // Get both container and Minecraft server status
    const [containerState, minecraftStatus] = await Promise.all([
      getContainerState(),
      getServerStatus(),
    ]);

    // Determine overall status
    let overallStatus: 'online' | 'offline' | 'starting' = 'offline';

    if (containerState.status === 'running' && minecraftStatus.online) {
      overallStatus = 'online';
    } else if (containerState.status === 'running' || containerState.status === 'starting') {
      // Container is running but Minecraft server not yet responding
      overallStatus = 'starting';
    }

    const response: ServerStatusResponse = {
      container: {
        status: containerState.status,
        containerName: containerState.containerName,
      },
      minecraft: {
        online: minecraftStatus.online,
        playerCount: minecraftStatus.playerCount,
        maxPlayers: minecraftStatus.maxPlayers,
        version: minecraftStatus.version,
        motd: minecraftStatus.motd,
      },
      overallStatus,
      displayAddress: process.env.SERVER_DISPLAY_ADDRESS || undefined,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error getting server status:', error);

    return NextResponse.json(
      {
        container: { status: 'unknown' },
        minecraft: { online: false, playerCount: 0, maxPlayers: 0 },
        overallStatus: 'offline',
        error: error instanceof Error ? error.message : 'Failed to get status',
      },
      { status: 500 }
    );
  }
}

// Disable caching for this endpoint to always get fresh status
export const dynamic = 'force-dynamic';
export const revalidate = 0;
