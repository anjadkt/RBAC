# Enterprise Access Control System (Dynamic RBAC)

A enterprise management platform with a fully dynamic, database-driven
Role-Based Access Control (RBAC) system. New roles, modules, operations, and
permissions can be added at runtime.

---

## 🔗 Live Links

| Resource | URL |
|---|---|
| Frontend (Vercel) | https://rbac-dun.vercel.app |
| Backend API (Render) | https://rbac-bycs.onrender.com |
| API Docs (Postman) | https://tinyurl.com/postmanrbac |
| GitHub Repository | https://github.com/anjadkt/RBAC.git |

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Super Administrator | admin@example.com | password@123 |
| HR Manager | hr@example.com | password@123 |
| Employee | employee@example.com | password@123 |

---

## 🧰 Tech Stack

**Frontend**
- React + TypeScript
- Context API for global state (auth, permissions)
- Feature-based folder structure
- Zod for schema/form validation

**Backend**
- Express.js + TypeScript
- Feature-based folder structure
- MongoDB with Mongoose ODM
- JWT authentication (access + refresh tokens)
- Zod for request validation

---

## 🏗️ Architecture Overview

Authorization is fully dynamic: every protected route checks a `module.operation`
style permission string (e.g. `employee.view`, `leave.approve`). **No hardcoded role checks exist anywhere in the codebase.**


- **Module**: top-level feature area (e.g. Employee Management, Attendance)
- **Operation**: an action type (view, create, update, delete, approve, export…)
- **Permission**: a document combining Module + Operation (+ optional SubModule),
  represented as a unique string like `employee.view` or `attendance.export`
- **Role**: a document referencing an array of Permission IDs
- **User**: references one Role

Adding a new module/operation/permission is a **database insert**, not a code change —
middleware resolves permissions dynamically at request time.

### Example Mongoose Schemas (simplified)

```ts
// Module
{ name: String, code: String }

// Operation
{ name: String, code: String } // e.g. "view", "create", "approve"

// Permission
{
  code: String,          // e.g. "employee.view"
  module: ObjectId (ref: Module),
  operation: ObjectId (ref: Operation),
  label : String,
  description : String
}

// Role
{ name: String, permissions: [ObjectId] (ref: Permission) }

// User
{ name: String, email: String, password: String (hashed), role: ObjectId (ref: Role) }

```

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validation.ts   # Zod schemas
│   │   ├── users/
│   │   ├── role/
│   │   ├── module/
│   │   ├── permission/
│   │   ├── employee/
│   ├── middlewares/
│   │   ├── auth.middleware.ts        # JWT verification
│   │   ├── permission.middleware.ts  # requirePermission("employee.view")
│   │   ├── validate.middleware.ts    # Zod request validation
│   │   └── errorHandler.middleware.ts
│   ├── config/                       # DB connection, env config
│   ├── utils/
│   ├── app.ts
|   └── server.ts
|   └── router.ts

frontend/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── authApi.ts
│   │   │   └── authSchema.ts        # Zod schemas
│   │   ├── users/
│   │   ├── roles/
│   │   ├── modules/
│   │   └── permissions/
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── PermissionContext.tsx
│   ├── components/
│   │   ├── ui/                       # Buttons, Inputs, Modals, Table
│   │   ├── layout/                   # Sidebar, Navbar, DashboardLayout
│   ├── routes/
│   │   └── ProtectedRoute.tsx
|   |   └── PublicRoute.tsx
|   |   └── PermissionRoute.tsx
|   |   └── RootRedirect.tsx
│   └── utils/
│       └── axiosInstance.ts
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (Atlas)

### Backend
```bash
cd backend
cp .env.example .env    # fill in MONGO_URI, JWT secrets, etc.
npm install
npm run seed             # seeds modules, operations, permissions, roles, demo users
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env    
npm install
npm run dev
```

---


## 🧩 Modules Implemented

