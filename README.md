
 <div align='center'>
     <img src='https://banfondesa.com.do/wp-content/themes/banfondesa/images/logo10anos2.png'  alt='img_banfondesa'/>
 </div>


# 💼 API de Préstamos - BANFONDESA 

Esta API gestiona el ciclo de vida de préstamos (loans), incluyendo clientes, pagos, decisiones de aprobación y amortizaciones. Construida con **NestJS**, **TypeORM**, y **PostgreSQL**.

---
## Hosting API 🔗 


 <a href='https://banfondesa-api-production.up.railway.app/api/v1.0/user' target='_blank' >Enlace </a>


## DOCUMENTACION  API 📓

-  <a href='https://banfondesa-api-production.up.railway.app/api-docs' target='_blank' >Ir a la documentacion publica </a>
-  <a href='http://localhost:3000/api-docs' target='_blank' >Ir a la documentacion local </a>

 Nota: ⚠
- El proyecto tiene que estar en ejecucion para mostrarte la documentacion LOCAL.
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

### Paso numero 1 **Clona el repositorio**

```bash
git clone https://github.com/tu-usuario/tu-repo-api-loans.git
cd banfondesa-api
``` 
---

### Paso numero 2 -  **Instala las despendicias** 💫
```bash
npm install
```
# o si usas yarn
```bash
yarn install
```

### Paso numero 3 - **Configura tu base de datos** ⚙

- Copia el archivo de ejemplo y edita los valores

```bash
cp .env.example .env
```
- Luego ajusta tu archivo .env copiado 


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

----
### Paso numero 4 - **Crea y sincroniza las tablas con la base de datos:**

```bash
npm run start:dev
# o
yarn start:dev
```
----

##  Notas adicionales 📌

- Puedes buscar en la carpeta database ubicada en el proyecto y restaurar la base de datos basada en el template que te dejare.
o puesdes ejecturar el script que te dejare , cual se te sea mas facil.

- Se recomienda usar herramientas como ``Postman`` o ``Insomnia`` para probar la API.
Asegúrate de que PostgreSQL esté corriendo antes de iniciar la aplicación.
