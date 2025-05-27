
 <div align='center'>
     <img src='https://banfondesa.com.do/wp-content/themes/banfondesa/images/logo10anos2.png'  alt='img_banfondesa'/>
 </div>


# 💼 API de Préstamos - BANFONDESA 

Esta API gestiona el ciclo de vida de préstamos (loans), incluyendo clientes, pagos, decisiones de aprobación y amortizaciones. Construida con **NestJS**, **TypeORM**, y **PostgreSQL**.

---

## 🚀 Características

- 📋 Registro y consulta de clientes.
- 💰 Creación y seguimiento de préstamos.
- 🧾 Control de pagos e historial.
- ✅ Sistema de aprobación/rechazo de préstamos.
- 📊 Amortización por tipo (fija o variable).
- 🔒 Seguridad con validaciones y relaciones tipo ORM.

---

## 🧰 Requisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) instalado y corriendo
- Yarn o npm
- Git (para clonar el repositorio)

---

## ⚙️ Instalación

 Paso numero 1 **Clona el repositorio** 📄

```bash
git clone https://github.com/tu-usuario/tu-repo-api-loans.git
cd banfondesa-api
``` 
---

## Paso numero 2 -  **Instala las despendicias** ✨
```bash
pnpm install
```
 O si usas yarn
```bash
yarn install
```

## Paso numero 3 - **Configura tu base de datos** ⚙

Copia el archivo de ejemplo y edita los valores

```bash
cp .env.example .env
```
luego ajusta tu archivo .env copiado 


```
#  APP CONFIG
JWT_SECRET= "" # e.g., "your_jwt_secret"


#  DATABASE CONFIG
DB_HOST= ""  # e.g., "localhost" or "db"
DB_PORT= "" # e.g., "5432"
DB_USER= "" # e.g., "postgres"
DB_PASSWORD= "."     # e.g., "user"
DB_NAME= "" # e.g., "database_name"
```

## Nota 📝

Puesdes buscar en la carpeta database ubicada en el proyecto y restaurar la base de datos basada en el template que te dejare.
o puesdes ejecturar el script que te dejare , cual se te sea mas facil. 

----
## Paso numero 4 - **Crea y sincroniza las tablas con la base de datos:**

```bash
npm run start:dev
# o
yarn start:dev
```