- [x] Authentication (Login, Logout, Refresh, Current User)
- [x] users Management (View, Create, Update)
- [x] Module Management (View, Create)
- [x] Permission Management (View, Create)
- [x] Operation Management (View, Create)
- [x] Role Management (View, Create, Update)
- [ ] Attendance Management *(not implemented)*
- [ ] Leave Management *(not implemented)*
- [ ] Asset Management *(not implemented)*
- [ ] Payroll *(not implemented)*

## Functionalities Implemented

- [x] Cookie-based JWT authentication with login, logout, refresh-token renewal, and authenticated-user (`/me`) retrieval.
- [x] Automatic access-token refresh and session restoration when the frontend loads.
- [x] Dynamic, database-driven RBAC: modules, operations, and permissions can be created at runtime and assigned to roles.
- [x] Backend authorization middleware protects every implemented management endpoint and supports Super Administrator access.
- [x] Frontend permission guards protect routes, filter navigation items, and show an access-denied page for unauthorized users.
- [x] Role hierarchy restricts users to viewing, creating, and managing lower-level roles/accounts.
- [x] User directory groups accounts by role and supports user creation, role assignment, profile updates, and active/inactive status changes.
- [x] Role creation and editing, including permission assignment and permission search while configuring a role.
- [x] Module, operation, and permission listing/creation screens, with permission-aware create controls.
- [x] Zod validation on client forms and server requests, standardized API responses/errors, password hashing, and security middleware (CORS, Helmet, Morgan).
- [x] Seed script that creates demo roles, users, modules, operations, and permission mappings.

### Planned / Not Yet Implemented

- [ ] Employee record CRUD and employee-management UI (only model/validation scaffolding exists).
- [ ] Attendance workflows and attendance UI/API.
- [ ] Leave-request workflows and leave UI/API.
- [ ] Dashboard content.
- [ ] Asset and payroll modules.

---

# Database Schema

## User

| Field | Type | Required | Reference | Default |
|-------|------|----------|-----------|---------|
| name | String | ✅ | — | — |
| email | String | ✅ | — | — |
| password | String | ❌ | — | — |
| role | ObjectId | ❌ | Role | — |
| isSuperAdmin | Boolean | ❌ | — | — |
| refreshToken | String | ❌ | — | — |
| isActive | Boolean | ❌ | — | `true` |
| createdAt | Date | Auto | — | — |
| updatedAt | Date | Auto | — | — |

**Indexes**
- `email` → Unique
- Partial unique index on `isSuperAdmin` (Only one Super Admin can exist)

---

## Module

| Field | Type | Required | Reference | Default |
|-------|------|----------|-----------|---------|
| name | String | ✅ | — | — |
| code | String | ✅ | — | — |
| createdAt | Date | Auto | — | — |
| updatedAt | Date | Auto | — | — |

**Indexes**
- `code` → Unique

---

## Operation

| Field | Type | Required | Reference | Default |
|-------|------|----------|-----------|---------|
| name | String | ✅ | — | — |
| code | String | ✅ | — | — |
| createdAt | Date | Auto | — | — |
| updatedAt | Date | Auto | — | — |

**Indexes**
- `code` → Unique

---

## Permission

| Field | Type | Required | Reference | Default |
|-------|------|----------|-----------|---------|
| module | ObjectId | ✅ | Module | — |
| operation | ObjectId | ✅ | Operation | — |
| code | String | ✅ | — | — |
| label | String | ❌ | — | — |
| description | String | ❌ | — | — |
| createdAt | Date | Auto | — | — |
| updatedAt | Date | Auto | — | — |

**Indexes**
- `code` → Unique

---

## Role

| Field | Type | Required | Reference | Default |
|-------|------|----------|-----------|---------|
| name | String | ✅ | — | — |
| description | String | ❌ | — | — |
| permissions | ObjectId[] | ❌ | Permission | `[]` |
| isSystem | Boolean | ❌ | — | `false` |
| level | Number | ❌ | — | `100` |
| createdAt | Date | Auto | — | — |
| updatedAt | Date | Auto | — | — |

**Indexes**
- `name` → Unique

---

## Relationships

```text
User
 └── Role

Role
 └── Permission[]

Permission
 ├── Module
 └── Operation
```
