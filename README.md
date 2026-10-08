# Hotel Management System

## Enterprise Java Full Stack Capstone Project

A complete full-stack Hotel Management System built using **Spring Boot, Spring Security, JWT Authentication, React, MySQL, and REST APIs**.

The application allows authenticated users to manage rooms, customers, and bookings through a responsive web interface.

---

## 1. Project Overview

The Hotel Management System is an enterprise-style full-stack web application developed as part of the Enterprise Java Full Stack Capstone Project.

The application consists of:

- Spring Boot REST API backend
- React frontend
- MySQL database
- JWT-based authentication
- Role-based authorization
- Spring Data JPA / Hibernate
- Global exception handling
- Swagger / OpenAPI documentation
- Responsive user interface

---

## 2. Technologies Used

### Backend

- Java 17
- Spring Boot 4.1.1
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT Authentication
- BCrypt Password Encryption
- MySQL
- Maven
- Springdoc OpenAPI / Swagger

### Frontend

- React
- JavaScript
- Vite
- HTML5
- CSS3
- Fetch API

### Development Tools

- IntelliJ IDEA
- MySQL Workbench
- Postman
- Git
- GitHub

---

## 3. System Architecture

```text
                 ┌───────────────────────┐
                 │      React Frontend   │
                 │       Vite + JS       │
                 └───────────┬───────────┘
                             │
                             │ HTTP / REST
                             │ JWT Token
                             ▼
                 ┌───────────────────────┐
                 │   Spring Boot Backend │
                 │      REST API         │
                 ├───────────────────────┤
                 │ Controllers            │
                 │ Services               │
                 │ Security / JWT         │
                 │ Exception Handling     │
                 │ JPA / Hibernate        │
                 └───────────┬───────────┘
                             │
                             │ JPA / SQL
                             ▼
                 ┌───────────────────────┐
                 │    MySQL Database     │
                 │   hotel_management    │
                 └───────────────────────┘
```

---

## 4. Project Structure

```text
hotel-management/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/hotel_management/
│       │       ├── config/
│       │       │   └── SecurityConfig.java
│       │       │
│       │       ├── controller/
│       │       │   ├── AuthController.java
│       │       │   ├── RoomController.java
│       │       │   ├── CustomerController.java
│       │       │   └── BookingController.java
│       │       │
│       │       ├── entity/
│       │       │   ├── User.java
│       │       │   ├── Room.java
│       │       │   ├── Customer.java
│       │       │   └── Booking.java
│       │       │
│       │       ├── exception/
│       │       │   └── GlobalExceptionHandler.java
│       │       │
│       │       ├── repository/
│       │       │   ├── UserRepository.java
│       │       │   ├── RoomRepository.java
│       │       │   ├── CustomerRepository.java
│       │       │   └── BookingRepository.java
│       │       │
│       │       ├── security/
│       │       │   ├── JwtAuthenticationFilter.java
│       │       │   └── JwtService.java
│       │       │
│       │       ├── service/
│       │       │   ├── AuthService.java
│       │       │   ├── RoomService.java
│       │       │   ├── CustomerService.java
│       │       │   └── BookingService.java
│       │       │
│       │       └── HotelManagementApplication.java
│       │
│       └── resources/
│           └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── pom.xml
└── README.md
```

---

## 5. Main Features

### Authentication

- User registration
- User login
- JWT token authentication
- Secure password hashing using BCrypt
- Stateless authentication
- Role-based authorization

### Room Management

Administrators can:

- View rooms
- Add rooms
- Update rooms
- Delete rooms
- Check room availability

### Customer Management

Authenticated users can:

- View customers
- Add customers
- Update customer information
- Delete customers

### Booking Management

Authenticated users can:

- View bookings
- Create bookings
- Update bookings
- Cancel bookings
- Manage room availability

When a booking is cancelled, the corresponding room becomes available again.

---

## 6. User Roles

The application supports role-based access control.

### ADMIN

Administrators can manage:

- Rooms
- Customers
- Bookings

### CUSTOMER

Customers can access:

- Customer-related operations
- Booking-related operations

Room management is restricted to administrators.

---

## 7. Authentication and Security

The application uses **JWT (JSON Web Token)** authentication.

Authentication flow:

```text
User
  │
  │ Login
  ▼
/api/auth/login
  │
  ▼
Spring Security
  │
  ▼
JWT Token
  │
  ▼
Frontend stores token
  │
  ▼
Token sent with API requests
  │
  ▼
JwtAuthenticationFilter
  │
  ▼
Authenticated Request
```

Passwords are encrypted using BCrypt before being stored.

The backend uses stateless sessions, meaning authentication is handled using JWT tokens rather than server-side sessions.

---

## 8. REST API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login and receive JWT |

