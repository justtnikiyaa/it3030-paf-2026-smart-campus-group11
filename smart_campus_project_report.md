# Smart Campus Operations Hub - Project Report

## 1. Introduction
The Smart Campus Operations Hub is a comprehensive web-based platform designed to streamline and centralize the management of campus facilities, services, and administrative tasks. The system addresses common operational challenges faced by universities, such as facility booking conflicts, delayed maintenance reporting, and fragmented communication between students, staff, and administration. By providing a unified interface, the platform enhances operational efficiency and improves the overall campus experience. This report details the design, implementation, and testing of the system developed as a group project.

## 2. System Overview & Functionality
The system is built with a modular approach, allowing different aspects of campus operations to be managed effectively. 

### 2.1 Booking Management
This module allows users (students and staff) to browse, request, and manage bookings for campus facilities such as lecture halls, meeting rooms, and sports facilities. Administrators can review, approve, or reject these booking requests to prevent scheduling conflicts.

### 2.2 Maintenance & Incident Ticket System
Users can report maintenance issues (e.g., broken equipment, plumbing problems) or safety incidents by creating tickets. Technicians and administrators can view these tickets, assign priorities, and update the status as work progresses.

### 2.3 Ticket Commenting System
To facilitate clear communication, users and technicians can add comments to specific tickets. This allows for real-time updates, clarifications, and feedback directly on the relevant issue without needing external email threads.

### 2.4 Dashboard UI
A centralized, user-friendly dashboard provides a high-level overview of campus operations. It displays key metrics such as pending bookings, active maintenance tickets, and recent notifications, offering role-specific views for students, administrators, and technicians.

### 2.5 Authentication & Authorization
Security is managed through Google OAuth integration, allowing users to log in securely using their existing campus or Google credentials. A Role-Based Access Control (RBAC) system ensures that users only access features appropriate to their assigned role (e.g., User, Admin, Technician).

### 2.6 Notification System
The notification system keeps users informed about critical updates. It sends automated alerts when a booking is approved or rejected, when a ticket's status changes, or when a new comment is added to a relevant ticket.

## 3. Requirements Specification

### 3.1 Functional Requirements
* **Booking Management:** Users must be able to view facility availability, submit booking requests, and cancel bookings. Admins must be able to approve or reject requests.
* **Ticketing System:** Users must be able to create maintenance tickets with descriptions and locations. Technicians must be able to change ticket statuses (e.g., Open, In Progress, Resolved).
* **Commenting:** Users and technicians must be able to post comments on active tickets.
* **Dashboard:** The system must display a summary of relevant information based on the user's role upon login.
* **Authentication:** The system must authenticate users via Google OAuth.
* **Role Management:** The system must restrict access to administrative endpoints to authorized Admin and Technician roles.
* **Notifications:** The system must generate and deliver notifications for booking updates, ticket updates, and new comments.

### 3.2 Non-Functional Requirements
* **Usability:** The web interface must be intuitive, responsive, and accessible across different devices.
* **Security:** User data and authentication tokens must be securely handled. API endpoints must be protected against unauthorized access.
* **Performance:** The system should handle concurrent users and load pages quickly.
* **Scalability:** The architecture must allow for future additions, such as integrating more modules like library management or cafeteria ordering.

## 4. System Architecture
The Smart Campus Operations Hub follows a modern client-server architecture.

### 4.1 Frontend Architecture
The user interface is built using a modern JavaScript framework (React), providing a dynamic Single Page Application (SPA) experience. It manages user state, handles API requests securely, and renders the Dashboard and module interfaces dynamically.

### 4.2 Backend Architecture
The backend is developed using Java and Spring Boot, offering a robust and scalable REST API. It handles business logic, data validation, authorization checks, and interacts with the database.

### 4.3 Database Architecture
A relational database is used to ensure data integrity and manage complex relationships between Users, Bookings, Tickets, Comments, and Notifications.

