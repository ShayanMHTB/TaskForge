# 🚀 TaskForge

**The ultimate personal and small-team task manager for productivity beasts.**  
Built to replace Todoist, Trello, ClickUp, and TickTick — without the bloat.  
Use it solo, with your partner, or your elite accountability group. 🔥

---

## 📌 Overview

**TaskForge** is a modern, mobile-first task management web app for individuals and small teams.  
It's designed to offer powerful features in a clean, performant interface without enterprise clutter.

- ✅ Organize tasks in folders, lists, boards (Kanban-style), or calendars
- 🧠 Ideal for productivity-focused users, creators, freelancers, students
- 🔐 Fully authenticated and secure, with user-isolated dashboards
- 📱 Responsive by default: works beautifully on mobile, tablet, or desktop

> **Tech Stack**: Laravel (API-only) + Vue 3 (SPA) + SQLite (for dev)

---

## ✨ Features

| Feature                  | Status | Description                              |
| ------------------------ | ------ | ---------------------------------------- |
| 🧑‍💻 User Authentication   | ✅     | Register, login, secure JWT sessions     |
| 🗃️ Task Lists / Boards   | 🔄     | Create multiple lists or Kanban boards   |
| ⏰ Due Dates & Reminders | 🔄     | Assign dates, snooze, and reminders      |
| 🏷️ Tags & Labels         | ⏳     | Group and filter tasks effectively       |
| 🔍 Global Search         | 🔜     | Fast, intuitive search across tasks      |
| 📆 Calendar View         | 🔜     | View tasks across dates like a calendar  |
| 📱 PWA Support           | 🔜     | Installable on mobile, with offline mode |
| 🤝 Shared Boards         | 🔜     | Invite others to collaborate on boards   |
| ☁️ Sync & Backup         | 🔜     | Export, import, and sync across devices  |

---

## ⚙️ Architecture

### Backend: Laravel (API only)

> Located in `/backend`

- Laravel 11, PHP 8.2+
- SQLite (default), MySQL/PostgreSQL (optional)
- Laravel Sanctum for token-based auth (simple, secure)
- RESTful API with `/api` namespace
- Built-in validation, error handling, and session management

### Frontend: Vue 3 (SPA)

> Located in `/frontend`

- Vite-powered dev environment
- Vue 3 + Composition API
- Vue Router for client-side routing
- Pinia for state management
- Axios for REST API communication
- Tailwind CSS + Headless UI
- Fully mobile-first and responsive

---

## 🧱 Project Structure

```bash
taskforge/
├── backend/                 # Laravel API
│   ├── app/
│   ├── routes/
│   ├── config/
│   └── database/
├── frontend/                # Vue SPA
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── store/
│   │   ├── router/
│   │   └── utils/
├── .env                     # Environment config (shared root or per app)
├── docker-compose.yml       # (optional, for future containerization)
└── README.md                # This file
```

---

## 🛠️ Tech Stack

| Layer    | Tool                         | Purpose                       |
| -------- | ---------------------------- | ----------------------------- |
| Backend  | Laravel 11                   | API + logic layer             |
| Auth     | Laravel Sanctum              | Token-based authentication    |
| DB       | SQLite (dev), MySQL (future) | Lightweight local dev DB      |
| Frontend | Vue 3 (Vite)                 | Reactive frontend SPA         |
| State    | Pinia                        | Global state management       |
| Routing  | Vue Router                   | Page-based routing            |
| HTTP     | Axios                        | REST API requests             |
| Styling  | Tailwind CSS                 | Utility-first CSS             |
| Icons/UI | Heroicons + Headless UI      | UI components & accessibility |

---

## 🔐 Authentication

- Registration & login via API
- JWT-like session handling via **Laravel Sanctum**
- Auth guards for protecting all sensitive routes
- Secure password hashing via Laravel's default `bcrypt`

---

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- SQLite (or MySQL if customized)

### Backend Setup

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📈 Roadmap

• Task recurrence (daily/weekly/monthly)
• Shared boards with permissions
• Drag-and-drop Kanban view
• Calendar + timeline integration
• Rich markdown support for task notes
• PWA: Installable with offline support
• Mobile gestures (swipe, long hold)

⸻

## 🧪 Testing

### Backend

```bash
php artisan test
```

### Frontend

```bash
npm run test
```

## 📄 License

MIT License © 2025 Shayan Mahtabi

⸻

## 🙌 Acknowledgements

• Laravel
• Vue.js
• Pinia
• Tailwind CSS
• Headless UI
• Sanctum

⸻

## 💬 Feedback

Feature requests, bug reports, or ideas?
Feel free to open an issue or reach out!
