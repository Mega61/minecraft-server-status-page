# Setup Checklist

Use this checklist to verify your KUMAFORCE Minecraft Server setup is complete and working.

## Pre-Setup Verification

- [ ] Docker is installed and running on your home server
- [ ] Portainer is installed and accessible
- [ ] Minecraft server container exists in Docker/Portainer
- [ ] Node.js 18+ is installed
- [ ] You have terminal/SSH access to your server

## Portainer Configuration

- [ ] Logged into Portainer web interface
- [ ] Generated API access token from "My account" → "Access tokens"
- [ ] Copied API key (starts with `ptr_`)
- [ ] Found Minecraft container name/ID in Portainer → Containers

## Environment Setup

- [ ] Copied `.env.example` to `.env.local`
- [ ] Set `PORTAINER_URL` (e.g., `http://localhost:9000`)
- [ ] Set `PORTAINER_API_KEY` with your API key
- [ ] Set `PORTAINER_CONTAINER_ID` with container name/ID
- [ ] Set `MINECRAFT_HOST` (usually `localhost`)
- [ ] Set `MINECRAFT_PORT` (usually `25565`)
- [ ] Configured auto-shutdown settings (optional)
- [ ] Set `SERVER_DISPLAY_ADDRESS` (your domain or IP)

## Installation

- [ ] Ran `npm install` successfully
- [ ] No critical errors in installation

## Testing - Portainer Connection

Run this test to verify Portainer connectivity:

```bash
# Create a test file
cat > test-portainer.js << 'EOF'
const PORTAINER_URL = process.env.PORTAINER_URL || 'http://localhost:9000';
const PORTAINER_API_KEY = process.env.PORTAINER_API_KEY || '';

fetch(`${PORTAINER_URL}/api/endpoints`, {
  headers: {
    'X-API-Key': PORTAINER_API_KEY
  }
})
.then(res => res.ok ? console.log('✅ Portainer connection successful!') : console.log('❌ Portainer connection failed'))
.catch(err => console.log('❌ Error:', err.message));
EOF

# Run the test
node -r dotenv/config test-portainer.js dotenv_config_path=.env.local

# Clean up
rm test-portainer.js
```

- [ ] Portainer connection test passed

## Testing - Web Application

- [ ] Started development server: `npm run dev`
- [ ] Accessed `http://localhost:3000` in browser
- [ ] Page loads without errors
- [ ] Status indicator appears
- [ ] Can see "WAKE UP SERVER" button or current status

## Testing - API Endpoints

Open these URLs in your browser while the server is running:

- [ ] `http://localhost:3000/api/server/status` - Returns JSON with server status
- [ ] No errors in browser console (F12 → Console tab)

## Testing - Server Start

- [ ] Clicked "WAKE UP SERVER" button in the web UI
- [ ] Status changed to "Starting" (yellow)
- [ ] Container started in Portainer (check Portainer → Containers)
- [ ] After 30-60 seconds, status changed to "Online" (green)
- [ ] Server IP/address displayed on screen
- [ ] Can connect to Minecraft server from game

## Testing - Auto-Shutdown Monitor

- [ ] Started monitor: `npm run auto-shutdown`
- [ ] Monitor shows configuration (timeout, check interval)
- [ ] Monitor detects running container
- [ ] Monitor shows player activity status
- [ ] Monitor logs appear every check interval

## Production Setup (Optional)

- [ ] Built production version: `npm run build`
- [ ] Tested production server: `npm start`
- [ ] Set up process manager (pm2, systemd, etc.)
- [ ] Configured auto-shutdown monitor as background service
- [ ] Set up reverse proxy with SSL (if needed)
- [ ] Configured firewall rules
- [ ] Set services to start on boot

## Verification Tests

### Test 1: Full Startup Cycle
- [ ] Container is stopped in Portainer
- [ ] Web UI shows "Offline"
- [ ] Click "WAKE UP SERVER"
- [ ] Container starts in Portainer
- [ ] Web UI changes to "Starting"
- [ ] Minecraft server becomes responsive
- [ ] Web UI changes to "Online"
- [ ] Can connect from Minecraft client

### Test 2: Status Accuracy
- [ ] Web UI status matches Portainer container status
- [ ] Web UI status matches actual Minecraft server availability
- [ ] Player count shows correctly when players are online

### Test 3: Auto-Shutdown (if enabled)
- [ ] Auto-shutdown monitor is running
- [ ] Server has no players online
- [ ] Wait for inactivity timeout + check interval
- [ ] Monitor logs show countdown
- [ ] Container stops automatically
- [ ] Web UI updates to show "Offline"

## Common Issues Checklist

If something isn't working, check:

- [ ] `.env.local` file is in project root (not `.env.example`)
- [ ] No typos in environment variable names
- [ ] API key is correct and not expired
- [ ] Container name/ID matches exactly (case-sensitive)
- [ ] Portainer is running and accessible
- [ ] Minecraft server port is correct
- [ ] No firewall blocking connections
- [ ] Node.js version is 18 or higher
- [ ] All npm packages installed successfully

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (never committed to Git)
- [ ] Portainer API key is kept secret
- [ ] Using HTTPS if exposed to internet
- [ ] Considered adding authentication for web UI
- [ ] Firewall rules are configured
- [ ] Server is running behind reverse proxy (if public)

## All Done!

If all items above are checked, your setup is complete! 🎉

Next steps:
1. Share the server address with your friends
2. Monitor the logs to ensure everything runs smoothly
3. Customize the UI or add features as needed

For help, refer to:
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [README.md](./README.md) - Project overview
- Server logs - Check for error messages
