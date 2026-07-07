#!/usr/bin/env bash
# One-time production server bootstrap for the Dev Starter app.
# Installs Docker, nginx, and an nginx reverse proxy for the production app.

set -euo pipefail

APP_DOMAIN="${APP_DOMAIN:-dev-starter.example.com}"
APP_PORT="${APP_PORT:-3000}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_TEMPLATE="${SCRIPT_DIR}/../../infrastructure/nginx/dev-starter.conf"

if [ "$(id -u)" -eq 0 ]; then
  echo "Run as a non-root sudo user. This script uses sudo where needed." >&2
  exit 1
fi

echo "=== Dev Starter production bootstrap ==="
echo "Domain: ${APP_DOMAIN}"
echo "App port: ${APP_PORT}"

if ! command -v docker >/dev/null 2>&1; then
  echo "=== Installing Docker ==="
  curl -fsSL https://get.docker.com | sudo sh
fi

sudo usermod -aG docker "$USER" || true

echo "=== Installing nginx and certbot ==="
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  nginx certbot python3-certbot-nginx curl

echo "=== Creating app directory ==="
mkdir -p "$HOME/dev-starter"
chmod 750 "$HOME/dev-starter"

echo "=== Installing nginx site config ==="
if [ ! -f "$NGINX_TEMPLATE" ]; then
  echo "Missing nginx template at ${NGINX_TEMPLATE}" >&2
  exit 1
fi

sudo cp "$NGINX_TEMPLATE" "/etc/nginx/sites-available/${APP_DOMAIN}"
sudo sed -i "s/dev-starter.example.com/${APP_DOMAIN}/g" "/etc/nginx/sites-available/${APP_DOMAIN}"
sudo sed -i "s/127.0.0.1:3000/127.0.0.1:${APP_PORT}/g" "/etc/nginx/sites-available/${APP_DOMAIN}"
sudo ln -sf "/etc/nginx/sites-available/${APP_DOMAIN}" "/etc/nginx/sites-enabled/${APP_DOMAIN}"
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

if [ -n "$CERTBOT_EMAIL" ]; then
  echo "=== Obtaining TLS certificate ==="
  sudo certbot --nginx -d "$APP_DOMAIN" --non-interactive --agree-tos -m "$CERTBOT_EMAIL"
  sudo systemctl reload nginx
else
  echo "Skipping TLS certificate. Set CERTBOT_EMAIL to enable Certbot."
fi

echo "=== Bootstrap complete ==="
echo "Next: deploy with infrastructure/docker/docker-compose.prod.yml and verify /api/health."
