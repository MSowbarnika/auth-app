# Auth App

A full-stack login and registration app with JWT authentication.

**Tech stack:** React (Vite) · Spring Boot 3 · MySQL · JWT

## Features

- User registration and login
- JWT-based authentication
- Password reset
- Protected dashboard (shown only after login)

## Project Structure

```
auth-app/
├── backend/    # Spring Boot API (port 8081)
├── frontend/   # React + Vite app
└── schema.sql  # MySQL schema
```

## Prerequisites

- Java 17+
- Maven
- Node.js 18+
- MySQL 8+

## Setup

### 1. Database

Make sure MySQL is running. The database `authdb` is created automatically on first run. You can also create the tables manually with `schema.sql`.

### 2. Backend

```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Open `application.properties` and set your values:

```
spring.datasource.password=your_db_password
app.jwt.secret=your_long_random_secret
```

Or use environment variables instead:

```bash
# Windows (cmd)
set DB_PASSWORD=your_db_password
set JWT_SECRET=your_long_random_secret

# Mac / Linux
export DB_PASSWORD=your_db_password
export JWT_SECRET=your_long_random_secret
```

Run the backend:

```bash
mvn spring-boot:run
```

Backend runs at `http://localhost:8081`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint                   | Description              | Auth |
|--------|----------------------------|--------------------------|------|
| POST   | `/api/auth/register`       | Create a new account     | No   |
| POST   | `/api/auth/login`          | Login, returns a JWT     | No   |
| POST   | `/api/auth/reset-password` | Reset password           | No   |
| GET    | `/api/me`                  | Get current user details | Yes  |

Protected endpoints need this header:

```
Authorization: Bearer <token>
```

## Security Notes

- `application.properties` is git-ignored. Never commit real passwords or secrets.
- Use a long, random value for `app.jwt.secret` in any real deployment.

## Author

[MSowbarnika](https://github.com/MSowbarnika)