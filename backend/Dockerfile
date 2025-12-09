# ====== Etapa 1: Build con Maven ======
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copiamos lo mínimo para resolver dependencias primero
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Damos permisos a mvnw (por si acaso)
RUN chmod +x mvnw

# Descargamos dependencias
RUN ./mvnw dependency:go-offline -B

# Ahora copiamos el código fuente
COPY src src

# Empaquetamos la app (sin tests para que sea más rápido)
RUN ./mvnw clean package -DskipTests

# ====== Etapa 2: Imagen final ligera ======
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiamos el jar generado desde la etapa de build
# Ajusta el nombre si tu jar se llama distinto
COPY --from=build /app/target/*.jar app.jar

# Render te da un PORT como variable de entorno.
# Exponemos 8080 por convención, pero usaremos el PORT en runtime.
EXPOSE 8080

# Usamos sh -c para poder interpolar $PORT correctamente
CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]