# Dieu Khac Platform

Website gioi thieu dich vu dieu khac va trang admin quan tri noi dung, duoc tach thanh 3 app:

- `frontend`: website public React + Vite
- `admin`: trang quan tri React + Vite + Ant Design
- `backend`: API Node.js + Express + Mongoose

## Cau truc repo

```text
.
├─ admin/
├─ backend/
├─ frontend/
├─ .env.example
└─ package.json
```

## Tinh nang chinh

- Trang chu dong lay du lieu tu API
- Trang gioi thieu, danh sach san pham, chi tiet san pham
- Danh sach cong trinh, chi tiet cong trinh
- Form lien he gui ve backend
- Dashboard admin
- CRUD banner, danh muc, san pham, cong trinh, trang tinh, lien he, settings
- Upload anh len AWS S3 trong admin

## Yeu cau moi truong

- `Node.js 22+`
- `npm 10+`
- `MongoDB Atlas`
- `AWS S3`

## Chay local

### 1. Clone repo

```bash
git clone <repo-url>
cd DieuKhacXuanTruong
```

### 2. Tao file env

Tao cac file sau tu file mau:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
```

Can dien toi thieu cac bien backend trong `.env`:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Mac dinh:

- [`.env.example`](/mnt/c/Users/ASUS/Desktop/DieuKhac/.env.example)
- [`frontend/.env.example`](/mnt/c/Users/ASUS/Desktop/DieuKhac/frontend/.env.example)
- [`admin/.env.example`](/mnt/c/Users/ASUS/Desktop/DieuKhac/admin/.env.example)

### 3. Cai package

```bash
npm run install:all
```

Hoac cai rieng tung app:

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

### 4. Chay project

Chay ca 3 app tu root:

```bash
npm run dev
```

Hoac chay rieng:

```bash
npm run dev:backend
npm run dev:frontend
npm run dev:admin
```

URL mac dinh:

- Public web: `http://localhost:5173`
- Admin: `http://localhost:5174`
- API: `http://localhost:5000`

### 5. Build

```bash
npm run build
```

## Du lieu demo

### Seed lai toan bo database

```bash
npm run seed
```

Canh bao: lenh nay se `drop database` roi seed lai du lieu demo.

### Dong bo lai noi dung demo ma khong xoa DB

```bash
cd backend
npm run sync:demo-content
```

### Tai khoan admin demo sau khi seed

- Email: `admin@dieu-khac.vn`
- Password: `Admin@123456`

## API chinh

### Public

- `GET /api/health`
- `GET /api/public/home`
- `GET /api/public/about`
- `GET /api/public/categories`
- `GET /api/public/products`
- `GET /api/public/products/:slug`
- `GET /api/public/projects`
- `GET /api/public/projects/:slug`
- `POST /api/public/contacts`

### Admin

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/admin/dashboard`
- `GET|POST|PUT|DELETE /api/admin/banners`
- `GET|POST|PUT|DELETE /api/admin/categories`
- `GET|POST|PUT|DELETE /api/admin/products`
- `GET|POST|PUT|DELETE /api/admin/projects`
- `GET|PUT /api/admin/pages/:slug`
- `GET|PATCH|DELETE /api/admin/contacts`
- `GET|POST|DELETE /api/admin/media`
- `GET|PUT /api/admin/settings`

## Ghi chu van hanh

- Khong commit file `.env`
- Upload anh phu thuoc vao `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Neu can du lieu demo, dung `npm run seed`
