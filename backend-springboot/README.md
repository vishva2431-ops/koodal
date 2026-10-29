# Koodal Backend — Spring Boot 3 & MongoDB Atlas

Personal Job Search & Application Assistant backend service.

## Technology Stack
- **Java**: 21 (OpenJDK 21 / Eclipse Temurin 21)
- **Spring Boot**: 3.3.4
- **Database**: MongoDB Atlas M0 Free Tier
- **Security**: Spring Security 6 (Stateless, CORS-controlled)
- **Validation**: Jakarta Validation / Hibernate Validator

## Quick Start (Local Run)

1. **Set Environment Variables**:
   ```bash
   export MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.free.mongodb.net/koodal_jobs?retryWrites=true&w=majority"
   export CORS_ALLOWED_ORIGINS="http://localhost:3000"
   ```

2. **Build JAR with Maven**:
   ```bash
   mvn clean package -DskipTests
   ```

3. **Run Application**:
   ```bash
   java -jar target/koodal-job-assistant-backend-1.0.0.jar
   ```

4. **Verify Health Endpoint**:
   ```bash
   curl http://localhost:8080/api/health
   ```

## ₹0 Free Hosting Deployment (Render Web Service)
1. Push this repository to GitHub.
2. In Render dashboard, create a **New Web Service** connected to your repo.
3. Root Directory: `backend-springboot`
4. Runtime: `Docker` or `Java`
5. Build Command: `mvn clean package -DskipTests`
6. Start Command: `java -jar target/koodal-job-assistant-backend-1.0.0.jar`
7. Add Environment Variable `MONGODB_URI` with your free MongoDB Atlas connection string.
8. Plan: **Free** ($0/month).
