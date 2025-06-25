# Configuración de Autenticación con Supabase

## Pasos para configurar la autenticación

### 1. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
```

### 2. Configurar Supabase

1. Ve a tu proyecto de Supabase
2. En la sección "Authentication" > "Settings"
3. Habilita "Email auth" si no está habilitado
4. Opcionalmente, puedes deshabilitar "Email confirmations" para desarrollo

### 3. Configurar políticas de seguridad (RLS)

Para las tablas que requieren autenticación, asegúrate de tener las políticas RLS apropiadas:

```sql
-- Ejemplo para tabla clientes
CREATE POLICY "Users can view their own clients" ON clientes
FOR ALL USING (auth.uid() = user_id);

-- O para permitir acceso a usuarios autenticados
CREATE POLICY "Authenticated users can access clients" ON clientes
FOR ALL USING (auth.role() = 'authenticated');
```

### 4. Funcionalidades implementadas

- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Logout
- ✅ Protección de rutas
- ✅ Redirección automática
- ✅ Estado de autenticación global
- ✅ Interfaz de usuario minimalista con tema azul oscuro

### 5. Uso

1. Los usuarios no autenticados serán redirigidos a `/login`
2. Los usuarios autenticados serán redirigidos a `/` (Dashboard)
3. El estado de autenticación se mantiene entre recargas de página
4. El botón de logout está disponible en el header del Dashboard

### 6. Componentes creados

- `src/composables/useAuth.js` - Composable para manejar autenticación
- `src/components/Login.vue` - Componente de login/registro
- `src/guards/auth.js` - Guards para proteger rutas
- Actualizado `src/router/index.js` - Rutas con protección
- Actualizado `src/components/Dashboard.vue` - Botón de logout
- Actualizado `src/App.vue` - Manejo global de autenticación 