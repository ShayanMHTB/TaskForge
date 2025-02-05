# 🔌 TaskForge API Documentation

**Complete reference for the TaskForge REST API**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Authentication](#-authentication)
- [Error Handling](#-error-handling)
- [Rate Limiting](#-rate-limiting)
- [Endpoints](#-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#user-endpoints)
  - [Task Lists](#task-list-endpoints)
  - [Tasks](#task-endpoints)
  - [Tags](#tag-endpoints)

---

## 🎯 Overview

The TaskForge API is a RESTful API that uses HTTP methods and status codes. All requests and responses use JSON format.

### Base URL

```
Local Development: http://localhost:8000/api
Production: https://yourdomain.com/api
```

### Content Type

All requests should include:

```
Content-Type: application/json
Accept: application/json
X-Requested-With: XMLHttpRequest
```

### CORS Configuration

The API supports CORS for SPA authentication with the following configuration:

- Allowed Origins: Frontend URL (configured in `.env`)
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed Headers: Content-Type, Accept, Authorization, X-Requested-With
- Credentials: Supported (for session-based auth)

---

## 🔐 Authentication

TaskForge uses **Laravel Sanctum** for SPA authentication with session-based cookies.

### Authentication Flow

1. **Get CSRF Token**

   ```http
   GET /sanctum/csrf-cookie
   ```

2. **Login**

   ```http
   POST /api/auth/login
   Content-Type: application/json

   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Subsequent Requests**
   Include session cookie automatically (handled by browser)

### Session Management

- Sessions expire after 2 hours of inactivity
- CSRF token required for all state-changing requests
- Automatic session renewal on activity

---

## ❌ Error Handling

### HTTP Status Codes

| Code | Description                                          |
| ---- | ---------------------------------------------------- |
| 200  | OK - Request successful                              |
| 201  | Created - Resource created successfully              |
| 204  | No Content - Request successful, no content returned |
| 400  | Bad Request - Invalid request data                   |
| 401  | Unauthorized - Authentication required               |
| 403  | Forbidden - Insufficient permissions                 |
| 404  | Not Found - Resource not found                       |
| 422  | Unprocessable Entity - Validation failed             |
| 429  | Too Many Requests - Rate limit exceeded              |
| 500  | Internal Server Error - Server error                 |

### Error Response Format

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {
      "field": ["Specific validation error"]
    }
  },
  "meta": {
    "timestamp": "2025-07-20T12:00:00Z",
    "request_id": "uuid-string"
  }
}
```

### Common Error Codes

| Code                       | Description                      |
| -------------------------- | -------------------------------- |
| `VALIDATION_ERROR`         | Request validation failed        |
| `AUTHENTICATION_REQUIRED`  | User must be authenticated       |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions  |
| `RESOURCE_NOT_FOUND`       | Requested resource doesn't exist |
| `RATE_LIMIT_EXCEEDED`      | Too many requests in time window |

---

## 🚦 Rate Limiting

### Limits

| Endpoint Type  | Limit       | Window   |
| -------------- | ----------- | -------- |
| Authentication | 5 requests  | 1 minute |
| General API    | 60 requests | 1 minute |
| File Upload    | 10 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1642694400
```

---

## 📍 Endpoints

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201):**

```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": null,
    "created_at": "2025-07-20T12:00:00Z",
    "updated_at": "2025-07-20T12:00:00Z"
  },
  "meta": {
    "message": "Registration successful",
    "timestamp": "2025-07-20T12:00:00Z"
  }
}
```

**Validation Rules:**

- `name`: required, string, max:255
- `email`: required, email, unique:users
- `password`: required, min:8, confirmed

---

### POST /api/auth/login

Authenticate user and create session.

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123",
  "remember": true
}
```

**Response (200):**

```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": null,
    "created_at": "2025-07-20T12:00:00Z",
    "updated_at": "2025-07-20T12:00:00Z"
  },
  "meta": {
    "message": "Login successful",
    "timestamp": "2025-07-20T12:00:00Z"
  }
}
```

**Validation Rules:**

- `email`: required, email
- `password`: required
- `remember`: optional, boolean

---

### POST /api/auth/logout

Destroy user session.

**Response (204):**
No content

---

### GET /api/auth/user

Get authenticated user information.

**Authentication:** Required

**Response (200):**

```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": null,
    "created_at": "2025-07-20T12:00:00Z",
    "updated_at": "2025-07-20T12:00:00Z"
  }
}
```

---

## User Endpoints

### PUT /api/user/profile

Update authenticated user's profile.

**Authentication:** Required

**Request:**

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response (200):**

```json
{
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "email_verified_at": null,
    "created_at": "2025-07-20T12:00:00Z",
    "updated_at": "2025-07-20T12:00:00Z"
  },
  "meta": {
    "message": "Profile updated successfully"
  }
}
```

**Validation Rules:**

- `name`: required, string, max:255
- `email`: required, email, unique:users,email,{user_id}

---

### PUT /api/user/password

Update authenticated user's password.

**Authentication:** Required

**Request:**

```json
{
  "current_password": "oldpassword123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response (200):**

```json
{
  "meta": {
    "message": "Password updated successfully",
    "timestamp": "2025-07-20T12:00:00Z"
  }
}
```

**Validation Rules:**

- `current_password`: required, string
- `password`: required, min:8, confirmed

---

## Task List Endpoints

### GET /api/task-lists

Get all task lists for authenticated user.

**Authentication:** Required

**Query Parameters:**

- `include`: Include related data (tasks, tasks_count)
- `sort`: Sort field (name, created_at, position)
- `order`: Sort order (asc, desc)

**Example Request:**

```
GET /api/task-lists?include=tasks_count&sort=position&order=asc
```

**Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Personal Tasks",
      "description": "My personal todo items",
      "color": "#3b82f6",
      "position": 0,
      "tasks_count": 5,
      "created_at": "2025-07-20T12:00:00Z",
      "updated_at": "2025-07-20T12:00:00Z"
    },
    {
      "id": 2,
      "name": "Work Projects",
      "description": "Professional tasks and deadlines",
      "color": "#ef4444",
      "position": 1,
      "tasks_count": 12,
      "created_at": "2025-07-20T11:30:00Z",
      "updated_at": "2025-07-20T11:30:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "timestamp": "2025-07-20T12:00:00Z"
  }
}
```

---

### POST /api/task-lists

Create a new task list.

**Authentication:** Required

**Request:**

```json
{
  "name": "Shopping List",
  "description": "Grocery and household items",
  "color": "#10b981"
}
```

**Response (201):**

```json
{
  "data": {
    "id": 3,
    "name": "Shopping List",
    "description": "Grocery and household items",
    "color": "#10b981",
    "position": 2,
    "tasks_count": 0,
    "created_at": "2025-07-20T12:05:00Z",
    "updated_at": "2025-07-20T12:05:00Z"
  },
  "meta": {
    "message": "Task list created successfully"
  }
}
```

**Validation Rules:**

- `name`: required, string, max:255
- `description`: optional, string, max:1000
- `color`: optional, string, regex:/^#[0-9a-fA-F]{6}$/

---

### GET /api/task-lists/{id}

Get a specific task list.

**Authentication:** Required

**Query Parameters:**

- `include`: Include related data (tasks, user)

**Response (200):**

```json
{
  "data": {
    "id": 1,
    "name": "Personal Tasks",
    "description": "My personal todo items",
    "color": "#3b82f6",
    "position": 0,
    "tasks_count": 5,
    "created_at": "2025-07-20T12:00:00Z",
    "updated_at": "2025-07-20T12:00:00Z",
    "tasks": [
      {
        "id": 1,
        "title": "Buy groceries",
        "completed": false,
        "due_date": "2025-07-21T18:00:00Z",
        "priority": "medium"
      }
    ]
  }
}
```

---

### PUT /api/task-lists/{id}

Update a task list.

**Authentication:** Required

**Request:**

```json
{
  "name": "Updated List Name",
  "description": "Updated description",
  "color": "#8b5cf6"
}
```

**Response (200):**

```json
{
  "data": {
    "id": 1,
    "name": "Updated List Name",
    "description": "Updated description",
    "color": "#8b5cf6",
    "position": 0,
    "tasks_count": 5,
    "created_at": "2025-07-20T12:00:00Z",
    "updated_at": "2025-07-20T12:10:00Z"
  },
  "meta": {
    "message": "Task list updated successfully"
  }
}
```

---

### DELETE /api/task-lists/{id}

Delete a task list and all its tasks.

**Authentication:** Required

**Response (204):**
No content

---

### POST /api/task-lists/reorder

Reorder task lists.

**Authentication:** Required

**Request:**

```json
{
  "lists": [
    { "id": 2, "position": 0 },
    { "id": 1, "position": 1 },
    { "id": 3, "position": 2 }
  ]
}
```

**Response (200):**

```json
{
  "meta": {
    "message": "Task lists reordered successfully",
    "updated_count": 3
  }
}
```

---

## Task Endpoints

### GET /api/tasks

Get tasks for authenticated user.

**Authentication:** Required

**Query Parameters:**

- `list_id`: Filter by task list ID
- `completed`: Filter by completion status (true/false)
- `priority`: Filter by priority (low, medium, high)
- `due_date`: Filter by due date (today, overdue, this_week, this_month)
- `search`: Search in title and description
- `include`: Include related data (list, tags)
- `sort`: Sort field (title, due_date, priority, created_at, position)
- `order`: Sort order (asc, desc)
- `per_page`: Results per page (default: 15, max: 100)
- `page`: Page number

**Example Request:**

```
GET /api/tasks?list_id=1&completed=false&sort=due_date&order=asc&include=list,tags&per_page=20
```

**Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Get milk, bread, and eggs from the store",
      "due_date": "2025-07-21T18:00:00Z",
      "completed": false,
      "priority": "medium",
      "position": 0,
      "created_at": "2025-07-20T12:00:00Z",
      "updated_at": "2025-07-20T12:00:00Z",
      "list": {
        "id": 1,
        "name": "Personal Tasks",
        "color": "#3b82f6"
      },
      "tags": [
        {
          "id": 1,
          "name": "shopping",
          "color": "#10b981"
        }
      ]
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 1,
    "from": 1,
    "to": 1
  }
}
```

---

### POST /api/tasks

Create a new task.

**Authentication:** Required

**Request:**

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "list_id": 2,
  "due_date": "2025-07-25T17:00:00Z",
  "priority": "high",
  "tags": [1, 2]
}
```

**Response (201):**

```json
{
  "data": {
    "id": 15,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "due_date": "2025-07-25T17:00:00Z",
    "completed": false,
    "priority": "high",
    "position": 0,
    "created_at": "2025-07-20T12:15:00Z",
    "updated_at": "2025-07-20T12:15:00Z",
    "list": {
      "id": 2,
      "name": "Work Projects",
      "color": "#ef4444"
    },
    "tags": [
      {
        "id": 1,
        "name": "documentation",
        "color": "#8b5cf6"
      },
      {
        "id": 2,
        "name": "urgent",
        "color": "#ef4444"
      }
    ]
  },
  "meta": {
    "message": "Task created successfully"
  }
}
```

**Validation Rules:**

- `title`: required, string, max:255
- `description`: optional, string, max:2000
- `list_id`: optional, exists:task_lists,id (must belong to user)
- `due_date`: optional, date, after:now
- `priority`: optional, in:low,medium,high
- `tags`: optional, array of existing tag IDs

---

### GET /api/tasks/{id}

Get a specific task.

**Authentication:** Required

**Query Parameters:**

- `include`: Include related data (list, tags, user)

**Response (200):**

```json
{
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Get milk, bread, and eggs from the store",
    "due_date": "2025-07-21T18:00:00Z",
    "completed": false,
    "priority": "medium",
    "position": 0,
    "created_at": "2025-07-20T12:00:00Z",
    "updated_at": "2025-07-20T12:00:00Z",
    "list": {
      "id": 1,
      "name": "Personal Tasks",
      "color": "#3b82f6"
    },
    "tags": []
  }
}
```

---

### PUT /api/tasks/{id}

Update a task.

**Authentication:** Required

**Request:**

```json
{
  "title": "Buy groceries and household items",
  "description": "Get milk, bread, eggs, and cleaning supplies",
  "due_date": "2025-07-22T18:00:00Z",
  "priority": "high",
  "list_id": 1,
  "tags": [1]
}
```

**Response (200):**

```json
{
  "data": {
    "id": 1,
    "title": "Buy groceries and household items",
    "description": "Get milk, bread, eggs, and cleaning supplies",
    "due_date": "2025-07-22T18:00:00Z",
    "completed": false,
    "priority": "high",
    "position": 0,
    "created_at": "2025-07-20T12:00:00Z",
    "updated_at": "2025-07-20T12:20:00Z",
    "list": {
      "id": 1,
      "name": "Personal Tasks",
      "color": "#3b82f6"
    },
    "tags": [
      {
        "id": 1,
        "name": "shopping",
        "color": "#10b981"
      }
    ]
  },
  "meta": {
    "message": "Task updated successfully"
  }
}
```

---

### DELETE /api/tasks/{id}

Delete a task.

**Authentication:** Required

**Response (204):**
No content

---

### POST /api/tasks/{id}/toggle

Toggle task completion status.

**Authentication:** Required

**Response (200):**

```json
{
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "completed": true,
    "completed_at": "2025-07-20T12:25:00Z",
    "updated_at": "2025-07-20T12:25:00Z"
  },
  "meta": {
    "message": "Task marked as completed"
  }
}
```

---

### POST /api/tasks/reorder

Reorder tasks within a list or between lists.

**Authentication:** Required

**Request:**

```json
{
  "tasks": [
    { "id": 3, "position": 0, "list_id": 1 },
    { "id": 1, "position": 1, "list_id": 1 },
    { "id": 2, "position": 2, "list_id": 1 }
  ]
}
```

**Response (200):**

```json
{
  "meta": {
    "message": "Tasks reordered successfully",
    "updated_count": 3
  }
}
```

---

## Tag Endpoints

### GET /api/tags

Get all tags for authenticated user.

**Authentication:** Required

**Query Parameters:**

- `search`: Search tag names
- `sort`: Sort field (name, created_at)
- `order`: Sort order (asc, desc)

**Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "shopping",
      "color": "#10b981",
      "tasks_count": 3,
      "created_at": "2025-07-20T12:00:00Z",
      "updated_at": "2025-07-20T12:00:00Z"
    },
    {
      "id": 2,
      "name": "urgent",
      "color": "#ef4444",
      "tasks_count": 7,
      "created_at": "2025-07-20T11:45:00Z",
      "updated_at": "2025-07-20T11:45:00Z"
    }
  ],
  "meta": {
    "total": 2
  }
}
```

---

### POST /api/tags

Create a new tag.

**Authentication:** Required

**Request:**

```json
{
  "name": "important",
  "color": "#f59e0b"
}
```

**Response (201):**

```json
{
  "data": {
    "id": 3,
    "name": "important",
    "color": "#f59e0b",
    "tasks_count": 0,
    "created_at": "2025-07-20T12:30:00Z",
    "updated_at": "2025-07-20T12:30:00Z"
  },
  "meta": {
    "message": "Tag created successfully"
  }
}
```

**Validation Rules:**

- `name`: required, string, max:50, unique per user
- `color`: optional, string, regex:/^#[0-9a-fA-F]{6}$/

---

### PUT /api/tags/{id}

Update a tag.

**Authentication:** Required

**Request:**

```json
{
  "name": "high-priority",
  "color": "#dc2626"
}
```

**Response (200):**

```json
{
  "data": {
    "id": 3,
    "name": "high-priority",
    "color": "#dc2626",
    "tasks_count": 0,
    "created_at": "2025-07-20T12:30:00Z",
    "updated_at": "2025-07-20T12:35:00Z"
  },
  "meta": {
    "message": "Tag updated successfully"
  }
}
```

---

### DELETE /api/tags/{id}

Delete a tag. This will remove the tag from all associated tasks.

**Authentication:** Required

**Response (204):**
No content

---

## 📝 Response Examples

### Pagination Response

```json
{
  "data": [...],
  "links": {
    "first": "http://localhost:8000/api/tasks?page=1",
    "last": "http://localhost:8000/api/tasks?page=3",
    "prev": null,
    "next": "http://localhost:8000/api/tasks?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 3,
    "path": "http://localhost:8000/api/tasks",
    "per_page": 15,
    "to": 15,
    "total": 42
  }
}
```

### Empty Collection Response

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "message": "No tasks found"
  }
}
```

---

## 🔍 Advanced Features

### Search and Filtering

Tasks support complex filtering:

```
GET /api/tasks?search=groceries&priority=high&due_date=today&completed=false
```

### Bulk Operations

Some endpoints support bulk operations:

```json
POST /api/tasks/bulk-update
{
  "task_ids": [1, 2, 3],
  "updates": {
    "list_id": 2,
    "priority": "high"
  }
}
```

### Export Data

Export user data in various formats:

```
GET /api/export/tasks?format=json
GET /api/export/tasks?format=csv
```

This completes the comprehensive API documentation for TaskForge.
