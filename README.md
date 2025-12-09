🛍️ Tienda Deportiva – Fullstack App (Spring Boot + React + Supabase + Render)

Este proyecto es una tienda deportiva completa que permite a usuarios registrarse, comprar productos, gestionar pedidos y a administradores administrar inventario y órdenes.

Incluye:

Backend: Spring Boot 3 + Spring Security + JWT + JPA + PostgreSQL

Base de datos: Supabase PostgreSQL

Frontend: React + Bootstrap

Despliegue: Backend y frontend en Render

🚀 Características principales
👤 Usuarios

Registro e inicio de sesión (JWT)

Ver productos

Agregar productos al carrito

Realizar pedidos

🔐 Administrador

Panel con gestión de:

Productos (crear, actualizar, listar, eliminar)

Órdenes (cambiar estado: pendiente, completado, cancelado)

Subida de imágenes con multipart/form-data

Control total del inventario

🖼️ Productos

Nombre

Descripción

Precio

Stock

Imagen (guardada en servidor)

🧾 Órdenes

Fecha de creación

Total

Estado

Relación con usuario

📦 Tecnologías utilizadas
Backend

Spring Boot 3

Spring Security + JWT

JPA / Hibernate

PostgreSQL (Supabase)

Maven

Frontend

React + Vite (o CRA según tu repo)

Axios

React Bootstrap

Infraestructura

Render (Backend y Frontend)

Supabase (Base de datos PostgreSQL)

⚙️ Configuración del Backend
📁 Archivo application.properties
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

# HikariCP (Recomendado para Supabase)
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

spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

🗄️ Modelo de base de datos
Producto
id BIGSERIAL PRIMARY KEY
nombre VARCHAR(100)
descripcion TEXT
precio NUMERIC(10,2)
stock INT
imagen_url TEXT

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

▶️ Ejecutar Backend localmente
mvn clean package -DskipTests
mvn spring-boot:run


Asegúrate de tener:

DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET


Configurados en variables de entorno.

💻 Configurar Frontend

Crea un archivo .env:

REACT_APP_API_URL=http://localhost:8080


Luego:

npm install
npm start

🌐 Despliegue en Render
Backend

Tipo: Web Service

Build Command:

./mvnw clean package -DskipTests


Start Command:

java -jar target/tu-app.jar


⚠️ Cuando cambies entidades o controladores, usa:

👉 Clear build cache → Deploy

Frontend

Tipo: Static Site

Build Command:

npm run build


Publish Directory:

dist/


Variables:

REACT_APP_API_URL=https://tu-backend.onrender.com

🛠️ Admin Panel

Incluye 3 cards:

1. Crear producto

Formulario para agregar nuevos productos con imagen.

2. Listado de productos

Tabla con botón para editar cada uno.

3. Gestión de pedidos

Tabla con:

ID

Fecha

Estado

Total

Botones: Marcar entregado / Cancelar

Totalmente responsive y mejorado para móviles.

👥 Roles
Usuario
Función	Disponible
Ver productos	✔️
Crear pedidos	✔️
Ver sus pedidos	✔️
Admin
Función	Disponible
CRUD productos	✔️
Cambiar estado pedidos	✔️
Ver todos los pedidos	✔️

📜 Licencia

Este proyecto es libre para uso académico y personal.

🙌 Autor

Proyecto desarrollado por estudiantes con asistencia técnica.
