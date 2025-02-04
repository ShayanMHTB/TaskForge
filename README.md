# 🚀 TaskForge

**The ultimate personal and small-team task manager for productivity beasts.**  
Built to replace Todoist, Trello, ClickUp, and TickTick — without the bloat.  
Use it solo, with your partner, or your elite accountability group. 🔥

---

## 📌 Overview

**TaskForge** is a modern, mobile-first task management web application designed for individuals and small teams who demand powerful productivity tools without enterprise complexity. Built with a clean separation between a robust Laravel API backend and a responsive Vue.js frontend.

**Key Philosophy:**

- 🎯 **Focus over Features** - Essential productivity tools without bloat
- 📱 **Mobile-First** - Designed for the way you actually work
- ⚡ **Performance** - Fast, responsive, and reliable
- 🔒 **Privacy** - Your data stays yours
- 🛠️ **Developer-Friendly** - Clean architecture, well-documented APIs

---

## ✨ Core Features

### Current Release (v0.1.0)

- ✅ **User Authentication** - Secure registration and login
- ✅ **Task Management** - Create, edit, delete, and organize tasks
- ✅ **Basic Lists** - Organize tasks in custom lists
- ✅ **Due Dates** - Set and track task deadlines
- ✅ **Mobile Responsive** - Works perfectly on all devices

### Planned Features (Roadmap)

- 🔄 **Kanban Boards** - Visual task management with drag-and-drop
- 🔄 **Calendar Integration** - Timeline and calendar views
- ⏳ **Tags & Filters** - Advanced task organization
- 🔜 **Collaboration** - Share boards with team members
- 🔜 **PWA Support** - Installable app with offline capabilities
- 🔜 **Notifications** - Smart reminders and alerts
- 🔜 **Data Export** - Backup and migrate your data

---

## 🏗️ Architecture

### Project Structure

```
TaskForge/
├── .env                    # Environment configuration
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── docs/                 # Documentation
│   ├── API.md           # API documentation
│   ├── ARCHITECTURE.md  # Technical architecture
│   └── SETUP.md         # Setup and deployment guide
├── LICENSE              # MIT License
├── README.md           # This file
├── srv/                # Backend (Laravel API)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── tests/
│   ├── .env.example
│   ├── artisan
│   ├── composer.json
│   └── composer.lock
└── web/                # Frontend (Vue.js SPA)
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── composables/
    │   ├── router/
    │   ├── stores/
    │   ├── utils/
    │   ├── views/
    │   ├── App.vue
    │   └── main.js
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── yarn.lock
```

### Technology Stack

**Backend (srv/)**

- **Framework:** Laravel 11 (PHP 8.3+)
- **Authentication:** Laravel Sanctum (SPA authentication)
- **Database:** SQLite (development) / PostgreSQL (production)
- **API:** RESTful JSON API
- **Testing:** PHPUnit with Feature/Unit tests
- **Code Quality:** PHP CS Fixer, Larastan (PHPStan)

**Frontend (web/)**

- **Framework:** Vue 3 with Composition API
- **Build Tool:** Vite 5
- **State Management:** Pinia
- **Routing:** Vue Router 4
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS 3
- **UI Components:** Headless UI + Custom components
- **Icons:** Heroicons
- **Testing:** Vitest + Vue Test Utils

---

## 🚀 Quick Start

### Prerequisites

- **PHP 8.3+** with extensions: mbstring, xml, pdo, sqlite3, curl, zip
- **Node.js 20+** with npm/yarn
- **Composer 2.x**
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/taskforge.git
   cd taskforge
   ```

2. **Backend Setup**

   ```bash
   cd srv
   cp .env.example .env
   composer install
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve --port=8000
   ```

3. **Frontend Setup**

   ```bash
   cd ../web
   cp .env.example .env
   npm install  # or yarn install
   npm run dev  # or yarn dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api
   - API Documentation: http://localhost:8000/docs

### Development Workflow

```bash
# Start backend development server
cd srv && php artisan serve

# Start frontend development server (new terminal)
cd web && npm run dev

# Run backend tests
cd srv && php artisan test

# Run frontend tests
cd web && npm run test

# Code formatting
cd srv && ./vendor/bin/pint
cd web && npm run lint:fix
```

---

## 📚 Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)** - Technical architecture and design decisions
- **[API Documentation](docs/API.md)** - Complete API reference
- **[Setup Guide](docs/SETUP.md)** - Detailed setup and deployment instructions

---

## 🧪 Testing

### Backend Testing

```bash
cd srv
php artisan test                    # Run all tests
php artisan test --coverage       # Run with coverage
php artisan test --filter=User    # Run specific test
```

### Frontend Testing

```bash
cd web
npm run test              # Run unit tests
npm run test:coverage     # Run with coverage
npm run test:e2e         # Run E2E tests (Playwright)
```

---

## 🚦 Development Status

| Component      | Status         | Version | Notes                         |
| -------------- | -------------- | ------- | ----------------------------- |
| Authentication | ✅ Complete    | v1.0    | Registration, login, logout   |
| Task CRUD      | ✅ Complete    | v1.0    | Create, read, update, delete  |
| Task Lists     | ✅ Complete    | v1.0    | Basic list organization       |
| Due Dates      | ✅ Complete    | v1.0    | Date assignment and tracking  |
| Kanban Boards  | 🔄 In Progress | v1.1    | Drag-and-drop interface       |
| Calendar View  | ⏳ Planned     | v1.2    | Calendar integration          |
| Collaboration  | ⏳ Planned     | v2.0    | Shared boards and permissions |
| PWA            | ⏳ Planned     | v2.1    | Offline support               |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **Backend:** Follow PSR-12, use PHP CS Fixer
- **Frontend:** Follow Vue.js style guide, use ESLint + Prettier
- **Tests:** Maintain 80%+ code coverage
- **Commits:** Use conventional commit messages

---

## 📈 Roadmap

### v1.1 (Next Release) - Kanban Power

- Drag-and-drop Kanban boards
- Board templates
- Task priorities
- Bulk task operations

### v1.2 - Calendar & Time

- Calendar view
- Time tracking
- Recurring tasks
- Smart notifications

### v2.0 - Collaboration

- Shared boards
- User permissions
- Real-time updates
- Activity feeds

### v2.1 - Mobile Excellence

- PWA with offline support
- Mobile gestures
- Push notifications
- Mobile app (consideration)

---

## 📄 License

MIT License © 2025 Shayan Mahtabi

See [LICENSE](LICENSE) for more information.

---

## 🙌 Acknowledgements

- [Laravel](https://laravel.com/) - The PHP framework for web artisans
- [Vue.js](https://vuejs.org/) - The progressive JavaScript framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

---

**Built with ❤️ for productivity enthusiasts**
