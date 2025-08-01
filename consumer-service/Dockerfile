FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY target/consumer-service-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]