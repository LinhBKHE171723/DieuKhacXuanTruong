# Deploy Production Tren Ubuntu 24.04

Tai lieu nay dung cho repo hien tai voi mo hinh:

- `frontend`: website public React/Vite
- `admin`: trang quan tri React/Vite
- `backend`: API Node.js/Express
- `MongoDB Atlas`: database
- `AWS S3`: luu anh
- `Docker Compose`: chay nhieu container cung nhau
- `GitHub Actions`: build va tu dong deploy sau moi lan push len `main`

## 1. Mo hinh deploy

Mo hinh de xuat tren 1 VPS:

1. `reverse-proxy` container dung `Caddy`
2. `frontend` container chi phuc vu file static cua website
3. `admin` container chi phuc vu file static cua trang quan tri
4. `backend` container chay API Node.js

Luong request:

1. Khach vao `https://example.com`
2. Caddy tra website `frontend`
3. Khi frontend goi `/api/...`, Caddy chuyen request do sang `backend`
4. Khach vao `https://admin.example.com`
5. Caddy tra website `admin`
6. Khi admin goi `/api/...`, Caddy cung chuyen sang `backend`

Nhu vay:

- frontend va admin khong can mo port rieng ra internet
- backend khong can mo port 5000 ra internet
- chi can mo `80` va `443`
- SSL duoc Caddy tu xin va gia han neu DNS da tro dung vao VPS

## 2. Docker va container la gi

### Docker la gi

Docker la nen tang dong goi ung dung thanh mot moi truong chay on dinh.

Thay vi cai Node, Nginx, tool build truc tiep len may chu roi cau hinh tung thu bang tay, ban mo ta cach chay bang file:

- `Dockerfile`: cach build 1 image
- `compose.production.yml`: cach chay nhieu service cung luc

### Image la gi

Image la "ban dong goi" cua ung dung.

Vi du:

- image `backend` chua Node.js + source backend
- image `frontend` chua file build cua website

### Container la gi

Container la image dang chay.

Vi du:

- image la "ban cai dat"
- container la "chuong trinh dang chay"

Ban co the xoa container va chay lai container moi tu cung mot image. Dieu nay giup deploy on dinh va lap lai duoc.

### Docker Compose la gi

Day la cach khai bao nhieu container trong 1 file YAML duy nhat.

Trong repo nay, file [deploy/compose.production.yml](/mnt/c/Users/ASUS/Desktop/DieuKhac/deploy/compose.production.yml) mo ta ca 4 service: `reverse-proxy`, `frontend`, `admin`, `backend`.

## 3. CI/CD la gi trong repo nay

### CI

CI la buoc kiem tra code sau moi lan push:

1. GitHub Actions checkout code
2. cai dependencies
3. build `backend`
4. build `frontend`
5. build `admin`

Neu build loi, workflow dung lai, khong deploy.

### CD

Neu CI pass va ban push len nhanh `main`:

1. GitHub Actions SSH vao VPS
2. chay script [deploy/deploy.sh](/mnt/c/Users/ASUS/Desktop/DieuKhac/deploy/deploy.sh)
3. server `git pull --ff-only`
4. server chay `docker compose up -d --build`
5. container moi duoc build va thay the container cu

Workflow nam o [deploy.yml](/mnt/c/Users/ASUS/Desktop/DieuKhac/.github/workflows/deploy.yml).

## 4. Domain nen dung

Nen dung:

- website: `example.com`
- admin: `admin.example.com`

Ban can tro DNS:

- `A record` cua `example.com` -> IP VPS
- `A record` cua `admin.example.com` -> IP VPS

## 5. File quan trong da duoc them

- [backend/Dockerfile](/mnt/c/Users/ASUS/Desktop/DieuKhac/backend/Dockerfile)
- [frontend/Dockerfile](/mnt/c/Users/ASUS/Desktop/DieuKhac/frontend/Dockerfile)
- [admin/Dockerfile](/mnt/c/Users/ASUS/Desktop/DieuKhac/admin/Dockerfile)
- [deploy/Caddyfile](/mnt/c/Users/ASUS/Desktop/DieuKhac/deploy/Caddyfile)
- [deploy/compose.production.yml](/mnt/c/Users/ASUS/Desktop/DieuKhac/deploy/compose.production.yml)
- [deploy/.env.production.example](/mnt/c/Users/ASUS/Desktop/DieuKhac/deploy/.env.production.example)
- [deploy/deploy.sh](/mnt/c/Users/ASUS/Desktop/DieuKhac/deploy/deploy.sh)
- [.github/workflows/deploy.yml](/mnt/c/Users/ASUS/Desktop/DieuKhac/.github/workflows/deploy.yml)

## 6. Cach chuan bi VPS lan dau

