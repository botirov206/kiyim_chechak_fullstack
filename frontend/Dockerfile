# ---- Build stage ----
# bookworm-slim: Tailwind/Vite native modullari (lightningcss) Alpine da ishlamaydi
FROM node:20-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
# npm install: peer-deps va platform farqlari uchun (npm ci Docker da yiqiladi)
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY . .

# Same-origin API via Nginx proxy on EC2
ENV VITE_API_URL=/api

RUN npm run build

# ---- Production stage ----
FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
