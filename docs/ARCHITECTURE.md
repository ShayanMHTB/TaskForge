# 🏗️ TaskForge Architecture

**Comprehensive technical architecture and design decisions for TaskForge**

---

## 📋 Table of Contents

- [System Overview](#-system-overview)
- [Backend Architecture](#-backend-architecture)
- [Frontend Architecture](#-frontend-architecture)
- [Database Design](#-database-design)
- [API Design](#-api-design)
- [Authentication & Security](#-authentication--security)
- [Development Environment](#-development-environment)
- [Deployment Strategy](#-deployment-strategy)

---

## 🎯 System Overview

TaskForge follows a **decoupled SPA architecture** with clear separation between the API backend and the frontend application. This approach provides:

- **Scalability:** Independent scaling of frontend and backend
- **Maintainability:** Clear separation of concerns
- **Flexibility:** Easy to add mobile apps or third-party integrations
- **Performance:** Optimized for each layer's specific needs

### High-Level Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   Vue.js SPA    │ ←────────────→ │   Laravel API   │
│     (web/)      │    (REST API)   │     (srv/)      │
└─────────────────┘                 └─────────────────┘
         │                                   │
         │                                   │
    ┌─────────┐                         ┌─────────┐
    │ Browser │                         │Database │
    │ Storage │                         │(SQLite) │
    └─────────┘                         └─────────┘
```

---

## 🔧 Backend Architecture

### Framework & Structure

**Laravel 11** powers the backend with a **API-only configuration**:

```
srv/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── TaskController.php
│   │   │   │   ├── TaskListController.php
│   │   │   │   └── UserController.php
│   │   │   └── Controller.php
│   │   ├── Middleware/
│   │   │   ├── EnsureJsonRequest.php
│   │   │   └── CorsMiddleware.php
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   ├── Task/
│   │   │   └── TaskList/
│   │   └── Resources/
│   │       ├── TaskResource.php
│   │       ├── TaskListResource.php
│   │       └── UserResource.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Task.php
│   │   ├── TaskList.php
│   │   └── Tag.php
│   ├── Services/
│   │   ├── TaskService.php
│   │   └── NotificationService.php
│   └── Policies/
│       ├── TaskPolicy.php
│       └── TaskListPolicy.php
├── config/
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── routes/
│   └── api.php
└── tests/
    ├── Feature/
    └── Unit/
```

### Core Backend Components

**1. Controllers (API Layer)**

- Thin controllers focused on HTTP concerns
- Request validation through Form Requests
- Response formatting using API Resources
- Consistent error handling

**2. Models (Data Layer)**

- Eloquent ORM for database interactions
- Model relationships and scopes
- Business logic in model methods
- Soft deletes for important entities

**3. Services (Business Logic)**

- Complex business operations
- External API integrations
- Background job coordination
- Reusable business logic

**4. Policies (Authorization)**

- Fine-grained permission control
- Resource-based authorization
- Team-based access control

### Backend Package Recommendations

**Core Dependencies:**

```json
{
  "laravel/framework": "^11.0",
  "laravel/sanctum": "^4.0",
  "laravel/tinker": "^2.9"
}
```

**Development Dependencies:**

```json
{
  "laravel/pint": "^1.13", // Code formatting
  "larastan/larastan": "^2.7", // Static analysis
  "pestphp/pest": "^2.28", // Testing framework
  "pestphp/pest-plugin-laravel": "^2.2"
}
```

**Optional Packages (Choose based on needs):**

- **Validation:** `spatie/laravel-validation-rules`
- **API Documentation:** `scramble/scramble` OR `knuckleswtf/scribe`
- **Background Jobs:** `laravel/horizon` (Redis) OR built-in database queue
- **Caching:** Redis OR Memcached
- **File Storage:** `spatie/laravel-medialibrary`
- **Logging:** `spatie/laravel-activitylog`

---

## 🎨 Frontend Architecture

### Vue.js 3 Structure

```
web/
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   └── components.css
│   │   └── images/
│   ├── components/
│   │   ├── ui/                    // Reusable UI components
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseModal.vue
│   │   │   └── BaseSpinner.vue
│   │   ├── layout/                // Layout components
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── AppFooter.vue
│   │   ├── tasks/                 // Task-specific components
│   │   │   ├── TaskCard.vue
│   │   │   ├── TaskForm.vue
│   │   │   ├── TaskList.vue
│   │   │   └── KanbanBoard.vue
│   │   └── auth/                  // Authentication components
│   │       ├── LoginForm.vue
│   │       └── RegisterForm.vue
│   ├── composables/               // Vue composition functions
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useTasks.js
│   │   └── useNotifications.js
│   ├── router/
│   │   └── index.js
│   ├── stores/                    // Pinia stores
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── ui.js
│   │   └── index.js
│   ├── utils/
│   │   ├── api.js                 // Axios configuration
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── views/                     // Page components
│   │   ├── auth/
│   │   │   ├── LoginView.vue
│   │   │   └── RegisterView.vue
│   │   ├── dashboard/
│   │   │   ├── DashboardView.vue
│   │   │   ├── TasksView.vue
│   │   │   ├── KanbanView.vue
│   │   │   └── CalendarView.vue
│   │   └── NotFoundView.vue
│   ├── App.vue
│   └── main.js
├── public/
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

### Frontend Package Recommendations

**Core Dependencies:**

```json
{
  "vue": "^3.4",
  "vue-router": "^4.2",
  "pinia": "^2.1",
  "axios": "^1.6"
}
```

**UI & Styling:**

```json
{
  "tailwindcss": "^3.4",
  "@headlessui/vue": "^1.7", // Accessible UI components
  "@heroicons/vue": "^2.0", // Icon library
  "@tailwindcss/forms": "^0.5" // Form styling
}
```

**Development Tools:**

```json
{
  "vite": "^5.0",
  "vitest": "^1.1", // Testing
  "@vue/test-utils": "^2.4", // Vue testing utilities
  "eslint": "^8.56", // Linting
  "prettier": "^3.1", // Code formatting
  "@vitejs/plugin-vue": "^5.0"
}
```

**Optional Packages:**

- **Drag & Drop:** `@shopify/draggable` OR `sortablejs`
- **Date Handling:** `date-fns` OR `dayjs`
- **Notifications:** `@kyvg/vue3-notification`
- **Charts:** `chart.js` with `vue-chartjs`
- **PWA:** `vite-plugin-pwa`

---

## 🗄️ Database Design

### Entity Relationship Diagram

```
Users                Tasks                 TaskLists
┌─────────────┐     ┌─────────────┐       ┌─────────────┐
│ id          │────▷│ user_id     │       │ id          │
│ name        │     │ list_id     │◁──────│ user_id     │
│ email       │     │ title       │       │ name        │
│ password    │     │ description │       │ description │
│ created_at  │     │ due_date    │       │ color       │
│ updated_at  │     │ completed   │       │ created_at  │
└─────────────┘     │ priority    │       │ updated_at  │
                    │ created_at  │       └─────────────┘
                    │ updated_at  │
                    └─────────────┘
                           │
                           │ Many-to-Many
                           ▼
                    ┌─────────────┐
                    │ Tags        │
                    ├─────────────┤
                    │ id          │
                    │ name        │
                    │ color       │
                    │ created_at  │
                    │ updated_at  │
                    └─────────────┘
```

### Database Schema

**Users Table:**

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Task Lists Table:**

```sql
CREATE TABLE task_lists (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Tasks Table:**

```sql
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    list_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    completed BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (list_id) REFERENCES task_lists(id) ON DELETE SET NULL
);
```

---

## 🔌 API Design

### RESTful Endpoints

**Authentication:**

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
GET    /api/auth/user              # Get authenticated user
```

**Task Lists:**

```
GET    /api/task-lists             # Get user's task lists
POST   /api/task-lists             # Create new task list
GET    /api/task-lists/{id}        # Get specific task list
PUT    /api/task-lists/{id}        # Update task list
DELETE /api/task-lists/{id}        # Delete task list
POST   /api/task-lists/{id}/reorder # Reorder lists
```

**Tasks:**

```
GET    /api/tasks                  # Get user's tasks (with filters)
POST   /api/tasks                  # Create new task
GET    /api/tasks/{id}             # Get specific task
PUT    /api/tasks/{id}             # Update task
DELETE /api/tasks/{id}             # Delete task
POST   /api/tasks/{id}/complete    # Toggle task completion
POST   /api/tasks/reorder          # Reorder tasks
```

### API Response Format

**Success Response:**

```json
{
  "data": {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the TaskForge MVP",
    "due_date": "2025-07-25T10:00:00Z",
    "completed": false,
    "priority": "high",
    "list": {
      "id": 1,
      "name": "Work Projects"
    }
  },
  "meta": {
    "timestamp": "2025-07-20T12:00:00Z"
  }
}
```

**Error Response:**

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "title": ["The title field is required."],
      "due_date": ["The due date must be a valid date."]
    }
  },
  "meta": {
    "timestamp": "2025-07-20T12:00:00Z"
  }
}
```

---

## 🔐 Authentication & Security

### Laravel Sanctum SPA Authentication

**Flow:**

1. Frontend requests CSRF cookie: `GET /sanctum/csrf-cookie`
2. Frontend sends login credentials: `POST /api/auth/login`
3. Backend validates and creates session
4. Frontend receives authenticated user data
5. Subsequent requests include session cookie automatically

**Security Measures:**

- CSRF protection for all state-changing requests
- SameSite cookie configuration
- Rate limiting on authentication endpoints
- Input validation and sanitization
- SQL injection prevention through Eloquent ORM
- XSS protection through proper output escaping

### Frontend Security

**HTTP Configuration:**

```javascript
// axios configuration
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';
```

**Route Protection:**

```javascript
// Router guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});
```

---

## 💻 Development Environment

### Local Development Setup

**Environment Configuration:**

**.env (root level):**

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

FRONTEND_URL=http://localhost:5173
FRONTEND_PORT=5173

BACKEND_URL=http://localhost:8000
BACKEND_PORT=8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

**Development Tools:**

1. **Code Quality:**

   - PHP CS Fixer for backend formatting
   - ESLint + Prettier for frontend
   - Larastan for static analysis

2. **Testing:**

   - PHPUnit/Pest for backend testing
   - Vitest for frontend unit tests
   - Playwright for E2E testing

3. **Development Servers:**
   - Laravel's built-in server for backend
   - Vite dev server for frontend with HMR

---

## 🚀 Deployment Strategy

### Local Deployment

**Option 1: Simple Setup**

- Backend: Apache/Nginx + PHP-FPM
- Frontend: Build and serve static files
- Database: SQLite file

**Option 2: Docker (Recommended for consistency)**

```dockerfile
# Example docker-compose.yml structure
version: '3.8'
services:
  backend:
    build: ./srv
    ports:
      - "8000:8000"
    volumes:
      - ./srv:/var/www/html

  frontend:
    build: ./web
    ports:
      - "3000:3000"
    volumes:
      - ./web:/app

  database:
    image: postgres:15
    environment:
      POSTGRES_DB: taskforge
```

### Production Considerations

**Backend Optimizations:**

- OPcache enabled
- Config caching (`php artisan config:cache`)
- Route caching (`php artisan route:cache`)
- Composer autoload optimization

**Frontend Optimizations:**

- Build optimization (`npm run build`)
- Asset minification and compression
- CDN for static assets
- Service worker for caching

**Database:**

- PostgreSQL for production
- Regular backups
- Database connection pooling

**Monitoring & Logging:**

- Application logs (Laravel logs)
- Error tracking (Sentry integration)
- Performance monitoring
- Uptime monitoring

---

This architecture provides a solid foundation for TaskForge with room for growth and optimization as the application evolves.
