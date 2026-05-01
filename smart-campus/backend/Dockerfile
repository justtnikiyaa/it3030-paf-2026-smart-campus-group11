FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
# Copy pom.xml and download dependencies first for caching
COPY pom.xml .
RUN mvn dependency:go-offline || true

# Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
# Expose the port (Railway typically provides this as an environment variable)
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
