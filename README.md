# Autos Colombia

Aplicación Full-Stack para la gestión e información de vehículos en Colombia. Cuenta con una arquitectura separada cliente/servidor manejada desde un único repositorio.

## 🛠️ Tecnologías

* **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Backend:** [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
* **Base de Datos:** MySQL (conector `mysql2`)
* **Ejecución conjunta:** `concurrently` (para correr todo simultáneamente con un solo script)

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) instalado en tu equipo.
- Una instancia o servicio de MySQL corriendo en el equipo. *Asegúrate de revisar cómo está la conexión a la base de datos en `backend/src/config/db.js`.*

### Paso 1: Instalar Dependencias
Desde la terminal en el directorio raíz (`autos_colombia`), debes instalar las dependencias generales, así como las de cada subdirectorio de forma separada:

```powershell
# 1. Instalar dependencias en la raíz del proyecto
npm install

# 2. Instalar dependencias del backend
cd backend
npm install
cd ..

# 3. Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

*(Nota: Si obtienes un error relacionado con "execution policy" en PowerShell, puedes ejecutar: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`)*

### Paso 2: Ejecutar la Aplicación
Una vez que todo esté instalado, ubícate en la raíz del proyecto (`autos_colombia`) y corre el siguiente comando:

```bash
npm run dev
```

Este comando levantará ambos servidores de forma automática:
- **API Backend:** `http://localhost:3000`
- **Interfaz Frontend:** `http://localhost:5173`

Para detener los servidores, simplemente haz clic en la terminal que los está ejecutando y usa `Ctrl + C`.

---

## 📂 Estructura del Proyecto

* `/frontend`: Código fuente de la interfaz de usuario en React.
* `/backend`: Código fuente de la API, rutas, modelos y conexión a base de datos.
* `/database`: Contiene archivos, scripts o respaldos relacionados a la base de datos MySQL (si los hubiera).
* `package.json`: Archivo de configuración central desde el cual se lanzan ambos entornos al tiempo.
