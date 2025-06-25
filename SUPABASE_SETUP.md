# Configuración de Supabase para el CRUD de Clientes

## 1. Configuración del Proyecto Supabase

### 1.1 Obtener credenciales
1. Ve a [supabase.com](https://supabase.com) y accede a tu proyecto
2. Ve a **Settings** > **API**
3. Copia la **URL** y la **anon public key**

### 1.2 Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
```

## 2. Configuración de la Base de Datos

### 2.1 Crear la tabla
1. Ve a **SQL Editor** en tu proyecto de Supabase
2. Ejecuta el script SQL del archivo `database/schema.sql`
3. Esto creará la tabla `clientes` con todos los campos necesarios

### 2.2 Verificar la tabla
Ve a **Table Editor** y verifica que la tabla `clientes` se haya creado correctamente con los campos:
- id (BIGSERIAL PRIMARY KEY)
- nombre (VARCHAR)
- apellido (VARCHAR)
- dni (VARCHAR, UNIQUE)
- whatsapp (VARCHAR)
- correo (VARCHAR, UNIQUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## 3. Configuración de Seguridad

### 3.1 Row Level Security (RLS)
El script SQL ya habilita RLS y crea una política básica para desarrollo. Para producción, considera crear políticas más específicas.

### 3.2 Políticas recomendadas para producción
```sql
-- Ejemplo de política más específica
CREATE POLICY "Usuarios autenticados pueden ver clientes" ON clientes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden insertar clientes" ON clientes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 4. Funcionalidades Implementadas

### 4.1 Operaciones CRUD
- ✅ **Crear**: Nuevo cliente con validaciones
- ✅ **Leer**: Lista de clientes con búsqueda
- ✅ **Actualizar**: Editar cliente existente
- ✅ **Eliminar**: Eliminar cliente con confirmación

### 4.2 Validaciones
- Nombre y apellido requeridos
- DNI: 8 dígitos, único
- WhatsApp: formato +549 seguido de 10 dígitos
- Correo: formato válido, único

### 4.3 Características adicionales
- Búsqueda en tiempo real
- Estados de carga
- Manejo de errores
- Confirmaciones de acciones
- Diseño responsivo

## 5. Estructura de Archivos

```
src/
├── lib/
│   └── supabase.js          # Configuración del cliente Supabase
├── composables/
│   └── useClientes.js       # Lógica CRUD para clientes
├── components/
│   └── ClienteCRUD.vue      # Componente principal del CRUD
└── database/
    └── schema.sql           # Script SQL para crear la tabla
```

## 6. Uso

### 6.1 Iniciar la aplicación
```bash
npm run dev
```

### 6.2 Acceder al CRUD
1. Ve a `http://localhost:5173/`
2. Navega a la sección "Clientes" en el dashboard
3. Usa los botones para crear, editar o eliminar clientes

## 7. Solución de Problemas

### 7.1 Error de conexión
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que el proyecto de Supabase esté activo
- Verifica que la tabla `clientes` exista

### 7.2 Error de permisos
- Verifica que RLS esté configurado correctamente
- Revisa las políticas de la tabla en Supabase

### 7.3 Error de validación
- Los campos DNI y correo deben ser únicos
- Verifica el formato del WhatsApp (+549 seguido de 10 dígitos)

## 8. Próximos Pasos

### 8.1 Mejoras sugeridas
- Implementar autenticación de usuarios
- Agregar paginación para grandes volúmenes de datos
- Implementar filtros avanzados
- Agregar exportación de datos
- Implementar notificaciones push

### 8.2 Seguridad
- Implementar autenticación JWT
- Crear políticas RLS más específicas
- Agregar validación en el backend
- Implementar rate limiting

## 9. Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Vue 3](https://vuejs.org/guide/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs) 