# Quick Start Guide

Get your KUMAFORCE Minecraft Server up and running in 5 minutes.

## Prerequisites

- ✅ Docker + Portainer running on your home server
- ✅ Minecraft server container already created in Docker
- ✅ Node.js 18+ installed

## Step 1: Get Portainer API Key (2 minutes)

1. Open Portainer (usually `http://localhost:9000`)
2. Click your username → **My account**
3. Scroll to **Access tokens** → **+ Add access token**
4. Description: `Minecraft Server Control`
5. **Copy the API key** (starts with `ptr_`)

## Step 2: Find Container Name (1 minute)

1. In Portainer, go to **Containers**
2. Find your Minecraft server
3. Note the container **name** (e.g., `minecraft-server`)

## Step 3: Configure Environment (1 minute)

```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local  # or use any text editor
```

Update these values:
```bash
PORTAINER_URL=http://localhost:9000
PORTAINER_API_KEY=ptr_your_key_here
PORTAINER_CONTAINER_ID=minecraft-server
MINECRAFT_HOST=localhost
MINECRAFT_PORT=25565
SERVER_DISPLAY_ADDRESS=PLAY.KUMAFORCE.NET
```

Save and exit.

## Step 4: Install & Verify (1 minute)

```bash
# Install dependencies
npm install

# Verify configuration
npm run verify
```

If verification passes, you're good to go!

## Step 5: Run the Application (30 seconds)

```bash
# Start the web server
npm run dev
```

Open `http://localhost:3000` in your browser.

## That's It!

You should now see:
- ✅ The KUMAFORCE interface
- ✅ Current server status
- ✅ "WAKE UP SERVER" button (if offline)

### Test It

1. Click **"WAKE UP SERVER"**
2. Wait 30-60 seconds
3. Status should change from "Starting" to "Online"
4. Connect to your Minecraft server!

## Optional: Auto-Shutdown

To automatically shut down the server when empty:

```bash
# In a separate terminal
npm run auto-shutdown
```

Or set it up as a background service (see [SETUP.md](./SETUP.md#auto-shutdown-setup)).

## Troubleshooting

**"Failed to start container"**
- Check your API key is correct
- Verify container name matches exactly

**"Status always shows offline"**
- Make sure Minecraft server port is correct (default: 25565)
- Check if Minecraft server is actually running: `docker logs minecraft-server`

**Need more help?**
- Check [SETUP.md](./SETUP.md) for detailed instructions
- Run `npm run verify` to diagnose issues
- See [SETUP.md#troubleshooting](./SETUP.md#troubleshooting) for solutions

## What's Next?

- 📖 Read [SETUP.md](./SETUP.md) for production deployment
- ✅ Use [CHECKLIST.md](./CHECKLIST.md) to verify everything works
- 🎮 Start playing Minecraft!

---

**Quick Command Reference:**

```bash
npm run dev          # Start web interface
npm run verify       # Check configuration
npm run auto-shutdown # Start auto-shutdown monitor
npm run build        # Build for production
npm start           # Run production server
```
