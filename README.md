# Acadlyst



## 📚 About

Acadlyst is a project I designed and built to empower offline teachers to open their own online coaching platforms. It bridges the gap between physical classrooms and digital learning by providing intuitive tools for course creation, live sessions, student management, and performance analytics.

## ✨ Features

- **Course Builder** – notes, quizzes, assignments
- **Student Dashboard** – track progress, grades, attendance
- **Messaging & Announcements** – keep learners engaged with updates
- **Analytics** – actionable insights on course performance and student activity
- **Mobile‑Friendly** – responsive UI and PWA support

## 📁 Folder Overview

```
acadlyst/
├── client-1/                        # Home + Login + Normal Dashboard
├── client-2/                        # Teacher Panel
├── loginBackendMicroService/       # Handles authentication (microservice)
├── restOperationsBackendMicroservice/  # Handles student/course APIs (microservice)

```

> ⚠️ Multiple versions/microservices are preserved for development transparency. See below for how to run each.

## 🧩 How to Run the Project

### 🔹 Frontend (client-1)

```bash
cd client-1
npm install
npm run dev
```

### 🔹 Backend Microservices

#### 1. Login Microservice

Handles user authentication using JWT.

```bash
cd loginBackendMicroService
npm install
npm run dev
```

#### 2. REST Operations Microservice

Handles operations like courses, students, batch logic.

```bash
cd restOperationsBackendMicroservice
npm install
npm run dev
```

Ensure both services are running for full functionality.

## 🖥️ Demo

> **Live Demo:** [https://acadlyst.netlify.app](https://acadlyst.netlify.app)

## 🛠️ Tech Stack

| Category  | Technologies                                                         |
| --------- | -------------------------------------------------------------------- |
| Front‑end | React • Vite • TypeScript • Tailwind CSS                             |
| Back‑end  | Node.js • Express • MongoDB • Mongoose • JWT                         |

## 🚀 Getting Started

### Prerequisites

```bash
# Node, npm
node --version   # >= 20
npm --version    # >= 10
# or use pnpm / yarn
```

### Environment Variables

Create `.env` files for each service as needed:

```bash
# loginBackendMicroService/.env
PORT=8080
JWT_SECRET=...
MONGO_URI=...

# restOperationsBackendMicroservice/.env
PORT=80
MONGO_URI=...
```

## 📜 Scripts

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start dev server with live reload |
| `npm run build` | Build client for production       |
| `npm run test`  | Run unit tests                    |
| `npm run lint`  | ESLint check                      |

## 🗺️ Roadmap

See the [open issues](https://github.com/PurpleWolfDev/acadlyst/issues) for full backlog.


## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🗣️ Contact

**Purple Wolf Dev**\
Email : purplewolfdev@gmail.com
LinkedIn: [https://linkedin.com/in/purple-wolf-dev/](https://linkedin.com/in/purple-wolf-dev/)

---

*Made with passion and ☕ in India.*

