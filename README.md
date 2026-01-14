# landing-page

Space VPS landing page with interactive 3D solar system visualization.

## Deployment

This project is configured to automatically deploy to a VPS via GitHub Actions when changes are pushed to the `main` branch.

### Setup Instructions

To enable automatic deployment, configure the following secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

1. **VPS_HOST** - Your VPS IP address or domain name
2. **VPS_USERNAME** - SSH username for your VPS
3. **VPS_SSH_KEY** - Private SSH key for authentication (entire key content)
4. **VPS_PORT** - SSH port (optional, defaults to 22)
5. **VPS_PROJECT_PATH** - Absolute path to the project directory on your VPS

### VPS Setup

On your VPS, ensure:
1. Git is installed
2. The project repository is cloned to the path specified in `VPS_PROJECT_PATH`
3. SSH key authentication is configured
4. Your web server (nginx/apache) is configured to serve from the project directory

Example commands on VPS:
```bash
cd /var/www
git clone <your-repo-url> landing-page
```

### Manual Deployment

To deploy manually:
```bash
ssh user@your-vps
cd /path/to/landing-page
git pull origin main
```