# Kiyim Chechak — PM2 + Nginx Deployment

Manual server setup once, then GitHub Actions redeploys on every push to `master` / `main`.

**Domain:** `https://kiyim-chechak.kahoot.uz`

## Part 0 — Switching from Docker (if needed)

If you previously ran Docker on this server:

```bash
cd /var/www/kiyim-chechak/deploy 2>/dev/null && \
  sudo docker compose -f docker-compose.prod.yml down 2>/dev/null || true
sudo docker stop kiyim-chechak-backend kiyim-chechak-frontend 2>/dev/null || true
sudo systemctl stop kiyim-chechak-backend 2>/dev/null || true
```

## Architecture

```text
Browser → Nginx (:80/:443)
            ├── /       → frontend/dist (static React SPA)
            └── /api/*  → localhost:3000 (Express, PM2)
                              │
                              ▼
                        PostgreSQL (Render / external)
```

## Part 1 — Server prerequisites

Ubuntu 22.04/24.04 EC2. Security group: ports **22**, **80**, **443**.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx certbot python3-certbot-nginx

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## Part 2 — DNS

| Host | Type | Value |
|------|------|-------|
| `kiyim-chechak` | A | Your EC2 public IP |

Verify:

```bash
dig kiyim-chechak.kahoot.uz +short
```

## Part 3 — Clone and configure (one time)

```bash
sudo mkdir -p /var/www/kiyim-chechak
sudo chown ubuntu:ubuntu /var/www/kiyim-chechak
git clone https://github.com/botirov206/kiyim_chechak_fullstack.git /var/www/kiyim-chechak
cd /var/www/kiyim-chechak
```

### Backend `.env`

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://USER:PASS@HOST/DB?schema=public&sslmode=require"
JWT_SECRET="<openssl rand -base64 32>"
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://kiyim-chechak.kahoot.uz
LOG_LEVEL=info
```

Build backend and run migrations:

```bash
cd /var/www/kiyim-chechak/backend
npm ci --omit=dev
npm run build
npx prisma migrate deploy
npx prisma db seed   # first time only
```

### Frontend build

```bash
cd /var/www/kiyim-chechak/frontend
echo "VITE_API_URL=/api" > .env.production
npm ci
npm run build
```

## Part 4 — PM2

```bash
cd /var/www/kiyim-chechak
pm2 start ecosystem.config.cjs
pm2 status
pm2 startup systemd   # run the command it prints
pm2 save
```

Verify:

```bash
curl http://localhost:3000/api/health
```

## Part 5 — Nginx

```bash
sudo nano /etc/nginx/sites-available/kiyim-chechak
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name kiyim-chechak.kahoot.uz;

    root /var/www/kiyim-chechak/frontend/dist;
    index index.html;

    client_max_body_size 10M;

    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
```

Enable and test:

```bash
sudo ln -sf /etc/nginx/sites-available/kiyim-chechak /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

Open `http://kiyim-chechak.kahoot.uz` in a browser before SSL.

## Part 6 — HTTPS (one time)

```bash
sudo certbot --nginx -d kiyim-chechak.kahoot.uz
sudo certbot renew --dry-run
```

## Part 7 — GitHub Actions CI/CD

Add these secrets to **your fork** → Settings → Secrets → Actions:

| Secret | Example | Notes |
|--------|---------|-------|
| `EC2_HOST` | `13.45.67.89` | EC2 public IP |
| `EC2_USER` | `ubuntu` | SSH user |
| `EC2_SSH_KEY` | `.pem` or deploy key | Full private key |

Push to `master` → workflow SSHs in, pulls code, rebuilds, restarts PM2, rebuilds frontend, reloads Nginx.

Actions: `https://github.com/botirov206/kiyim_chechak_fullstack/actions`

## Part 8 — Manual update (without CI/CD)

```bash
cd /var/www/kiyim-chechak
git pull

cd backend && npm ci --omit=dev && npm run build && npx prisma migrate deploy
cd .. && pm2 restart kiyim-chechak-backend

cd frontend && echo "VITE_API_URL=/api" > .env.production && npm ci && npm run build
sudo nginx -t && sudo systemctl reload nginx
```

## Useful commands

```bash
pm2 status
pm2 logs kiyim-chechak-backend
pm2 restart kiyim-chechak-backend

sudo nginx -t
sudo systemctl status nginx
curl https://kiyim-chechak.kahoot.uz/api/health
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 502 Bad Gateway | `pm2 status` — backend must be running on :3000 |
| CORS error | Set `CORS_ORIGIN=https://kiyim-chechak.kahoot.uz` in `backend/.env`, then `pm2 restart kiyim-chechak-backend` |
| SPA 404 on refresh | Check Nginx `try_files` block |
| DB auth failed | Verify `DATABASE_URL` in `backend/.env` |
| CI/CD SSH fails | Check `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` secrets |

Default admin (if seeded):

- Email: `admin@example.com`
- Password: `Admin123!`
