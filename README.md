# Basic OAuth Starter (Spring Boot + React)

A minimal and secure OAuth2 starter template using **Spring Boot
(Gradle)** for the backend and **React** for the frontend.\
Authentication is handled using **JWT access & refresh tokens stored
inside HTTP-only cookies**, ensuring a safe and modern login system.\
The backend uses **PostgreSQL**, **Flyway**, and a clean, extensible
structure for real-world applications.

------------------------------------------------------------------------

## ✨ Features

-   🔐 OAuth2 Login (Google/GitHub or any provider)
-   🍪 Secure JWT access & refresh tokens stored in **HTTP-only
    cookies**
-   🔄 Automatic token refresh endpoint
-   🗄 PostgreSQL with Flyway migrations
-   🚀 Spring Boot backend (Gradle)
-   🎨 React frontend with login/logout flow
-   🧩 Ready to expand into a full production app

------------------------------------------------------------------------

## 🏗 Project Structure

    root
    ├── backend/          # Spring Boot (Gradle)
    │   ├── src/main/java/...
    │   └── src/main/resources/
    │       └── properties.sample
    └── frontend/         # React application
        ├── src/
        └── public/

------------------------------------------------------------------------

## ⚙️ Backend Configuration

The backend uses a `properties.sample` file to define all environment
variables.

### 📄 `properties.sample`

``` properties
server.port=8080
spring.profiles.active=dev

spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/base}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration

com.base.jwt-secret=${JWT_SECRET:veknUvIkwd/XjuS6NS2kfUw1njibhk2JsaxxkHtiAmOAk33Q1qO/0i2eyFQ/5mpYemSJNZ33i6PuibarXS99NQ==}
com.base.refresh-secret=${JWT_REFRESH_SECRET:D9lnjBqEW9zgIwJ1Ij2lWJPmW26aS1UztapNGxuZdEVfo8k8lAh/sdd4lsOWJtBeYuOyVzwNt/r1+eFPROAcyw==}
com.base.jwt-expiration=${JWT_EXPIRATION:900000}
com.base.refresh-expiration=${JWT_REFRESH_EXPIRATION:604800000}
```

### Copy the sample file:

``` bash
cp src/main/resources/properties.sample src/main/resources/application.properties
```

Then update the fields with your real values.

------------------------------------------------------------------------

## ▶ Backend Setup (Spring Boot + Gradle)

### 1. Navigate to backend directory

``` bash
cd backend
```

### 2. Run backend

``` bash
./gradlew bootRun
```

Server runs at:

    http://localhost:8080

------------------------------------------------------------------------

## 🖥 Frontend Setup (React)

Inside `frontend/`:

``` bash
npm install
npm start
```

------------------------------------------------------------------------

## 🔑 Authentication Flow

1.  **User clicks Login** → React redirects to backend.
2.  Backend redirects user to OAuth provider.
3.  On success:
    -   Access Token → stored as HTTP-only cookie
    -   Refresh Token → stored as HTTP-only cookie
4.  React makes protected requests; cookies are sent automatically.
5.  When access token expires:
    -   React triggers `/auth/refresh`
    -   Backend returns a new token in cookies
6.  Logout clears cookies.

------------------------------------------------------------------------


## 📜 License

MIT License --- free to modify and use.
