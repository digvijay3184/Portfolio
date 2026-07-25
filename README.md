# Engineering Portfolio Platform

A high-performance, dynamic portfolio platform built for modern engineers. This project features a completely bespoke headless CMS ("System Console") and a highly interactive, animated public frontend designed to impress.

---

## 🚀 Architecture Overview

This repository is structured as a **monorepo**, containing two fully decoupled applications that communicate via a RESTful API.

### 1. Frontend (Next.js 16+ App Router)
The frontend serves dual purposes:
- **Public Portfolio**: A heavily animated, responsive, and accessible landing page showcasing the engineer's profile, projects, and architecture designs.
- **System Console (Admin Panel)**: A secure, authenticated dashboard for managing all portfolio content, tracking messages, and configuring live-site layout dynamically.

### 2. Backend (NestJS)
A robust API server built with NestJS and TypeScript. It handles:
- **Authentication**: JWT-based auth with short-lived access tokens and secure HTTP-only refresh cookies.
- **Content Management**: Generic CRUD operations dynamically routed to MongoDB schemas.
- **Media Processing**: Direct integration with Cloudinary for image hosting and raw PDF delivery (bypassing restrictive ACLs).
- **Activity Tracking**: Global interceptors to log system mutations for auditing.

---

## 🛠 Detailed Tech Stack

### Frontend Ecosystem
- **Core**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS (with custom Glassmorphism utilities in `globals.css`)
- **State & Fetching**: Axios, React Query (custom hooks like `useContent`)
- **Forms**: React Hook Form
- **Animations & 3D**:
  - Framer Motion (page transitions, scroll reveals, interactive components)
  - React Three Fiber / Drei (3D Hero Canvas background)
  - Native CSS Keyframes + SVG Filters (GPU-accelerated gooey text morphing)

### Backend Ecosystem
- **Core**: NestJS, TypeScript, Node.js
- **Database**: MongoDB (via Mongoose ORM)
- **Security**: Passport.js (JWT strategy), cookie-parser, bcrypt (password hashing)
- **File Uploads**: Multer, Cloudinary SDK
- **Validation**: class-validator, class-transformer

---

## ✨ Core Features & Technical Highlights

### 🎛 System Console (Admin Panel)
- **Dynamic Content Editing**: Manage every section of the portfolio (Hero, About, Mindset, Experience, Projects, Architecture, Contact) via intuitive forms.
- **Live Site Manager (Drag & Drop)**: 
  - A native HTML5 drag-and-drop interface on the dashboard to instantly reorder sections on the live site.
  - State is saved to a `SiteSettings` singleton document in MongoDB, which the frontend uses to map and render components dynamically.
- **JSON Import/Export**: A robust data migration tool to export the entire MongoDB database state to a JSON file, or restore/import it.
- **Message Inbox**: Read and manage contact form submissions directly from the dashboard.

### 🎨 Advanced UI / UX (Public Site)
- **Hero Morphing Text**: A bespoke, GPU-accelerated text effect combining SVG `feColorMatrix` and CSS keyframes. It seamlessly loops between the user's Name and Call-to-Action label in a liquid/gooey style.
- **Encrypt Button**: A highly interactive "Contact" button that scrambles text into hacker-style glyphs and sweeps a scanner light across it on hover.
- **Custom Cursor & ScrollSpy**: A global custom cursor context provider that reacts to interactive elements (`data-cursor="button"`). A highly optimized IntersectionObserver (`ScrollSpy`) updates the side-navigation dots as the user scrolls.
- **Accessibility (a11y)**: Built-in `@media (prefers-reduced-motion: reduce)` support. Complex animations (like the gooey filter) gracefully degrade to standard opacity fades for motion-sensitive users.

### 🔌 Backend Engineering
- **Dynamic Content Module**: A single, elegant `ContentService` and `ContentController` that dynamically handles CRUD operations for *any* registered Mongoose schema using a `:model` route parameter.
- **Raw File Handling**: The `MediaService` actively detects PDF uploads by MIME type and uploads them to Cloudinary as `raw` resources to bypass strict default image delivery ACLs.
- **Global Logging Interceptor**: Automatically tracks the lifecycle (initiation, completion, and latency in milliseconds) of all mutating requests (`POST`, `PUT`, `DELETE`).

---

## 🗄 Database Schemas

The MongoDB database consists of several collections, dynamically managed by the backend:
- `users`: Admin credentials (hashed passwords).
- `site-settings`: Singleton document controlling feature flags (`showDashboardStats`, `showQuickActions`) and the dynamic layout array (`sectionOrder`).
- `hero`: Name, roles, avatar, CTA label, and CV URL.
- `about`: Bio, tech stack array, and profile image.
- `mindset`: Engineering philosophy paradigms and descriptions.
- `experience`: Professional timeline (company, role, duration, achievements).
- `project`: Portfolio projects (title, description, tech stack, github/live links, images).
- `architecture`: System design diagrams and explanations.
- `contact`: Incoming messages from the public site.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | API Server port (default: 3001) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing Access Tokens |
| `JWT_REFRESH_SECRET` | Secret key for signing Refresh Tokens |
| `FRONTEND_URL` | Allowed CORS origin (e.g., `http://localhost:3000`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET`| Cloudinary API Secret |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL of the NestJS Backend (e.g., `http://127.0.0.1:3001`) |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v20+)
- MongoDB (Running locally on `27017` or an Atlas URI)
- Cloudinary Account

### 1. Bootstrapping the Backend
```bash
cd backend
npm install

# Configure your .env file
cp .env.example .env 

# Start the NestJS development server
npm run start:dev
```
*The backend will run on `http://localhost:3001`.*

### 2. Bootstrapping the Frontend
```bash
cd frontend
npm install

# Configure your .env file
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:3001" > .env

# Start the Next.js development server
npm run dev
```
*The frontend will run on `http://localhost:3000`.*

### 3. Initial Admin Setup
On first boot, the system requires an Admin account. 
1. The backend automatically seeds a default user if the `users` collection is empty.
2. Navigate to `http://localhost:3000/system-console/login`.
3. Default Credentials: `admin@example.com` / `password123` (Ensure you change this immediately in production!).

---

## 🛡 Security Architecture

- **Token Lifecycle**: The application uses short-lived Access Tokens (stored in memory/React state) and long-lived Refresh Tokens (stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies).
- **Route Protection**: All `/system-console/*` routes on the frontend are protected by Next.js middleware, which verifies authentication status before rendering.
- **API Protection**: All `/api/admin/*` routes on the backend are protected by a NestJS `JwtAuthGuard`.

---
*Architected and engineered for maximum performance, maintainability, and visual impact.*
