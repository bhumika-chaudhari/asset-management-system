# 🔄 Asset Management System - Workflow & Low-Level Design (LLD)

## 1. System Overview
The Enterprise Asset Management System is designed to securely manage company assets, track employee assignments, and maintain an immutable audit trail using blockchain principles. The system follows a Model-View-Controller (MVC) architecture with a Next.js frontend and an Express.js backend connecting to a MySQL database.

---

## 2. High-Level Architecture (HLD)

```mermaid
graph TD
    Client[Next.js Frontend] -->|HTTP / REST API| Server[Node/Express.js Backend]
    
    subgraph Backend Server Pipeline
        Server --> Middleware[1. Middleware Layer<br/>Auth, Validation, Error Handling]
        Middleware --> RBAC[2. RBAC Authorization<br/>Admin / Employee Roles]
        RBAC --> Controllers[3. Controllers<br/>Business Logic]
        Controllers --> Models[4. Models<br/>Data Access]
    end
    
    Models <-->|Queries via Pool| DB[(MySQL Database)]
    
    Controllers -.-> AuditLog[Blockchain Audit Logger]
    AuditLog -.-> DB
```

---

## 3. Detailed Workflows (LLD)

### 3.1 Authentication & Authorization Workflow
Manages secure access to the system using JWT and bcrypt.

```mermaid
sequenceDiagram
    participant User/Client
    participant AuthRouter
    participant AuthController
    participant UserModel
    participant Database

    User/Client->>AuthRouter: POST /api/auth/login {email, password}
    AuthRouter->>AuthController: Validate Request
    AuthController->>UserModel: Find user by email
    UserModel->>Database: SELECT * FROM users WHERE email = ?
    Database-->>UserModel: User Data (Hashed Password)
    UserModel-->>AuthController: User Data
    AuthController->>AuthController: bcrypt.compare(password, hash)
    alt Invalid Credentials
        AuthController-->>User/Client: 401 Unauthorized
    else Valid Credentials
        AuthController->>AuthController: Generate JWT Token (jwt.sign)
        AuthController-->>User/Client: 200 OK + Token + User Info
    end
```

### 3.2 Asset Management (CRUD) Workflow
Only authenticated Admins can create, update, or delete assets. Employees have read-only access.

```mermaid
sequenceDiagram
    participant Admin
    participant AssetRouter
    participant AuthMiddleware
    participant AssetController
    participant AssetModel
    participant BlockchainAudit

    Admin->>AssetRouter: POST /api/assets {assetData}
    AssetRouter->>AuthMiddleware: Validate JWT & Role (Admin)
    AuthMiddleware->>AssetController: Proceed
    AssetController->>AssetModel: addAsset(assetData)
    AssetModel->>AssetModel: Execute SQL INSERT
    AssetModel-->>AssetController: Success (Asset ID)
    AssetController->>BlockchainAudit: Log CREATE_ASSET
    BlockchainAudit->>BlockchainAudit: Generate SHA-256 Hash
    AssetController-->>Admin: 201 Created (Asset Details)
```

### 3.3 Employee Directory Workflow
Manages the onboarding and tracking of employees.

**Workflow Steps:**
1. **Request:** Admin sends `POST /api/employees` with employee details.
2. **Validation:** `express-validator` checks for valid email format, phone, and required fields.
3. **Controller Processing:** Calls `employeeModel.createEmployee()`.
4. **Database Execution:** Inserts employee into the `employees` table.
5. **Audit Logging:** System logs the `CREATE_EMPLOYEE` action into the blockchain audit trail.
6. **Response:** Returns the newly created employee profile.

### 3.4 Asset Allocation Workflow (Core Business Logic)
Ensures assets are properly checked out to employees without double assignments.

```mermaid
sequenceDiagram
    participant Admin
    participant AllocController
    participant DBTransaction
    participant AssetModel
    participant AuditLogger

    Admin->>AllocController: POST /api/allocate {assetId, employeeId}
    AllocController->>DBTransaction: START TRANSACTION
    DBTransaction->>AssetModel: Check Status (WHERE id = assetId)
    alt Status != Available
        AssetModel-->>AllocController: Error: Asset already assigned
        AllocController-->>Admin: 400 Bad Request
    else Status == Available
        DBTransaction->>AssetModel: UPDATE assets SET status = 'Assigned'
        DBTransaction->>AssetModel: INSERT INTO allocations
        DBTransaction->>AuditLogger: Log ALLOCATE_ASSET
        AuditLogger->>AuditLogger: Hash(PrevHash + Data)
        DBTransaction->>DBTransaction: COMMIT
        AllocController-->>Admin: 200 OK (Allocation Success)
    end
```

### 3.5 Blockchain-Inspired Audit Trail Workflow
Provides an immutable ledger of all critical actions.

**Workflow Steps:**
1. **Action Triggered:** An action like `CREATE_ASSET`, `UPDATE_ASSET`, `ALLOCATE_ASSET`, or `RETURN_ASSET` occurs.
2. **Fetch Previous Hash:** The system retrieves the `current_hash` of the latest entry in the `audit_logs` table. If it's the genesis block, it uses `"000000000"`.
3. **Data Preparation:** The action type, entity ID (e.g., asset ID), user ID, and timestamp are serialized.
4. **Hash Generation:** 
   `Current Hash = SHA256(Previous Hash + Serialized Data)`
5. **Insertion:** The new log entry is inserted into the `audit_logs` table.
6. **Tamper Verification (Optional API):** An endpoint recalculates the chain from the beginning to ensure no records have been altered.

---

## 4. Database Schema Relationships (ERD Concept)

- **`users` (1) ---> (M) `audit_logs`**: A user (Admin) performs many audited actions.
- **`employees` (1) ---> (M) `allocations`**: An employee can be assigned multiple assets over time.
- **`assets` (1) ---> (M) `allocations`**: An asset has a history of being allocated to different employees.
- **`assets` (1) ---> (M) `maintenance`**: An asset can have multiple maintenance records.

*Note: All data modification queries utilize the `mysql2` connection pool and `async/await` for optimal performance and reliability.*
