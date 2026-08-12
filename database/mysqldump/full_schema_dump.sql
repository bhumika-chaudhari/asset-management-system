CREATE DATABASE  IF NOT EXISTS `asset_management` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `asset_management`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: asset_management
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `allocations`
--

DROP TABLE IF EXISTS `allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allocations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `assigned_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `status` enum('Assigned','Returned') DEFAULT 'Assigned',
  PRIMARY KEY (`id`),
  KEY `asset_id` (`asset_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `allocations_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `allocations_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allocations`
--

LOCK TABLES `allocations` WRITE;
/*!40000 ALTER TABLE `allocations` DISABLE KEYS */;
INSERT INTO `allocations` VALUES (1,6,5,'2022-10-07',NULL,'Assigned'),(3,4,3,'2024-12-07','2026-07-20','Returned');
/*!40000 ALTER TABLE `allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_name` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `status` enum('Available','Assigned','Maintenance') DEFAULT 'Available',
  `asset_condition` enum('Good','Damaged','Repair') DEFAULT 'Good',
  `location` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial_number` (`serial_number`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (4,'Dell Latitude 5420','Laptop','DL1001','2025-01-04','Maintenance','Repair','Mumbai Office','2026-07-13 17:43:51'),(6,'Macbook pro','Laptop','MAC32247','2023-10-04','Assigned','Good','Mumbai Office','2026-07-19 11:05:02'),(8,'DELL','Monitor ','DELL4543','2023-10-03','Available','Good','Pune,India','2026-07-26 15:03:49');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action` varchar(100) DEFAULT NULL,
  `entity` varchar(50) DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `description` text,
  `user_id` int DEFAULT NULL,
  `previous_hash` varchar(64) DEFAULT NULL,
  `current_hash` varchar(64) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'UPDATE','Asset',7,'Updated Asset: HP Victus ',1,'GENESIS_BLOCK','857d590564d33d50ced25d796117cfa9281c23c2c1b8bcea48aab3bcc6530676','2026-07-20 13:47:00'),(2,'UPDATE','Asset',7,'Updated Asset: HP Victus ',1,'857d590564d33d50ced25d796117cfa9281c23c2c1b8bcea48aab3bcc6530676','3310ecbfd75196aea6adcd89a7bc05a40ff0d5e71cb6cabb94a13502ce0d897a','2026-07-20 13:47:16'),(3,'ALLOCATE','Allocation',4,'Allocated Asset 4 to Employee 2',1,'3310ecbfd75196aea6adcd89a7bc05a40ff0d5e71cb6cabb94a13502ce0d897a','8ba681f93477adf19016d2b2ddcb18c0146844fd5ce974b6ce8608016b7dd363','2026-07-20 13:49:00'),(4,'UPDATE','Asset',4,'Updated Asset: Dell Latitude 5420',1,'8ba681f93477adf19016d2b2ddcb18c0146844fd5ce974b6ce8608016b7dd363','0eccd732fae9ef363d49802360768a750b926dc19ef10b40a937df6c67b6c026','2026-07-20 13:54:09'),(5,'UPDATE','Asset',7,'Updated Asset: HP Victus ',1,'0eccd732fae9ef363d49802360768a750b926dc19ef10b40a937df6c67b6c026','d9b9bcf0b7c7235ec9daaab667fbff37b53d4da2402ad96dc471c2e549e69c56','2026-07-20 13:54:13'),(6,'ALLOCATE','Allocation',1,'Allocated Asset 6 to Employee 5',1,'d9b9bcf0b7c7235ec9daaab667fbff37b53d4da2402ad96dc471c2e549e69c56','66c82a5b0d819f2943ddcfe238faec6ecfd3d54e99aec95e1f253a1aac9bdb19','2026-07-20 13:54:30'),(7,'ALLOCATE','Allocation',2,'Allocated Asset 7 to Employee 4',1,'66c82a5b0d819f2943ddcfe238faec6ecfd3d54e99aec95e1f253a1aac9bdb19','84310d4e475c1e716830246e4bf985b23d619b54e388aaeee95341cea31e2fc7','2026-07-20 14:00:58'),(8,'DELETE','Asset',7,'Deleted Asset',1,'84310d4e475c1e716830246e4bf985b23d619b54e388aaeee95341cea31e2fc7','275c6d369e063d9e5b081c7b4262de8334bd97a93706c71a00d1c3e42539134f','2026-07-20 14:01:14'),(9,'ALLOCATE','Allocation',3,'Allocated Asset 4 to Employee 3',1,'275c6d369e063d9e5b081c7b4262de8334bd97a93706c71a00d1c3e42539134f','705d61215f556ca4e3276a87f9df61524f67d8dde669001a9c76f41bf301547e','2026-07-20 14:02:22'),(10,'RETURN','Allocation',3,'Returned Allocation 3',1,'705d61215f556ca4e3276a87f9df61524f67d8dde669001a9c76f41bf301547e','79b372b2085fe315074b52944fc90bf5c0d744ba91c3c34376c3a933f52a9d53','2026-07-20 14:02:25'),(11,'UPDATE','Asset',4,'Updated Asset: Dell Latitude 5420',1,'79b372b2085fe315074b52944fc90bf5c0d744ba91c3c34376c3a933f52a9d53','ba30bf9d27dccf39360682a7d65bd42f8f72be869f3f19e41238c5e4a1cf2a13','2026-07-20 14:02:38'),(12,'CREATE','Maintenance',2,'Maintenance created for Asset ID 4',1,'ba30bf9d27dccf39360682a7d65bd42f8f72be869f3f19e41238c5e4a1cf2a13','0546d508c85b4f4cfaa10d0428d677aeaf5742e76d465b7893808af7f5289958','2026-07-20 14:20:08'),(13,'CREATE','Asset',8,'Created Asset: DELL',1,'0546d508c85b4f4cfaa10d0428d677aeaf5742e76d465b7893808af7f5289958','2f234447c19af72701a3e5ea891fbb6af7ead38eb7527a9c3e3e3d11ba1ee44b','2026-07-26 15:03:49');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_code` (`employee_code`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'EMP001','Rahul Sharma','IT','Software Engineer','rahul.sharma@company.com','9876543212','2026-07-09 09:41:18'),(2,'EMP002','Sneha Patel','HR','HR Manager','sneha.patel@company.com','9123456789','2026-07-17 17:39:00'),(3,'EMP003','Bhumika Chaudhari','Developement','SDE','bhumikasc10@gmail.com','9766236307','2026-07-17 17:42:50'),(4,'EMP004','Ananya Gupta','Finance','Accounts Executive','ananya.gupta@company.com','9811122233','2026-07-17 17:45:02'),(5,'EMP005','Vikram Mehta','Marketing','Marketing Analyst','vikram.mehta@company.com','9822233344','2026-07-17 17:45:15'),(6,'EMP006','Priya Nair','Operations','Operations Manager','priya.nair@company.com','9833344455','2026-07-17 17:45:24'),(7,'EMP007','Arjun Desai','IT','System Administrator','arjun.desai@company.com','9844455566','2026-07-17 17:45:33');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_id` int NOT NULL,
  `maintenance_date` date DEFAULT NULL,
  `description` text,
  `cost` decimal(10,2) DEFAULT NULL,
  `status` enum('Pending','Completed') DEFAULT 'Pending',
  `previous_status` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `asset_id` (`asset_id`),
  CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
INSERT INTO `maintenance` VALUES (1,4,'2026-07-14','Battery replacement',2500.00,'Completed',NULL),(2,4,'2022-12-02','akdkask',3434.00,'Pending','Available');
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Employee') DEFAULT 'Employee',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Rahul Sharma','rahul@gmail.com','$2b$10$Yp3I8QeNz8kT3bDynwkNVeNE.zQ3MFWx2l8l6dHhYEM4AOd8nQnv6','Admin','2026-07-09 09:14:01'),(2,'Amit','amit@gmail.com','$2b$10$RLe1xFMSsr9/Cn6Rbd.weOBrd0iX6DzqGKUO42L/dWZdOHY022gui','Employee','2026-07-09 09:25:56');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'asset_management'
--

--
-- Dumping routines for database 'asset_management'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-11 23:10:29
