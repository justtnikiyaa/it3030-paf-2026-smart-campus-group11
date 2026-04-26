<div align="center">

# 🏫 Smart Campus Operations Hub

### A Modern, Full-Stack University Campus Management Platform

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth-2.0-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity)

---

*Streamlining campus facility booking, maintenance ticketing, and real-time notifications — all in one place.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Team & Contributions](#-team--contributions)

---

## 🌟 Overview

The **Smart Campus Operations Hub** is a comprehensive web-based platform designed to centralize and streamline the management of university campus facilities, services, and administrative tasks. It solves common operational challenges such as:

- 🏢 Facility booking conflicts
- 🔧 Delayed maintenance reporting
- 📢 Fragmented communication between students, staff, and administration

By providing a **unified, role-aware interface**, the platform enhances operational efficiency and improves the overall campus experience for everyone.

---

## ✨ Key Features

| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | Secure Google OAuth 2.0 login — no passwords stored |
| 🛡️ **RBAC** | Role-Based Access Control with `USER`, `ADMIN`, and `TECHNICIAN` roles |
| 📅 **Booking Management** | Browse, request, approve/reject facility bookings |
| 🎫 **Maintenance Tickets** | Report issues, assign priorities, track resolution progress |
| 💬 **Ticket Comments** | Real-time threaded communication on tickets |
| 🔔 **Notifications** | Automated alerts for booking updates, ticket changes & comments |
| 📊 **Dashboard** | Role-specific overview with key metrics at a glance |
| 🏗️ **Resource Management** | Admin CRUD for campus facilities (labs, halls, rooms, equipment) |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | Component-based UI framework |
| **Vite 7** | Lightning-fast dev server & build tool |
| **React Router** | Client-side routing (SPA) |
| **Axios** | HTTP client for API communication |
| **CSS3** | Custom styling with modern design patterns |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Java 17** | Core programming language |
| **Spring Boot 3.3** | REST API framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | Database abstraction layer |
| **H2 / PostgreSQL** | Relational database |
| **Google OAuth 2.0** | Third-party authentication provider |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │           React SPA (Vite - Port 5173)        │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────┐  │  │
│  │  │Dashboard│ │ Bookings │ │    Tickets    │  │  │
│  │  └─────────┘ └──────────┘ └───────────────┘  │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────┐  │  │
│  │  │  Auth   │ │  Notifs  │ │   Resources   │  │  │
│  │  └─────────┘ └──────────┘ └───────────────┘  │  │
│  └───────────────────┬───────────────────────────┘  │
└──────────────────────┼──────────────────────────────┘
                       │ HTTP/REST (JSON)
┌──────────────────────┼──────────────────────────────┐
│          Spring Boot Backend (Port 8081)             │
│  ┌───────────────────┴───────────────────────────┐  │
│  │              Security Filter Chain            │  │
│  │      (OAuth2 + Session + RBAC Guards)         │  │
│  └───────────────────┬───────────────────────────┘  │
│  ┌─────────┐ ┌───────┴──┐ ┌──────────┐ ┌────────┐  │
│  │Booking  │ │ Ticket   │ │Notif     │ │Resource│  │
│  │Service  │ │ Service  │ │Service   │ │Service │  │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └───┬────┘  │
│  ┌────┴──────────┴───────────┴───────────┴────┐  │
│  │          Spring Data JPA (Hibernate)         │  │
│  └──────────────────┬──────────────────────────┘  │
└─────────────────────┼────────────────────────────┘
                      │
            ┌─────────┴─────────┐
            │   H2 / PostgreSQL │
            │     Database      │
            └───────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Java JDK** | 17+ | [Download](https://adoptium.net/) |
| **Node.js** | 18+ | [Download](https://nodejs.org/) |
| **Maven** | 3.8+ | [Download](https://maven.apache.org/) |
| **Git** | Latest | [Download](https://git-scm.com/) |

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/justtnikiyaa/Smart-Campus-Operations-Hub.git
cd Smart-Campus-Operations-Hub/smart-campus
```

### 2️⃣ Configure the Backend

Create a `.env` file inside `backend/` with the following:

```env
# Database (H2 is used by default for development)
DB_URL=jdbc:postgresql://localhost:5432/smart_campus_db
DB_USERNAME=postgres
DB_PASSWORD=your_db_password

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Admin emails (comma-separated)
ADMIN_EMAILS=admin@example.com

# File upload directory
UPLOAD_DIR=uploads
```

### 3️⃣ Start the Backend

```bash
cd backend
mvn spring-boot:run
```

> ✅ Backend starts on **http://localhost:8081**
> The H2 database auto-seeds 35 test resources on startup.

### 4️⃣ Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

> ✅ Frontend starts on **http://localhost:5173**

### 5️⃣ Login & Use

1. Open `http://localhost:5173` in your browser.
2. Click **"Login with Google"**.
3. Authenticate with your Google account.
4. 🎉 You're in! Explore the Dashboard, create bookings, submit tickets, and more.

---

## 📁 Project Structure

```
Smart-Campus-Operations-Hub/
│
├── smart-campus/
│   ├── backend/                    # Spring Boot Backend
│   │   ├── src/main/java/com/smartcampus/
│   │   │   ├── booking/           # 📅 Booking module (controller, service, dto, entity)
│   │   │   ├── ticket/            # 🎫 Ticket module (controller, service, dto, entity)
│   │   │   ├── notification/      # 🔔 Notification module
│   │   │   ├── resource/          # 🏗️ Resource management module
│   │   │   ├── user/              # 👤 User & Admin management
│   │   │   ├── security/          # 🔐 OAuth2 & RBAC configuration
│   │   │   └── config/            # ⚙️ App & Security configs
│   │   ├── .env                   # Environment variables
│   │   └── pom.xml                # Maven dependencies
│   │
│   ├── frontend/                  # React Frontend
│   │   ├── src/
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── pages/             # Page-level components
│   │   │   ├── services/          # API service layer (Axios)
│   │   │   ├── context/           # React Context (Auth state)
│   │   │   └── App.jsx            # Root component with routing
│   │   └── package.json           # NPM dependencies
│   │
│   └── api-tests.http             # REST Client API test suite
│
└── .gitignore                     # Git ignore rules
```

---

## 🔌 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/auth/me` | Authenticated | Get current logged-in user |

### 📅 Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/bookings` | User/Admin | Create a booking request |
| `GET` | `/api/bookings/me` | User/Admin | Get my bookings |
| `PATCH` | `/api/bookings/{id}/cancel` | User/Admin | Cancel a booking |
| `GET` | `/api/admin/bookings` | Admin | List all bookings |
| `PATCH` | `/api/admin/bookings/{id}/approve` | Admin | Approve a booking |
| `PATCH` | `/api/admin/bookings/{id}/reject` | Admin | Reject a booking |

### 🎫 Tickets
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/tickets` | User/Admin | Create a maintenance ticket |
| `GET` | `/api/tickets` | Admin | List all tickets |
| `GET` | `/api/tickets/my` | User/Admin | Get my tickets |
| `PUT` | `/api/tickets/{id}/status` | Admin/Tech | Update ticket status |
| `POST` | `/api/tickets/{id}/comments` | User/Admin | Add comment to ticket |

### 🔔 Notifications
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/notifications/my` | User/Admin | Get my notifications |
| `GET` | `/api/notifications/my/unread-count` | User/Admin | Unread notification count |
| `PATCH` | `/api/notifications/my/read-all` | User/Admin | Mark all as read |

### 🏗️ Resources
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/resources` | Authenticated | List all resources |
| `POST` | `/api/resources` | Admin | Create a new resource |
| `GET` | `/api/resources/{id}` | Authenticated | Get resource details |
| `PUT` | `/api/resources/{id}` | Admin | Update a resource |
| `DELETE` | `/api/resources/{id}` | Admin | Delete a resource |

---

## 👥 Team & Contributions



| Member ID |  Name                 | Responsibility |
|-----------|-----------------------|----------------|
| **IT23680098** | **Kawishwara H W T** |  📅 Booking Management Module |
| **IT23643390** | **Dewranga K.K** |  🎫 Maintenance Ticket System |
| **IT23578982** | **G.T.H Wickramarathne** | 💬 Resource Management System |
| **IT23734920** | **W.M.N Dulavin** | 🔐 Authentication, 🛡️ RBAC, 🔔 Notifications |

---

 