### 4.4 Authentication Flow (OAuth)
The system utilizes Google OAuth 2.0 for user authentication. When a user logs in, the backend authenticates the user via Google and maintains the session state using Spring Security Session Cookies (`JSESSIONID`). This cookie is used to securely track the user's authenticated session and role information across subsequent API calls, without exposing sensitive credentials.

## 5. API Design Overview
The system exposes a set of RESTful APIs to facilitate communication between the frontend and backend.
* **`/api/auth`**: Endpoints for handling Google OAuth login, token generation, and user role assignment.
* **`/api/bookings`**: Endpoints for creating, retrieving, updating (approving/rejecting), and deleting facility bookings.
* **`/api/tickets`**: Endpoints for submitting maintenance tickets, updating their status, and retrieving ticket lists.
* **`/api/comments`**: Endpoints to add and fetch comments related to specific tickets.
* **`/api/notifications`**: Endpoints to fetch unread notifications and mark them as read.

## 6. Testing and Validation
To ensure the reliability of the system, a comprehensive testing strategy was implemented:
* **Unit Testing:** Individual components and services, such as the notification generator and RBAC logic, were tested in isolation to verify their correctness.
* **Integration Testing:** API endpoints were tested to ensure proper communication between the backend services and the database.
* **System Testing:** End-to-End (E2E) workflows, such as a user submitting a ticket and receiving a notification upon status change, were validated from the frontend through to the database.

## 7. Individual Contribution: Member 4
*This section details the specific features and modules implemented by Member 4.*

### 7.1 Authentication & Google OAuth Login
I was responsible for implementing the secure login system using Google OAuth 2.0. This involved configuring the Google Cloud Console, setting up the frontend to request OAuth tokens, and developing the backend endpoints to validate these tokens securely. By utilizing Google OAuth, we eliminated the need to store sensitive passwords in our database, significantly improving the system's security and user convenience. 

### 7.2 Role-Based Access Control (RBAC)
To ensure system integrity, I designed and implemented the Role-Based Access Control (RBAC) mechanism. I defined distinct roles—`USER`, `ADMIN`, and `TECHNICIAN`—and integrated this logic into the Spring Boot backend. I secured the REST APIs by implementing method-level security, ensuring that, for example, only an `ADMIN` can approve bookings and only a `TECHNICIAN` can update maintenance ticket statuses. I also developed the admin user management features to support these authorization requirements.

### 7.3 Notification System Implementation
I developed the core notification system to keep users engaged and informed. This involved:
* Designing the database schema to store notifications efficiently.
* Creating backend services to generate notifications triggered by specific events, such as when a booking is approved/rejected, when a ticket's status changes, or when a new comment is added to a ticket.
* Implementing REST API endpoints for the frontend to retrieve unread notifications.
* Validating the accurate delivery of notifications across different user roles to ensure they receive timely and relevant updates regarding their campus activities.

### 7.4 Testing & API Evidence
I created a comprehensive `.http` test suite (`api-tests.http`) that allows automated execution of all critical API endpoints directly within the IDE. This suite handles the OAuth `JSESSIONID` integration and demonstrates successful execution of key workflows (OAuth authentication, RBAC authorization, Ticket creation, Booking flows, and Notification retrieval).

## 8. System Demonstration & Evidence
As per the assignment requirements:
* **Running System:** The project is fully demonstrable locally. Both the Vite frontend (port 5173) and the Spring Boot backend (port 8081) have been configured to run seamlessly on the local environment.
* **API & OAuth Evidence:** Screenshots demonstrating the successful execution of the aforementioned API workflows and the Google OAuth login process are attached as evidence alongside this report.
* **Version Control (GitHub):** Screenshots of the GitHub repository's commit history and insights are included to demonstrate active collaboration, version control best practices, and continuous integration throughout the development lifecycle.

## 9. Conclusion
The Smart Campus Operations Hub successfully demonstrates a functional, integrated solution for managing university facilities and operations. Through effective teamwork, we developed a system that covers booking, ticketing, communication, and security. The modular architecture ensures that the system is scalable and can be expanded in the future, providing a solid foundation for a truly "smart" campus environment.
