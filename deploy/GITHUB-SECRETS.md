# GitHub Repository Secrets

So'z: **Settings → Secrets and variables → Actions → Repository secrets**

Quyidagi secretlarni qo'shing yoki yangilang. Parollarni repoga commit qilmang.

## Majburiy secretlar

| Secret nomi | Qanday qiymat | Izoh |
|-------------|---------------|------|
| `DOCKER_USERNAME` | Docker Hub **username** (email emas!) | [hub.docker.com](https://hub.docker.com) → profil → username |
| `DOCKER_PASSWORD` | Docker Hub **Access Token** | Account paroli emas — token yarating (quyida) |

### DOCKER_PASSWORD — Access Token yaratish (majburiy)

GitHub Actions da oddiy parol ko'pincha ishlamaydi (`unauthorized: incorrect username or password`).

1. [hub.docker.com/settings/security](https://hub.docker.com/settings/security) ga kiring
2. **New Access Token** → Description: `github-actions`
3. Permissions: **Read & Write**
4. **Generate** → tokenni nusxalang (faqat bir marta ko'rinadi!)
5. GitHub → `DOCKER_PASSWORD` secretni **o'chiring** va **qayta yarating** — tokenni qo'ying

> `DOCKER_USERNAME` = Docker Hub username (masalan `kurbanbayef`). Email ishlamaydi.
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

## Push xatosi (`denied: requested access to the resource is denied`)

Bu xato login muvaffaqiyatli, lekin **boshqa namespace** ga push qilishga urinilganda chiqadi.

| Sabab | Yechim |
|-------|--------|
| `DOCKER_USERNAME` noto'g'ri | [hub.docker.com/settings/general](https://hub.docker.com/settings/general) → **Username** ni aniq nusxalang |
| Token faqat Read | Yangi token — **Read & Write** permission |
| Image nomi boshqa userga tegishli | Workflow endi `${{ secrets.DOCKER_USERNAME }}/...` ishlatadi — username to'g'ri bo'lishi kerak |

`DOCKER_USERNAME` = Docker Hub dagi aniq username (masalan profilda `kurbanbayef` ko'rinsa, shuni qo'ying).

## Docker login xatosi (`unauthorized`)

| Sabab | Yechim |
|-------|--------|
| Oddiy parol ishlatilgan | **Access Token** ishlating (yuqoridagi qadam) |
| Username noto'g'ri | Email emas — Docker Hub **username** qo'ying |
| Bo'sh joy / yangi qator | Secretni o'chirib, qayta yarating (copy-paste da ortiqcha bo'shliq bo'lmasin) |
| 2FA yoqilgan | Faqat Access Token ishlaydi |
| Token faqat Read | **Read & Write** permission bilan yangi token yarating |

Lokal tekshirish (kompyuteringizda):

```bash
docker logout
docker login -u kurbanbayef
# Password o'rniga Access Token kiriting
```
