#!/usr/bin/env bash
# First-time Ubuntu EC2 setup for Kiyim Chechak full-stack
# Run as ubuntu user: bash deploy/ec2-setup.sh
#
# Prerequisites:
#   - Ubuntu 22.04 or 24.04 EC2 instance
#   - Security Group: inbound TCP 22, 80, 443 (do NOT open 3000 publicly)
#   - backend/.env configured with DATABASE_URL, JWT_SECRET, CORS_ORIGIN

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/kiyim-chechak}"
REPO_URL="${REPO_URL:-https://github.com/kurbanbayefoo6-dev/kiyim_chechak_fullstack.git}"
RUN_SEED="${RUN_SEED:-true}"

echo "==> Kiyim Chechak EC2 Setup"
echo "    App dir:  ${APP_DIR}"
echo "    Repo:     ${REPO_URL}"

# --- System packages ---
echo "==> Installing system packages..."
sudo apt-get update -y
sudo apt-get install -y curl git nginx

# --- Node.js 20 ---
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  echo "==> Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "    Node: $(node -v)"
echo "    npm:  $(npm -v)"

# --- Clone or update repo ---
if [ ! -d "${APP_DIR}/.git" ]; then
  echo "==> Cloning repository..."
  sudo mkdir -p "${APP_DIR}"
  sudo chown ubuntu:ubuntu "${APP_DIR}"
  git clone "${REPO_URL}" "${APP_DIR}"
else
  echo "==> Repository already exists, pulling latest..."
  cd "${APP_DIR}"
  git pull origin master || git pull origin main
fi

cd "${APP_DIR}"

# --- Backend .env check ---
if [ ! -f backend/.env ]; then
  echo ""
  echo "WARNING: backend/.env not found!"
  echo "  1. cp deploy/env/backend.env.example backend/.env"
  echo "  2. Edit backend/.env — set DATABASE_URL, JWT_SECRET, CORS_ORIGIN"
  echo "  3. Re-run: bash deploy/ec2-setup.sh"
  echo ""
  cp deploy/env/backend.env.example backend/.env
  echo "Created backend/.env from template — EDIT IT before continuing!"
  exit 1
fi

# --- Nginx ---
echo "==> Configuring Nginx..."
sudo cp deploy/nginx/kiyim-chechak.conf /etc/nginx/sites-available/kiyim-chechak
sudo ln -sf /etc/nginx/sites-available/kiyim-chechak /etc/nginx/sites-enabled/kiyim-chechak
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

# --- Systemd backend service ---
echo "==> Configuring systemd service..."
sudo cp deploy/systemd/kiyim-chechak-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable kiyim-chechak-backend

# --- Build & deploy ---
echo "==> Running initial deploy..."
RUN_SEED="${RUN_SEED}" bash deploy/deploy.sh

echo ""
echo "============================================"
echo "  Setup complete!"
echo "  Open in browser: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP')"
echo "  Health check:    curl http://localhost/api/health"
echo "  Backend logs:    sudo journalctl -u kiyim-chechak-backend -f"
echo ""
echo "  Default admin (if seeded):"
echo "    Email:    admin@example.com"
echo "    Password: Admin123!"
echo "============================================"
