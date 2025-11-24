# Docker Deployment Guide

This guide explains how to run the KUMAFORCE Minecraft Server web application in a Docker container on your home server.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Building the Docker Image](#building-the-docker-image)
3. [Running the Container](#running-the-container)
4. [Important Considerations](#important-considerations)
5. [Environment Variables](#environment-variables)
6. [Network Configuration](#network-configuration)
7. [Adding to Portainer](#adding-to-portainer)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- ✅ Docker installed on your home server
- ✅ `.env.local` file configured with your settings
- ✅ Portainer running (for managing the container)
- ✅ Access to your home server terminal

---

## Building the Docker Image

### Step 1: Navigate to Project Directory

```bash
cd /path/to/kuma-force-minecraft-server
```

### Step 2: Build the Image

```bash
docker build -t kumaforce-web:latest .
```

This will:
- Install dependencies
- Build the Next.js application for production
- Create an optimized Docker image (~200MB)

**Note**: The build process takes a few minutes the first time.

---

## Running the Container

### Option 1: Using --env-file (Recommended)

```bash
docker run -d \
  --name kumaforce-web \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  kumaforce-web:latest
```

### Option 2: Mounting .env.local as Volume

```bash
docker run -d \
  --name kumaforce-web \
  --restart unless-stopped \
  -p 3000:3000 \
  -v "$(pwd)/.env.local:/app/.env.local:ro" \
  kumaforce-web:latest
```

### Option 3: Custom Port

If port 3000 is already in use, change the port mapping:

```bash
docker run -d \
  --name kumaforce-web \
  --restart unless-stopped \
  -p 8080:3000 \
  --env-file .env.local \
  kumaforce-web:latest
```

Then access at `http://your-server-ip:8080`

---

## Important Considerations

### 1. **Network Access**

When running in Docker, the container cannot use `localhost` to access services on the host machine. You **MUST** use IP addresses.

#### Portainer URL

❌ **DON'T USE:**
```bash
PORTAINER_URL=https://localhost:9443
```

✅ **USE YOUR SERVER'S IP:**
```bash
PORTAINER_URL=https://192.168.1.104:9443
```

#### Minecraft Server Host

❌ **DON'T USE:**
```bash
MINECRAFT_HOST=localhost
```

✅ **USE YOUR SERVER'S IP:**
```bash
MINECRAFT_HOST=192.168.1.104
```

**Your current .env.local is already configured correctly with IP addresses!**

### 2. **Firewall Rules**

Make sure your firewall allows:
- Incoming connections on port 3000 (or your custom port)
- Outgoing connections to Portainer port (9443)
- Outgoing connections to Minecraft port (25565)

### 3. **SSL Certificates**

The self-signed certificate handling will work the same way. Make sure your `.env.local` has:

```bash
PORTAINER_REJECT_UNAUTHORIZED=false
```

---

## Environment Variables

Your `.env.local` file should contain:

```bash
# Portainer Configuration
PORTAINER_URL=https://192.168.1.104:9443
PORTAINER_API_KEY=ptr_your_api_key_here
PORTAINER_CONTAINER_ID=minecraft-server
PORTAINER_ENDPOINT_ID=2
PORTAINER_REJECT_UNAUTHORIZED=false

# Minecraft Server Configuration
MINECRAFT_HOST=192.168.1.104
MINECRAFT_PORT=25565

# Auto-Shutdown Configuration
INACTIVITY_TIMEOUT_MINUTES=15
ACTIVITY_CHECK_INTERVAL_MINUTES=5

# Display Configuration
SERVER_DISPLAY_NAME=KUMAFORCE
SERVER_DISPLAY_ADDRESS=PLAY.KUMAFORCE.NET
```

**Important**: Use IP addresses instead of `localhost` when running in Docker!

---

## Network Configuration

### Host Network Mode (Alternative)

If you're having network issues, you can run the container in host network mode:

```bash
docker run -d \
  --name kumaforce-web \
  --restart unless-stopped \
  --network host \
  --env-file .env.local \
  kumaforce-web:latest
```

**Note**: With host network mode:
- The container uses the host's network directly
- Port mapping is not needed
- You can use `localhost` in environment variables
- Less isolation, but simpler networking

---

## Adding to Portainer

### Method 1: Via Portainer UI

1. Go to **Portainer** → **Containers** → **Add container**

2. **Basic settings:**
   - Name: `kumaforce-web`
   - Image: `kumaforce-web:latest`

3. **Port mapping:**
   - Host: `3000`
   - Container: `3000`

4. **Environment variables:**
   - Click **+ add environment variable** for each var in your `.env.local`
   - Or use **Advanced** → **Env file** if you have it on the server

5. **Restart policy:**
   - Set to: `Unless stopped`

6. Click **Deploy the container**

### Method 2: Via Docker Commands (Then Manage in Portainer)

1. Build and run using the commands above
2. The container will automatically appear in Portainer
3. You can then manage it through Portainer UI

---

## Container Management

### View Logs

```bash
docker logs kumaforce-web
```

### Follow Logs in Real-Time

```bash
docker logs -f kumaforce-web
```

### Stop Container

```bash
docker stop kumaforce-web
```

### Start Container

```bash
docker start kumaforce-web
```

### Restart Container

```bash
docker restart kumaforce-web
```

### Remove Container

```bash
docker stop kumaforce-web
docker rm kumaforce-web
```

### Rebuild After Code Changes

```bash
# Stop and remove old container
docker stop kumaforce-web
docker rm kumaforce-web

# Rebuild image
docker build -t kumaforce-web:latest .

# Run new container
docker run -d \
  --name kumaforce-web \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  kumaforce-web:latest
```

---

## Updating Environment Variables

If you need to change environment variables after the container is running:

### Method 1: Recreate Container

```bash
# Edit .env.local
nano .env.local

# Stop and remove container
docker stop kumaforce-web
docker rm kumaforce-web

# Run with updated env vars
docker run -d \
  --name kumaforce-web \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  kumaforce-web:latest
```

### Method 2: Via Portainer

1. Go to **Containers** → **kumaforce-web**
2. Click **Duplicate/Edit**
3. Update environment variables
4. Click **Deploy the container**
5. Choose **Replace** when prompted

---

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker logs kumaforce-web
```

**Common issues:**
- Port 3000 already in use → Use a different port
- Environment variables not loaded → Check --env-file path
- Build failed → Check Dockerfile and dependencies

### Can't Access Portainer

**Error**: "fetch failed" or "connection refused"

**Solution**: Make sure you're using your server's IP address, not `localhost`:

```bash
PORTAINER_URL=https://192.168.1.104:9443
```

### Can't Check Minecraft Server Status

**Error**: "Minecraft server is not responding"

**Solution**: Use IP address instead of localhost:

```bash
MINECRAFT_HOST=192.168.1.104
```

### Container Can't Access Host Services

**Problem**: The container can't reach services running on the host

**Solution 1**: Use host network mode
```bash
docker run -d --network host --env-file .env.local kumaforce-web:latest
```

**Solution 2**: Use host IP addresses in .env.local (already done in your config!)

### Port Already in Use

**Error**: "Bind for 0.0.0.0:3000 failed: port is already allocated"

**Solution**: Use a different port:
```bash
docker run -d -p 8080:3000 --env-file .env.local kumaforce-web:latest
```

---

## Performance and Resource Usage

### Expected Resource Usage

- **CPU**: <5% idle, <20% when checking status
- **Memory**: ~100-150 MB
- **Disk**: ~200 MB image size

### Monitoring

View resource usage:
```bash
docker stats kumaforce-web
```

---

## Security Best Practices

### 1. **Don't Include Secrets in Image**

✅ **DO**: Use `--env-file` or volume mounts
```bash
docker run --env-file .env.local kumaforce-web:latest
```

❌ **DON'T**: Hardcode secrets in Dockerfile or commit .env.local to Git

### 2. **Use Non-Root User**

The Dockerfile already runs the application as a non-root user (`nextjs`) for security.

### 3. **Keep Image Updated**

Rebuild periodically to get security updates:
```bash
docker build --no-cache -t kumaforce-web:latest .
```

### 4. **Limit Network Exposure**

If you don't need external access:
```bash
docker run -p 127.0.0.1:3000:3000 ...
```

This binds only to localhost.

---

## Auto-Shutdown Monitor in Docker

The auto-shutdown monitor is **not** included in the web app container by design. Run it separately:

### Option 1: Run on Host

```bash
npm run auto-shutdown
```

### Option 2: Create Separate Container

Create a separate Dockerfile for the monitor and run it as a sidecar container.

---

## Production Deployment Checklist

- [ ] Built Docker image successfully
- [ ] Configured .env.local with IP addresses (not localhost)
- [ ] Tested container starts without errors
- [ ] Can access web UI from browser
- [ ] Container can connect to Portainer
- [ ] Container can check Minecraft server status
- [ ] Restart policy set to `unless-stopped`
- [ ] Logs show no errors
- [ ] Added to Portainer for easy management
- [ ] Firewall rules configured

---

## Quick Reference

```bash
# Build
docker build -t kumaforce-web:latest .

# Run
docker run -d \
  --name kumaforce-web \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  kumaforce-web:latest

# Logs
docker logs -f kumaforce-web

# Restart
docker restart kumaforce-web

# Stop
docker stop kumaforce-web

# Remove
docker rm kumaforce-web

# Stats
docker stats kumaforce-web
```

---

## Need Help?

- Check container logs: `docker logs kumaforce-web`
- Verify network connectivity from inside container: `docker exec kumaforce-web ping 192.168.1.104`
- Test environment variables: `docker exec kumaforce-web env | grep PORTAINER`

Happy deploying! 🚀
