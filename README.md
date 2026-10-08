# Auth App - Login & Registration (React + Spring Boot + MySQL)

A full-stack authentication app with registration, login, password reset and a protected dashboard using JWT tokens.

## Features
- User registration and login
- Password reset
- JWT token-based authentication (protected `/api/me` endpoint)
- Dashboard page shown only after login
- Spring Security configuration with a JWT filter

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) |
| Backend | Java, Spring Boot, Spring Security, Spring Data JPA |
| Database | MySQL |
| Auth | JWT |

## API Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login, returns token |
| POST | `/api/auth/reset-password` | Public | Reset password |
| GET | `/api/me` | Logged in | Current user details |

## Run Locally
**Backend** (runs on `http://localhost:8081`)
1. Install MySQL. The database `authdb` is created automatically.
2. Create `backend/src/main/resources/application-local.properties` (git-ignored) with:
```
spring.datasource.password=YOUR_MYSQL_PASSWORD
app.jwt.secret=A_LONG_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
```
3. Run `AuthApplication` from your IDE, or use `mvn spring-boot:run` inside `backend`.

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Author
**Sowbarnika M** - Java Full Stack Developer (fresher)
