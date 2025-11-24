# KUMAFORCE Minecraft Server

A brutalist-styled web interface for managing your on-demand Minecraft server with Portainer integration. Start your Minecraft server container with a single click, and let it automatically shut down when nobody's playing.

![Status: Online](https://img.shields.io/badge/status-online-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **On-Demand Server Starting**: Wake up your Minecraft server container with one click
- **Real-Time Status Monitoring**: See live server status and player count
- **Automatic Shutdown**: Saves resources by stopping the server after inactivity
- **Portainer Integration**: Full Docker container management via Portainer API
- **Brutalist UI Design**: Bold, unapologetic interface with Gen-Z vibes
- **Player Activity Tracking**: Shows current player count when online

## Screenshots

The interface features:
- Real-time server status (Online/Offline/Starting)
- One-click server wake-up button
- Player count display
- Server IP/address display
- Auto-updating status checks

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes
- **Container Management**: Portainer API
- **Server Status**: Minecraft Server Util
- **Monitoring**: Node.js background service

## Quick Start

### Prerequisites

- Docker with Portainer installed
- A Minecraft server container in Docker
- Node.js 18+ installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kuma-force-minecraft-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your settings:
   - Portainer URL and API key
   - Container ID/name
   - Minecraft server details

4. **Run the application**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

5. **Start auto-shutdown monitor** (optional)
   ```bash
   npm run auto-shutdown
   ```

### Docker Deployment (Recommended for Production)

Run the entire application in a Docker container on your home server:

```bash
# Build the Docker image
docker build -t kumaforce-web:latest .

# Run the container
docker run -d \
  --name kumaforce-web \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  kumaforce-web:latest
```

🐳 **For detailed Docker instructions, see [DOCKER.md](./DOCKER.md)**

📖 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## Project Structure

```
kuma-force-minecraft-server/
├── app/
│   ├── api/
│   │   ├── container/start/    # Container start endpoint
│   │   └── server/status/      # Status check endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── server-card.tsx         # Main UI component
│   ├── status-indicator.tsx    # Status display
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── portainer.ts           # Portainer API utilities
│   ├── minecraft.ts           # Minecraft status checking
│   └── utils.ts
├── scripts/
│   └── auto-shutdown.ts       # Auto-shutdown monitor
├── .env.example               # Environment template
└── SETUP.md                   # Detailed setup guide
```

## How It Works

### Starting the Server

1. User clicks "WAKE UP SERVER" button
2. Frontend calls `/api/container/start`
3. Backend uses Portainer API to start the Docker container
4. Status changes to "Starting"
5. Frontend polls `/api/server/status` every 3 seconds
6. Once Minecraft server responds to status checks, status changes to "Online"

### Auto-Shutdown

1. Background monitor checks player count every 5 minutes
2. If no players detected, inactivity timer starts
3. After 15 minutes of inactivity (configurable), container is stopped
4. Timer resets if players join during countdown

### Status Checking

The system checks two things:
- **Container Status**: Is the Docker container running? (via Portainer)
- **Minecraft Status**: Is the Minecraft server responding? (via server ping)

Overall status:
- **Offline**: Container is stopped
- **Starting**: Container running but Minecraft not yet responding
- **Online**: Both container and Minecraft server are running

## Configuration

All configuration is done via environment variables in `.env.local`:

```bash
# Portainer
PORTAINER_URL=http://localhost:9000
PORTAINER_API_KEY=ptr_xxxxx
PORTAINER_CONTAINER_ID=minecraft-server

# Minecraft
MINECRAFT_HOST=localhost
MINECRAFT_PORT=25565

# Auto-Shutdown
INACTIVITY_TIMEOUT_MINUTES=15
ACTIVITY_CHECK_INTERVAL_MINUTES=5

# Display
SERVER_DISPLAY_NAME=KUMAFORCE
SERVER_DISPLAY_ADDRESS=PLAY.KUMAFORCE.NET
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/server/status` | GET | Get current server and container status |
| `/api/container/start` | POST | Start the Minecraft server container |

## Development

```bash
# Run development server
npm run dev

# Run auto-shutdown monitor (separate terminal)
npm run auto-shutdown

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

## Troubleshooting

Common issues and solutions:

**Container won't start**
- Verify Portainer API key is correct
- Check container ID/name matches exactly
- Ensure Portainer is accessible

**Status always shows offline**
- Check Minecraft server port (default: 25565)
- Verify Minecraft server is actually running in container
- Check firewall rules

**Auto-shutdown not working**
- Ensure monitor script is running
- Check environment variables are set
- View logs for errors

For detailed troubleshooting, see [SETUP.md](./SETUP.md#troubleshooting).

## Production Deployment

For production use on your home server:

1. Build the Next.js application
2. Set up reverse proxy (nginx/Caddy) with SSL
3. Run Next.js as a system service (systemd/pm2)
4. Run auto-shutdown monitor as a service
5. Configure firewall rules

See [SETUP.md - System Service Setup](./SETUP.md#system-service-setup-advanced) for details.

## Security Notes

- Never commit `.env.local` (already in `.gitignore`)
- Keep Portainer API key secure
- Use HTTPS if exposing to internet
- Consider adding authentication for production
- Regularly update dependencies

## License

MIT

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Portainer](https://www.portainer.io/)
- [minecraft-server-util](https://www.npmjs.com/package/minecraft-server-util)

---

Made with 🔥 for KUMAFORCE
