# Dieu Khac Platform

Hệ thống website hoàn chỉnh cho lĩnh vực điêu khắc thạch cao, bê tông mỹ thuật, hoa văn công trình, phù điêu, tượng, bê tông đúc sẵn và các chi tiết trang trí kiến trúc.

## Stack hiện tại

- `frontend/`: React + Vite + React Router + TanStack Query
- `admin/`: React + Vite + Ant Design + React Query
- `backend/`: Node.js + Express + Mongoose theo MVC
- Database: `MongoDB Atlas`
- Upload media: `AWS S3`

## Cấu trúc source

```text
.
├─ frontend/
│  ├─ node_modules/
│  └─ package-lock.json
├─ admin/
│  ├─ node_modules/
│  └─ package-lock.json
├─ backend/
│  ├─ node_modules/
│  ├─ package-lock.json
│  └─ src/
│     ├─ config/
│     ├─ controllers/
│     ├─ database/
│     ├─ middlewares/
│     ├─ models/
│     ├─ routes/
│     ├─ services/
│     ├─ utils/
│     └─ validations/
└─ package.json
```

Root không dùng `npm workspaces` nữa. Mỗi app có `node_modules` riêng đúng theo yêu cầu.

## Tính năng

### Public website

- Trang chủ động lấy banner, section, settings, featured products/projects/categories từ API
- Hero banner toàn chiều ngang, slider mượt, phong cách tân cổ điển sáng, animation nhẹ, ảnh tối ưu `object-fit` + lazy load
- Trang giới thiệu động
- Danh sách sản phẩm + tìm kiếm + lọc danh mục
- Chi tiết sản phẩm + gallery nhiều ảnh + sản phẩm liên quan
- Danh sách công trình + chi tiết công trình
- Trang liên hệ gửi form về backend
- Responsive, lazy loading ảnh, loading/empty/error state, SEO cơ bản

### Admin

- Đăng nhập JWT
- Dashboard thống kê nhanh
- Quản lý banner đầy đủ: danh sách, thêm/sửa/xóa, kéo-thả đổi thứ tự, bật/tắt hiển thị, đánh dấu nổi bật, preview ngay sau khi tải ảnh
- CRUD danh mục, sản phẩm, công trình
- Sản phẩm và công trình hỗ trợ tải nhiều ảnh
- Quản lý trang tĩnh `home`, `about`
- Quản lý liên hệ
- Quản lý media AWS S3
- Quản lý cấu hình hệ thống, logo, favicon, SEO, hotline, email, địa chỉ

## Env

File mẫu:

- Root: [`.env.example`](/mnt/c/Users/ASUS/Desktop/DieuKhac/.env.example)
- Backend: [`backend/.env.example`](/mnt/c/Users/ASUS/Desktop/DieuKhac/backend/.env.example)
- Frontend: [`frontend/.env.example`](/mnt/c/Users/ASUS/Desktop/DieuKhac/frontend/.env.example)
- Admin: [`admin/.env.example`](/mnt/c/Users/ASUS/Desktop/DieuKhac/admin/.env.example)

File local đã được tạo:

- `backend/.env`
- `frontend/.env`
- `admin/.env`

Biến backend quan trọng:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Cài package

### Cách 1: cài từng app

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

### Cách 2: dùng helper từ root

```bash
npm run install:all
```

## Chạy dự án

### Seed MongoDB Atlas

```bash
cd backend
npm run seed
```

Hoac:

```bash
npm run seed
```

Lệnh này sẽ xóa dữ liệu cũ trong database `dieu_khac` trên Atlas và seed lại toàn bộ demo data.

### Đồng bộ lại nội dung demo tiếng Việt có dấu mà không xóa database

```bash
cd backend
npm run sync:demo-content
```

Lệnh này cập nhật lại settings, pages, categories, banners, products và projects mẫu theo bộ nội dung tiếng Việt mới, nhưng không `drop database`.

### Chạy từng app

```bash
cd backend && npm run dev
cd frontend && npm run dev
cd admin && npm run dev
```

### Chạy nhanh từ root

```bash
npm run dev
```

