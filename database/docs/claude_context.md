# 🤖 LLM Context / Project Onboarding Document
## Enterprise Asset Management System

**Context for Claude / AI Assistants:**  
This document is designed to give you (the AI) a complete understanding of the Enterprise Asset Management System. Use this as your reference for the architecture, existing modules, conventions, and current progress when assisting with coding or debugging.

---

## 1. Project Overview
A full-stack enterprise application designed to manage physical and IT assets, track employee assignments, and maintain a highly secure, blockchain-inspired audit log.

**Tech Stack:**
*   **Frontend**: Next.js (React 19), Tailwind CSS v4, Framer Motion, `@tanstack/react-query`, Zod, React Hook Form, Axios.
*   **Backend**: Node.js, Express.js v5.
*   **Database**: MySQL (using `mysql2/promise` connection pooling).
*   **Security**: JWT for authentication, `bcrypt` for password hashing.

---

## 2. Codebase Structure & Architecture
The project is split into three main directories: `client/`, `server/`, and `database/`. The backend strictly follows the **Model-View-Controller (MVC)** architectural pattern.

### Backend (`server/`) Directory Layout
```text
server/
├── config/             # Database connection pool (db.js)
├── controllers/        # Business logic (e.g., assetController.js, authController.js)
├── middleware/         # Express middlewares (authMiddleware.js, errorMiddleware.js)
├── models/             # Data access layer / SQL queries (e.g., assetModel.js)
├── routes/             # API endpoint definitions (e.g., assetRoutes.js)
├── utils/              # Helper functions (e.g., asyncHandler.js)
├── validators/         # express-validator schemas (e.g., authValidator.js)
├── app.js              # Express app setup, CORS, JSON parser, Route mounting
└── .env                # Environment variables (DB_HOST, JWT_SECRET, etc.)
```

### Key Architectural Conventions
1.  **Async Error Handling**: All asynchronous controller functions must be wrapped in `utils/asyncHandler.js`. This eliminates the need for `try/catch` blocks in every controller and automatically forwards exceptions to the global `errorMiddleware.js`.
2.  **Request Validation**: Input validation is handled via `express-validator` in the `validators/` folder *before* the request reaches the controller.
3.  **Role-Based Access Control (RBAC)**: Protected routes use `authenticate` and `authorize('Admin')` middlewares to verify JWTs and enforce user roles.
4.  **Database Queries**: The `models/` directory handles direct SQL interactions using `async/await` and the `mysql2` connection pool. Raw SQL is utilized.

---

## 3. Database Schema Overview

The MySQL database (`asset_management`) consists of the following core tables:

*   **`users`**: `id`, `name`, `email`, `password` (hashed), `role` (Admin/Employee).
*   **`employees`**: `id`, `employee_code`, `name`, `department`, `designation`.
*   **`assets`**: `id`, `asset_name`, `category`, `serial_number`, `status` (Available/Assigned/Maintenance).
*   **`allocations`**: Links `assets` to `employees`. Tracks assignment dates and return dates.
*   **`maintenance`**: Tracks repair logs for assets.
*   **`audit_logs`**: Blockchain-inspired ledger. Stores `action`, `user_id`, `entity_id`, `previous_hash`, `current_hash`.

---

## 4. Current State of the Project

### ✅ Completed Modules
*   **Project Setup & Architecture**: MVC structure, `.env` config, Express server initialization.
*   **Database Connectivity**: Connection pooling with `mysql2`.
*   **Authentication**: User Registration, Login, JWT generation, and `bcrypt` password hashing (`authController.js`, `userModel.js`).
*   **Security & Middleware**: Global error handling, RBAC (`authorize`), JWT verification (`authenticate`), and request validation.
*   **Asset Management**: Full CRUD API for Assets (`assetController.js`, `assetModel.js`).
*   **Employee Directory**: Full CRUD API for Employees (`employeeController.js`, `employeeModel.js`).
*   **Asset Allocation Module**: API endpoints to assign assets to employees, prevent double allocations, and manage returns via SQL Transactions.
*   **Blockchain Audit Trail**: Hashing logic (`crypto.createHash('sha256')`) chaining database actions together for a tamper-evident log on all CRUD and allocation actions.
*   **Maintenance Module**: APIs to schedule and track asset repairs.
*   **Dashboard & Reports**: APIs providing insights and reports on asset utilization.
*   **Next.js Frontend**: Complete client-side UI application consuming the backend APIs.

---

## 5. Standard API Response Format
When creating new APIs, ensure the JSON response follows this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response (handled by errorMiddleware):**
```json
{
  "success": false,
  "message": "Error description here",
  "stack": "..." // (Only populated if NODE_ENV !== 'production')
}
```
