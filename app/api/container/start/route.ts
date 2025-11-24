/**
 * API Route: Start Container
 * POST /api/container/start
 *
 * Starts the Minecraft server container via Portainer API
 */

import { NextResponse } from 'next/server';
import { startContainer, getContainerState } from '@/lib/portainer';

export async function POST() {
  try {
    // Check current state
    const currentState = await getContainerState();

    if (currentState.status === 'running') {
      return NextResponse.json(
        {
          success: true,
          message: 'Container is already running',
          status: 'running',
        },
        { status: 200 }
      );
    }

    // Start the container
    await startContainer();

    return NextResponse.json(
      {
        success: true,
        message: 'Container start command sent successfully',
        status: 'starting',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error starting container:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to start container',
        status: 'error',
      },
      { status: 500 }
    );
  }
}