Mặc định:

- Backend API: `http://localhost:5000`
- Public website: `http://localhost:5173`
- Admin: `http://localhost:5174`

## Build

### Từng app

```bash
cd backend && npm run build
cd frontend && npm run build
cd admin && npm run build
```

### Từ root

```bash
npm run build
```

## Deploy nhanh bằng IP trước

Truong hop chua tro domain, co the deploy bang IP server va tach admin sang port `8080`:

- Public website: `http://SERVER_IP`
- Admin: `http://SERVER_IP:8080`
- API: `http://SERVER_IP/api`

File lien quan:

- [`deploy/Caddyfile.ip`](/mnt/c/Users/ASUS/Desktop/DieuKhac/deploy/Caddyfile.ip)
- [`deploy/compose.ip.yml`](/mnt/c/Users/ASUS/Desktop/DieuKhac/deploy/compose.ip.yml)
- [`deploy/.env.ip.example`](/mnt/c/Users/ASUS/Desktop/DieuKhac/deploy/.env.ip.example)
- [`deploy/deploy-ip.sh`](/mnt/c/Users/ASUS/Desktop/DieuKhac/deploy/deploy-ip.sh)

Tren server:

```bash
git clone <repo-url>
cd DieuKhac
cp deploy/.env.ip.example deploy/.env.ip
```

Sua `deploy/.env.ip`:

- `SERVER_IP`
- `DEPLOY_BRANCH`
- `JWT_SECRET`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Chay deploy:

```bash
chmod +x deploy/deploy-ip.sh
./deploy/deploy-ip.sh
```

Mo firewall / security group:

- `80/tcp`
- `8080/tcp`

Khi da co domain, chuyen sang bo file `deploy/compose.production.yml` + `deploy/Caddyfile` de bat HTTPS.

Neu dung GitHub Actions auto deploy theo IP, workflow se SSH vao VPS va chay `deploy/deploy-ip.sh`. Script nay se `git pull` nhanh `DEPLOY_BRANCH` roi rebuild container.

## Tài khoản admin demo

- Email: `admin@dieu-khac.vn`
- Password: `Admin@123456`

## Collections MongoDB

- `users`
- `banners`
- `categories`
- `products`
- `productimages`
- `projects`
- `projectimages`
- `contacts`
- `settings`
- `pages`
- `media`

Tất cả schema đều có `createdAt` và `updatedAt` thông qua Mongoose timestamps.

## API overview

### Public

- `GET /api/public/home`
- `GET /api/public/about`
- `GET /api/public/categories`
- `GET /api/public/products`
- `GET /api/public/products/:slug`
- `GET /api/public/projects`
- `GET /api/public/projects/:slug`
- `POST /api/public/contacts`

### Auth/Admin

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/admin/dashboard`
- CRUD:
  - `/api/admin/banners`
  - `/api/admin/categories`
  - `/api/admin/products`
  - `/api/admin/projects`
  - `/api/admin/pages`
  - `/api/admin/contacts`
  - `/api/admin/media`
  - `/api/admin/settings`

## AWS S3

Backend đã có service upload/xóa file qua S3:

- `backend/src/services/s3.service.js`
- `backend/src/services/media.service.js`

Admin upload media qua `/api/admin/media/upload`, backend:

1. nhận file multipart
2. upload lên S3
3. lưu `url` và `key` vào collection `media`

## Đã verify

- Cài package riêng cho `backend`, `frontend`, `admin`
- Build thành công `frontend`
- Build thành công `admin`
- Backend build step OK
- `GET /api/health`
- `GET /api/public/home`
- `POST /api/auth/login`
- `GET /api/admin/dashboard`

## Ghi chú

- Backend đang dùng MongoDB Atlas thật, không còn SQLite/PostgreSQL.
- Root `node_modules` đã được bỏ; mỗi app có `node_modules` riêng.
- S3 chỉ upload thật khi điền đầy đủ env AWS.
- Admin bundle hiện tại build được nhưng vẫn có cảnh báo chunk lớn; nếu cần tối ưu sâu hơn có thể tách route lazy/code-splitting tiếp.
