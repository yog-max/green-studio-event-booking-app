FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:resolve -B
COPY src ./src
RUN ./mvnw clean package -DskipTests -B
EXPOSE 8080
CMD ["java", "-jar", "target/Green_Studio-0.0.1-SNAPSHOT.jar"]
