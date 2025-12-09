🛍️ Tienda Deportiva – Fullstack App
(Spring Boot + React + Supabase + Render)

Este es un proyecto fullstack completo que incluye autenticación, gestión de productos, carrito y pedidos.
Cuenta con un panel administrativo avanzado, integración con Supabase y despliegue en Render.

🚀 Características principales
👤 Usuarios

Registro e inicio de sesión (JWT)

Ver productos

Agregar al carrito

Realizar pedidos

🔐 Administradores

Panel completo para gestión de:

Productos (crear, editar, eliminar, subir imágenes)

Órdenes (pendiente → completado → cancelado)

Control total del inventario

🖼️ Productos

Nombre

Descripción

Precio

Stock

Imagen (almacenada en servidor)

🧾 Órdenes

Fecha de creación

Total

Estado

Relación con el usuario (OneToMany)

📦 Tecnologías utilizadas
Backend

Spring Boot 3

Spring Security + JWT

JPA / Hibernate

PostgreSQL (Supabase)

Maven

Frontend

React

Vite o CRA (según tu repo)

Axios

React Bootstrap

Infraestructura

Render (backend + frontend)

Supabase (PostgreSQL hosting)

⚙️ Configuración del Backend
📁 application.properties
spring.application.name=Tienda

# Base de datos Supabase
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true

# HikariCP recomendado
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=1

# JWT
jwt.secret=${JWT_SECRET}

# Email (SendGrid)
SENDGRID_API_KEY=${SENDGRID_API_KEY}
MAIL_FROM=no-reply@eventia.com

# URLs
app.frontend.url=${APP_FRONTEND_URL}
app.backend.url=${APP_URL}

# Imágenes
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

🗄️ Modelo de Base de Datos
Producto
Campo	Tipo
id	BIGSERIAL
nombre	VARCHAR(100)
descripcion	TEXT
precio	NUMERIC(10,2)
stock	INT
imagen_url	TEXT
Usuario

id

username

email

password (BCrypt)

rol (USER / ADMIN)

Orden

id

fecha_creacion

total

estado

usuario_id

▶️ Ejecutar Backend Localmente
mvn clean package -DskipTests
mvn spring-boot:run


Requiere configurar las variables:

DB_URL

DB_USERNAME

DB_PASSWORD

JWT_SECRET

💻 Configurar Frontend

Crear archivo .env:

REACT_APP_API_URL=http://localhost:8080


Luego ejecutar:

npm install
npm start

🌐 Despliegue en Render
Backend

Build Command:

./mvnw clean package -DskipTests


Start Command:

java -jar target/tu-app.jar


⚠️ Cuando cambies entidades o controladores:
👉 Clear build cache → Deploy

Frontend

Build Command:

npm run build


Publish Directory:

dist/


Variables:

REACT_APP_API_URL=https://tu-backend.onrender.com

🛠️ Panel de Administración

Incluye 3 módulos:

1️⃣ Crear producto

Formulario completo para nuevos productos + imagen.

2️⃣ Listado de productos

Tabla con paginación

Botón de edición

Modal para actualizar

3️⃣ Gestión de pedidos

Ver estado

Marcar entregado ✔️

Cancelar ❌

Totalmente responsive

👥 Roles
Usuario
Acción	Estado
Ver productos	✔️
Crear pedidos	✔️
Ver sus pedidos	✔️
Admin
Acción	Estado
CRUD productos	✔️
Cambiar estado pedidos	✔️
Ver todas las órdenes	✔️
📜 Licencia

Proyecto desarrollado para fines académicos y personales.

🙌 Autor

Proyecto desarrollado por estudiantes de la UTP.