### Rooms

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rooms` | Get all rooms |
| GET | `/api/rooms/{id}` | Get room by ID |
| POST | `/api/rooms` | Create a room |
| PUT | `/api/rooms/{id}` | Update a room |
| DELETE | `/api/rooms/{id}` | Delete a room |

### Customers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/{id}` | Get customer by ID |
| POST | `/api/customers` | Create a customer |
| PUT | `/api/customers/{id}` | Update a customer |
| DELETE | `/api/customers/{id}` | Delete a customer |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/{id}` | Get booking by ID |
| POST | `/api/bookings` | Create a booking |
| PUT | `/api/bookings/{id}` | Update a booking |
| DELETE | `/api/bookings/{id}` | Cancel/delete a booking |

---

## 9. Database

The application uses MySQL.

Database name:

```text
hotel_management
```

Main tables/entities:

- User
- Room
- Customer
- Booking

JPA and Hibernate are used to map Java entities to database tables.

---

## 10. Database Configuration

Configure the MySQL connection in:

```text
src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_management
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Replace `YOUR_PASSWORD` with the local MySQL password.

**Do not commit real database passwords or other secrets to GitHub.**

---

## 11. Global Exception Handling

The application implements centralized exception handling using:

```text
@ControllerAdvice
```

and:

```text
@ExceptionHandler
```

The `GlobalExceptionHandler` provides consistent error responses and prevents repeated exception-handling code across individual controllers.

---

## 12. Swagger / OpenAPI Documentation

The backend uses Springdoc OpenAPI for API documentation.

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

Direct Swagger UI path:

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI specification:

```text
http://localhost:8080/v3/api-docs
```

Swagger can be used to view and test the REST API endpoints.

---

## 13. Running the Backend

### Prerequisites

Install:

- Java 17
- Maven
- MySQL
- IntelliJ IDEA or another Java IDE

### Steps

1. Open the project in IntelliJ IDEA.
2. Make sure Java 17 is selected.
3. Start MySQL.
4. Create the `hotel_management` database.
5. Configure `application.properties`.
6. Run:

```text
HotelManagementApplication.java
```

The backend runs on:

```text
http://localhost:8080
```

---

## 14. Running the Frontend

Open PowerShell and navigate to the frontend directory:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The React frontend normally runs at:

```text
http://localhost:5173
```

---

## 15. Frontend and Backend Communication

The React frontend communicates with the Spring Boot backend through REST APIs.

Example:

```text
React Frontend
      │
      │ Fetch API
      ▼
Spring Boot REST API
      │
      ▼
Spring Services
      │
      ▼
JPA / Hibernate
      │
      ▼
MySQL
```

JWT authentication tokens are included in authenticated API requests.

---

## 16. Testing

The application was tested manually through the frontend and REST API.

Tested functionality includes:

- User login
- JWT authentication
- Dashboard access
- Room listing
- Adding rooms
- Updating rooms
- Deleting rooms
- Customer management
- Adding customers
- Booking creation
- Booking cancellation
- Room availability updates
- Data persistence after browser refresh
- Swagger API documentation
- Protected API endpoints

---

## 17. Application Workflow

```text
1. User opens the React application
                ↓
2. User logs in
                ↓
3. Backend authenticates credentials
                ↓
4. JWT token is generated
                ↓
5. Frontend uses JWT for authenticated requests
                ↓
6. User accesses the dashboard
                ↓
7. User manages rooms, customers and bookings
                ↓
8. Spring Boot processes REST requests
                ↓
9. JPA/Hibernate communicates with MySQL
                ↓
10. Updated data is displayed in the frontend
```

---

## 18. Security Features

The application includes:

- JWT authentication
- BCrypt password encryption
- Stateless sessions
- Role-based authorization
- Protected REST endpoints
- CORS configuration
- Spring Security
- Centralized exception handling

Public endpoints include:

```text
/api/auth/**
/swagger-ui/**
/swagger-ui.html
/v3/api-docs/**
```

Protected endpoints require authentication.

---

## 19. Future Enhancements

Possible future improvements include:

- Online payment integration
- Email booking confirmation
- Hotel staff management
- Advanced reporting
- Room image uploads
- Search and filtering
- Booking history
- Admin analytics dashboard
- Cloud deployment
- Docker containerization

---

## 20. Conclusion

The Hotel Management System demonstrates a complete enterprise full-stack application using modern Java backend technologies and a responsive React frontend.

The project integrates:

- Spring Boot
- Spring Security
- JWT authentication
- REST APIs
- Spring Data JPA
- Hibernate
- MySQL
- React
- Swagger/OpenAPI
- Global exception handling

This project demonstrates the complete flow from frontend user interaction to secure backend processing and persistent database storage.