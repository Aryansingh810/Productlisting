# ProductHub (Campus Drive)

Modern full-stack app to list products, filter/search them, and allow admins to add products with image upload.

## Tech

- Frontend: React (Vite) + Tailwind CSS + Axios + GSAP
- Backend: Node.js + Express + MongoDB (Mongoose) + Multer (uploads)

## Prerequisites

1. Node.js (16+ recommended)
2. MongoDB running locally
   - Default connection in `.env`: `mongodb://127.0.0.1:27017/producthub`

## Project Setup

### 1 Backend

```powershell
cd backend
npm install
```

Copy env file (if needed):

```powershell
Copy-Item .env.example .env
```

Optional seed (creates sample products without images):

```powershell
npm run seed
```

Run API:

```powershell
npm run dev
```

Backend listens on `http://localhost:5000` and serves uploads at:

`http://localhost:5000/uploads/<filename>`

### 2 Frontend

```powershell
cd frontend
npm install
```

Copy env file (if needed):

```powershell
Copy-Item .env.example .env
```

Create `frontend/.env` if you don’t have it yet (template exists as `frontend/.env` in this project).

Run UI:

```powershell
npm run dev
```

Frontend listens on `http://localhost:5173`.

## API Endpoints

- `GET /api/products?category=&minPrice=&maxPrice=&sort=asc|desc&search=`
- `POST /api/products` (multipart form-data; field name: `image`)

## Notes

- Image upload accepts: `jpg`, `jpeg`, `png`
- Max image size: `2MB`