### B1. Tao user deploy

Dang nhap VPS bang root, sau do tao user rieng:

```bash
adduser deploy
usermod -aG sudo deploy
```

### B2. Cai Docker va Docker Compose

Ubuntu 24.04 nen cai Docker bang apt repository chinh thuc cua Docker:

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker deploy
```

Dang xuat roi dang nhap lai user `deploy` de nhan group moi.

### B2.1. Mo firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### B3. Clone repo len server

SSH vao bang user `deploy`:

```bash
mkdir -p ~/apps
cd ~/apps
git clone <URL-GITHUB-REPO-CUA-BAN> dieu-khac
cd dieu-khac
```

Neu repo la `private`, VPS can quyen de `git pull` tu GitHub. Cach gon nhat:

1. tao 1 SSH key rieng tren VPS
2. them public key do vao `Deploy keys` cua repo GitHub
3. dung URL SSH khi clone, vi du: `git@github.com:username/repo.git`

Vi workflow hien tai deploy bang cach SSH vao VPS roi chay `git pull`, nen VPS phai tu lay duoc code moi.

### B4. Tao file env production

```bash
cp deploy/.env.production.example deploy/.env.production
nano deploy/.env.production
```

Dien cac gia tri that:

- `APP_DOMAIN`
- `ADMIN_DOMAIN`
- `LETSENCRYPT_EMAIL`
- `JWT_SECRET`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_PUBLIC_BASE_URL`

### B5. Deploy lan dau tren VPS

```bash
bash deploy/deploy.sh
```

Khi thanh cong:

- `https://example.com` mo frontend
- `https://admin.example.com` mo admin

## 7. Tao SSH key cho GitHub Actions deploy

Tren may cua ban:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy"
```

Ban se co:

- private key: giu bi mat
- public key: them vao VPS

Them public key vao VPS:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Paste public key vao file `authorized_keys`.

Luu y co 2 loai key khac nhau:

- `Key A`: GitHub Actions -> SSH vao VPS de chay deploy
- `Key B`: VPS -> GitHub de `git pull` neu repo la private

Khong nen nham 2 key nay voi nhau.

Lay `known_hosts`:

```bash
ssh-keyscan -H example.com
```

Hoac:

```bash
ssh-keyscan -H <IP-VPS>
```

## 8. Them secrets tren GitHub

Vao `Repository -> Settings -> Secrets and variables -> Actions`, tao:

- `DEPLOY_HOST`: domain hoac IP VPS
- `DEPLOY_USER`: `deploy`
- `DEPLOY_PATH`: duong dan repo tren server, vi du `/home/deploy/apps/dieu-khac`
- `DEPLOY_SSH_PRIVATE_KEY`: private key vua tao
- `DEPLOY_SSH_KNOWN_HOSTS`: output cua `ssh-keyscan -H`

## 9. Day code len GitHub va bat auto deploy

Sau khi repo da len GitHub:

```bash
git init
git add .
git commit -m "chore: add production deploy setup"
git branch -M main
git remote add origin <URL-GITHUB-REPO>
git push -u origin main
```

Tu lan sau:

```bash
git add .
git commit -m "your message"
git push origin main
```

Khi push len `main`:

1. GitHub Actions build 3 app
2. neu pass, workflow SSH vao VPS
3. VPS pull code moi va rebuild container
4. version moi len online

## 10. Cach kiem tra va xu ly loi

Xem container:

```bash
docker compose --env-file deploy/.env.production -f deploy/compose.production.yml ps
```

Xem log:

```bash
docker compose --env-file deploy/.env.production -f deploy/compose.production.yml logs -f
```

Chi xem backend:

```bash
docker compose --env-file deploy/.env.production -f deploy/compose.production.yml logs -f backend
```

## 11. Khi nao nen nang cap VPS

Can nhac nang cap len `2 vCPU / 4 GB RAM` neu:

- upload anh nhieu va hay bi cham
- RAM thuong xuyen cao
- backend restart do thieu RAM
- site co nhieu nguoi truy cap dong thoi

## 12. Ghi chu quan trong

- Khong can chay MongoDB trong VPS vi da dung Atlas
- Khong can luu anh local vi da dung S3
- Docker restart policy da giup container tu len lai sau reboot
- `admin` nen de tren subdomain rieng thay vi path `/admin` de tranh phuc tap router

## 13. Tai lieu chinh thuc tham khao

- GitHub Actions overview: https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions
- GitHub workflow syntax: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions
- GitHub encrypted secrets: https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets
- Docker tren Ubuntu: https://docs.docker.com/engine/install/ubuntu/
- Docker overview: https://docs.docker.com/get-started/docker-overview/
- Docker containers: https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/
- Docker Compose: https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-docker-compose/
