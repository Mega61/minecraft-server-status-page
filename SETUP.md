# KUMAFORCE Minecraft Server - Setup Guide

This guide will walk you through setting up your on-demand Minecraft server system with Portainer integration.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Portainer Setup](#portainer-setup)
3. [Environment Configuration](#environment-configuration)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Auto-Shutdown Setup](#auto-shutdown-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

- ✅ A home server running Docker
- ✅ Portainer installed and running (Community or Business Edition)
- ✅ A Minecraft server container already created in Docker
- ✅ Node.js 18+ installed on your server
- ✅ Access to your server's terminal

---

## Portainer Setup

### Step 1: Access Portainer

1. Open your web browser and navigate to your Portainer instance:
   - Usually `http://localhost:9000` or `http://localhost:9443`
   - Or `http://your-server-ip:9000`

2. Log in with your Portainer credentials

### Step 2: Generate API Key

1. Click on your **username** in the top-right corner
2. Select **My account** from the dropdown
3. Scroll down to **Access tokens** section
4. Click **+ Add access token**
5. Enter a description: `Minecraft Server Control`
6. Click **Add access token**
7. **IMPORTANT**: Copy the API key immediately! You won't be able to see it again.
   - It should look something like: `ptr_xxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Find Your Container ID

1. In Portainer, go to **Containers** in the left sidebar
2. Find your Minecraft server container in the list
3. The **Name** column shows your container name (e.g., `minecraft-server`)
4. Alternatively, you can use the container ID shown in the list
5. Note down either the name or ID - you'll need this for configuration

---

## Environment Configuration

### Step 1: Copy the Environment Template

```bash
cp .env.example .env.local
```

### Step 2: Edit `.env.local`

Open `.env.local` in your favorite text editor and configure the following:

```bash
# Portainer Configuration
PORTAINER_URL=http://localhost:9000
PORTAINER_API_KEY=ptr_your_actual_api_key_here
PORTAINER_CONTAINER_ID=minecraft-server

# If using HTTPS with self-signed certificate, uncomment this:
# PORTAINER_REJECT_UNAUTHORIZED=false

# Minecraft Server Configuration
MINECRAFT_HOST=localhost
MINECRAFT_PORT=25565

# Auto-Shutdown Configuration
INACTIVITY_TIMEOUT_MINUTES=15
ACTIVITY_CHECK_INTERVAL_MINUTES=5

# Display Configuration
SERVER_DISPLAY_NAME=KUMAFORCE
SERVER_DISPLAY_ADDRESS=PLAY.KUMAFORCE.NET
```

### Configuration Details

| Variable | Description | Example |
|----------|-------------|---------|
| `PORTAINER_URL` | URL of your Portainer instance | `http://localhost:9000` or `https://localhost:9443` |
| `PORTAINER_API_KEY` | API key from Step 2 | `ptr_xxxxxxxxxx` |
| `PORTAINER_CONTAINER_ID` | Container name or ID | `minecraft-server` |
| `PORTAINER_REJECT_UNAUTHORIZED` | Set to `false` for self-signed HTTPS certs (optional) | `false` |
| `MINECRAFT_HOST` | Server IP (use localhost if on same machine) | `localhost` |
| `MINECRAFT_PORT` | Minecraft server port | `25565` |
| `INACTIVITY_TIMEOUT_MINUTES` | Minutes of inactivity before shutdown | `15` |
| `ACTIVITY_CHECK_INTERVAL_MINUTES` | How often to check for players | `5` |
| `SERVER_DISPLAY_NAME` | Name shown in UI | `KUMAFORCE` |
| `SERVER_DISPLAY_ADDRESS` | Address players use to connect | `PLAY.KUMAFORCE.NET` |

---

## Installation

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Minecraft server utilities
- TypeScript and build tools

### Step 2: Build the Application (Optional)

For development, you can skip this step. For production:

```bash
npm run build
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

```bash
npm run build
npm start
```

### Accessing the UI

1. Open your browser to `http://localhost:3000` (or your server's IP)
2. You should see the KUMAFORCE interface
3. The status indicator will show the current server state
4. Click "WAKE UP SERVER" to start the Minecraft container

---

## Auto-Shutdown Setup

The auto-shutdown monitor runs as a separate process that watches for player activity and shuts down the server when it's been empty for too long.

### Running the Monitor

#### Option 1: Manual Start (Testing)

```bash
npm run auto-shutdown
```

Press `Ctrl+C` to stop the monitor.

#### Option 2: Background Process (Recommended)

**Using `screen` (Linux/Mac):**

```bash
# Start a new screen session
screen -S minecraft-monitor

# Run the monitor
npm run auto-shutdown

# Detach from screen: Press Ctrl+A, then D
```

To reconnect later:
```bash
screen -r minecraft-monitor
```

**Using `nohup` (Linux/Mac):**

```bash
nohup npm run auto-shutdown > auto-shutdown.log 2>&1 &
```

**Using `pm2` (Cross-platform, recommended):**

```bash
# Install pm2 globally
npm install -g pm2

# Start the monitor
pm2 start npm --name "minecraft-monitor" -- run auto-shutdown

# Save the process list
pm2 save

# Set pm2 to start on boot
pm2 startup
```

View logs:
```bash
pm2 logs minecraft-monitor
```

Stop the monitor:
```bash
pm2 stop minecraft-monitor
```

### Monitor Behavior

The auto-shutdown monitor:
- Checks for players every 5 minutes (configurable)
- Starts an inactivity timer when no players are detected
- Shuts down the container after 15 minutes of inactivity (configurable)
- Resets the timer if players join during the countdown
- Only monitors when the container is running

---

## Troubleshooting

### Self-Signed Certificate Error

**Error**: "fetch failed" with "Error: self-signed certificate" or "DEPTH_ZERO_SELF_SIGNED_CERT"

**Cause**: Your Portainer instance is using HTTPS with a self-signed SSL certificate, and Node.js refuses to connect because it can't verify the certificate.

**Solutions**:

**Option 1: Use HTTP instead (recommended for localhost)**

If your Portainer is running on the same machine, switch to HTTP:

1. Open `.env.local`
2. Change `PORTAINER_URL=https://localhost:9443` to `PORTAINER_URL=http://localhost:9000`
3. Save and restart the dev server

**Option 2: Allow self-signed certificate**

If you must use HTTPS with a self-signed certificate:

1. Open `.env.local`
2. Add this line:
   ```bash
   PORTAINER_REJECT_UNAUTHORIZED=false
   ```
3. Keep `PORTAINER_URL=https://localhost:9443`
4. Save and restart the dev server

**Note**: Option 2 disables SSL verification, which is fine for localhost but not recommended for remote/production servers.

### Container Won't Start

**Error**: "Failed to start container"

**Solutions**:
1. Verify your Portainer API key is correct:
   ```bash
   echo $PORTAINER_API_KEY
   ```

2. Check that the container exists:
   - Log into Portainer
   - Go to Containers
   - Verify the container name matches your config

3. Test Portainer connection:
   - Try accessing `http://localhost:9000/api/endpoints` in your browser
   - You should see JSON response (requires API key header)

### Status Shows "Offline" When Server is Running

**Problem**: The Minecraft server status check is failing

**Solutions**:
1. Verify Minecraft server port is correct:
   - Check your Minecraft server's `server.properties`
   - Look for `server-port=25565`
   - Update `MINECRAFT_PORT` in `.env.local` if different

2. Check firewall rules:
   ```bash
   # Linux: Check if port is accessible
   nc -zv localhost 25565
   ```

3. Verify Minecraft server is actually running:
   ```bash
   docker logs minecraft-server
   ```

### Auto-Shutdown Not Working

**Problem**: Server doesn't shut down after inactivity

**Solutions**:
1. Check if the monitor is running:
   ```bash
   # If using pm2
   pm2 list

   # If using screen
   screen -list
   ```

2. View monitor logs:
   ```bash
   # If using pm2
   pm2 logs minecraft-monitor

   # If using nohup
   tail -f auto-shutdown.log
   ```

3. Verify environment variables are loaded:
   - The monitor script loads from `.env.local`
   - Make sure the file is in the project root

### API Errors in Browser Console

**Error**: "Failed to fetch"

**Solutions**:
1. Make sure the Next.js server is running:
   ```bash
   npm run dev  # or npm start for production
   ```

2. Check if API routes are accessible:
   - Open `http://localhost:3000/api/server/status`
   - You should see JSON status response

3. Look at server logs for errors:
   - Terminal where you ran `npm run dev`
   - Look for error messages

### Minecraft-Server-Util Deprecation Warning

**Note**: The `minecraft-server-util` package is deprecated but still functional.

**Alternative**: Use mcstatus.io API (requires internet):
- Endpoint: `https://api.mcstatus.io/v2/status/java/{host}:{port}`
- Modify `lib/minecraft.ts` to use fetch instead

---

## Security Considerations

### Important Security Notes

1. **API Key Protection**:
   - Never commit `.env.local` to Git (it's in `.gitignore`)
   - Keep your Portainer API key secret
   - If exposed, regenerate it in Portainer

2. **Network Access**:
   - If exposing to internet, use HTTPS
   - Consider adding authentication to the Next.js app
   - Use a reverse proxy (nginx/Caddy) with SSL

3. **Portainer Access**:
   - If possible, keep Portainer on local network only
   - Use strong passwords for Portainer
   - Regularly update Portainer

---

## Next Steps

Once everything is set up:

1. ✅ Test starting the server from the web UI
2. ✅ Verify you can connect to Minecraft
3. ✅ Start the auto-shutdown monitor
4. ✅ Test the auto-shutdown by leaving the server empty
5. ✅ Set up the monitor to run on boot (using pm2 or systemd)

---

## Need Help?

If you're still having issues:
1. Check the logs (browser console, server terminal, monitor logs)
2. Verify all environment variables are set correctly
3. Test each component individually (Portainer, Minecraft, Next.js)
4. Create an issue in the repository with error details

---

## System Service Setup (Advanced)

For a production setup, you might want to run both the Next.js app and auto-shutdown monitor as system services.

### Using systemd (Linux)

Create `/etc/systemd/system/minecraft-web.service`:

```ini
[Unit]
Description=Minecraft Server Web Interface
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/kuma-force-minecraft-server
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Create `/etc/systemd/system/minecraft-monitor.service`:

```ini
[Unit]
Description=Minecraft Auto-Shutdown Monitor
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/kuma-force-minecraft-server
ExecStart=/usr/bin/npm run auto-shutdown
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable minecraft-web minecraft-monitor
sudo systemctl start minecraft-web minecraft-monitor
```

---

Happy gaming! 🎮🔥
