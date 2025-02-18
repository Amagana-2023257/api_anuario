# Sistema de Gestión de Opiniones - Auth (Autenticación)

## Descripción

Este proyecto es un sistema de gestión de opiniones similar a las publicaciones en Facebook. Esta parte del proyecto está centrada en la autenticación y el perfil de usuario, donde se cubren funcionalidades como el registro, inicio de sesión, y gestión del perfil.

### Funcionalidades principales:
1. **Inicio de sesión y Perfil de usuario**:
   - Los usuarios pueden crear una cuenta en el sistema.
   - Pueden iniciar sesión con su correo electrónico o nombre de usuario y contraseña.
   - Los usuarios pueden editar su perfil, cambiando el nombre de usuario y la contraseña (requiere la contraseña anterior para hacerlo, como medida de seguridad).
   - No se permite la eliminación de perfiles para garantizar la integridad de las opiniones y comentarios.

2. **Manejo de roles**:
   - El sistema usa roles de usuario (`USER` y `ADMIN`).
   - El rol de `ADMIN` tiene privilegios especiales, como la gestión de categorías.

## Requisitos

- **Node.js**: La aplicación está construida con Node.js.
- **Express**: Para manejar las rutas y las peticiones HTTP.
- **MongoDB**: Se utiliza MongoDB como base de datos para almacenar los usuarios.
- **argon2**: Para la encriptación segura de contraseñas.
- **JWT (JSON Web Tokens)**: Para la autenticación de usuarios.
  
## Instalación

### Requisitos previos:
1. Tener instalado **Node.js**.
2. Tener una base de datos en **MongoDB** (puede ser local o usar una base de datos en la nube como MongoDB Atlas).

### Pasos para instalar:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Amagana-2023257/socialNetwork.git
   cd socialNetwork
