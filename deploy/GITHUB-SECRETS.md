# GitHub Repository Secrets

So'z: **Settings → Secrets and variables → Actions → Repository secrets**

Quyidagi secretlarni qo'shing yoki yangilang. Parollarni repoga commit qilmang.

## Majburiy secretlar

| Secret nomi | Qanday qiymat | Izoh |
|-------------|---------------|------|
| `DOCKER_USERNAME` | Docker Hub login | Masalan: `kurbanbayef` |
| `DOCKER_PASSWORD` | Docker Hub parol | [hub.docker.com](https://hub.docker.com) parolingiz |
| `DATABASE_URL` | Render PostgreSQL URL | `postgresql://USER:PASS@HOST/DB?schema=public&sslmode=require` |
| `EC2_HOST` | EC2 public IP | Faqat IP: `13.45.67.89` (`http://` qo'shmang) |
| `EC2_USER` | SSH foydalanuvchi | Ubuntu uchun: `ubuntu` |
| `EC2_SSH_KEY` | `.pem` fayl to'liq matni | `-----BEGIN RSA PRIVATE KEY-----` dan boshlab |
| `JWT_SECRET` | Tasodifiy 32+ belgi | `openssl rand -base64 32` natijasi |

## JWT_SECRET yaratish

EC2 yoki lokal terminalda:

```bash
openssl rand -base64 32
```

Chiqgan qiymatni `JWT_SECRET` ga qo'ying.

## EC2_SSH_KEY qanday olinadi

AWS dan yuklab olgan `.pem` faylni matn muharririda oching va **butun** mazmunini nusxalang:

```
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----
```

## DATABASE_URL namunasi

```
postgresql://USER:PASSWORD@HOST.oregon-postgres.render.com/DATABASE?schema=public&sslmode=require
```

Render dashboard → PostgreSQL → **External Database URL** dan nusxalang.

## Tekshirish

Secretlar to'g'ri bo'lsa, `master` branchga push qilganda GitHub Actions avtomatik:

1. Docker image build qiladi
2. `kurbanbayef/kiyim-chechak-backend` va `kurbanbayef/kiyim-chechak-frontend` ga push qiladi
3. EC2 ga SSH orqali ulanib `docker compose up -d` ishga tushiradi

Actions tab: `https://github.com/kurbanbayefoo6-dev/kiyim_chechak_fullstack/actions`
