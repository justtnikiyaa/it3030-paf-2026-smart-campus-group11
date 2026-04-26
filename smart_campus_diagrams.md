# Smart Campus Operations Hub - Diagram Structures

You can easily generate these diagrams in **Draw.io** by copying the Mermaid code below and using the Draw.io import feature:
1. Go to **Draw.io** (app.diagrams.net).
2. In the top menu, click **Arrange** -> **Insert** -> **Advanced** -> **Mermaid...**
3. Paste the code for the diagram you want and click **Insert**.

---

## 1. System Architecture
This shows the high-level interaction between the React frontend, Spring Boot backend, PostgreSQL database, and Google OAuth.

```mermaid
flowchart TD
    Client[Client / Web Browser]
    
    subgraph Frontend Environment
        ReactApp[React Application]
    end
    
    subgraph Backend Environment
        SpringBoot[Spring Boot REST API]
    end
    
    Database[(PostgreSQL Database)]
    OAuth[Google OAuth 2.0]

    Client -->|User Interactions| ReactApp
    ReactApp -->|1. Request Login| OAuth
    OAuth -->|2. Return Access Token| ReactApp
    ReactApp ==>|3. API Calls with JWT| SpringBoot
    SpringBoot <==>|4. JDBC/JPA Data Operations| Database
```

---

## 2. Backend Layered Architecture
This details the internal structure of the Spring Boot application, showing the flow from the security layer down to the database.

```mermaid
flowchart TD
    Client[Frontend React App]
    
    subgraph Spring Boot Backend
        Security[Security Layer\nJWT Authentication & Authorization Filter]
        Controller[Controller Layer\nREST API Endpoints]
        Service[Service Layer\nBusiness Logic & Transaction Management]
        Repository[Repository Layer\nSpring Data JPA Interfaces]
    end
    
    DB[(PostgreSQL Database)]

    Client -->|HTTP Request / JSON| Security
    Security -->|Validated Token & Role| Controller
    Security -.->|Invalid Token| 401[401 Unauthorized Error]
    Controller -->|DTOs| Service
    Service -->|Entities| Repository
    Repository <-->|SQL Queries| DB
    
    Repository -->|Data| Service
    Service -->|Processed Data| Controller
    Controller -->|HTTP Response / JSON| Client
```

---

## 3. Frontend Architecture
This illustrates the React application structure, including routing, main pages, reusable components, and API service integration.

```mermaid
flowchart TD
    Index[index.js / App.js]
    
    subgraph React Router
        Routes[Application Routes]
    end

    subgraph Pages
        Login[Login Page]
        Dashboard[Dashboard Page]
        Bookings[Bookings Page]
        Tickets[Maintenance Tickets Page]
        Admin[Admin Management Panel]
    end

    subgraph UI Components
        Nav[Navigation / Sidebar]
        Table[Data Tables]
        Form[Forms & Modals]
        Cards[Dashboard KPI Cards]
    end

    subgraph Services & State
        State[State Management\nContext API]
        Axios[API Client\nAxios + Interceptors]
    end

    Backend((Spring Boot Backend))

    Index --> Routes
    Routes --> Login
    Routes --> Dashboard
    Routes --> Bookings
    Routes --> Tickets
    Routes --> Admin

    Dashboard -.-> Nav
    Dashboard -.-> Cards
    Bookings -.-> Table
    Tickets -.-> Form
    Admin -.-> Table

    Pages ==> State
    Pages ==> Axios
    
    Axios <==>|HTTP Requests| Backend
```
