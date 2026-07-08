-- ==========================================
-- Asset Management System Database Schema
-- ==========================================

-- Create Database
CREATE DATABASE IF NOT EXISTS asset_management;
USE asset_management;

-- ==========================================
-- Users Table
-- ==========================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin','Employee') DEFAULT 'Employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Employees Table
-- ==========================================
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Assets Table
-- ==========================================
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    purchase_date DATE,
    status ENUM('Available', 'Assigned', 'Maintenance')
        DEFAULT 'Available',
    asset_condition ENUM('Good', 'Damaged', 'Repair')
        DEFAULT 'Good',
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Asset Allocation Table
-- ==========================================
CREATE TABLE allocations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    employee_id INT NOT NULL,
    assigned_date DATE NOT NULL,
    return_date DATE,
    status ENUM('Assigned', 'Returned')
        DEFAULT 'Assigned',

    CONSTRAINT fk_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
);

-- ==========================================
-- Maintenance Table
-- ==========================================
CREATE TABLE maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    maintenance_date DATE,
    description TEXT,
    cost DECIMAL(10,2),
    status ENUM('Pending', 'Completed')
        DEFAULT 'Pending',

    CONSTRAINT fk_maintenance_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(id)
        ON DELETE CASCADE
);

-- ==========================================
-- Activity Logs Table
-- ==========================================
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_log
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================
-- Sample Admin User
-- Password: admin123 (replace with a bcrypt hash later)
-- ==========================================
INSERT INTO users (name, email, password, role)
VALUES (
    'Admin',
    'admin@example.com',
    'admin123',
    'Admin'
);

-- ==========================================
-- Sample Employees
-- ==========================================
INSERT INTO employees
(employee_code, name, department, designation, email, phone)
VALUES
('EMP001','Rahul Sharma','IT','Software Engineer','rahul@example.com','9876543210'),
('EMP002','Priya Singh','HR','HR Manager','priya@example.com','9876543211');

-- ==========================================
-- Sample Assets
-- ==========================================
INSERT INTO assets
(asset_name, category, serial_number, purchase_date, status, asset_condition, location)
VALUES
('Dell Latitude 5420','Laptop','DL123456','2024-01-15','Available','Good','Head Office'),
('HP LaserJet Pro','Printer','HP987654','2023-10-10','Available','Good','Admin Office'),
('Lenovo ThinkPad E14','Laptop','LN456789','2024-03-20','Available','Good','IT Department');