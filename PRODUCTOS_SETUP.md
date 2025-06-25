# Configuración de Productos en Supabase

## 1. Configuración de la Base de Datos

### 1.1 Crear la tabla de productos
1. Ve a **SQL Editor** en tu proyecto de Supabase
2. Ejecuta el script SQL del archivo `database/productos_schema.sql`
3. Esto creará la tabla `productos` con todos los campos necesarios

### 1.2 Verificar la tabla
Ve a **Table Editor** y verifica que la tabla `productos` se haya creado correctamente con los campos:

**Campos principales:**
- `id` (BIGSERIAL PRIMARY KEY)
- `marca` (VARCHAR) - Marca del producto
- `modelo` (VARCHAR) - Modelo específico
- `procesador` (VARCHAR) - Procesador
- `ram` (VARCHAR) - Memoria RAM
- `almacenamiento` (VARCHAR) - Almacenamiento
- `tarjeta_grafica` (VARCHAR) - Tarjeta gráfica
- `pantalla` (VARCHAR) - Características de la pantalla
- `sistema_operativo` (VARCHAR) - Sistema operativo
- `conectividad` (VARCHAR) - Opciones de conectividad
- `origen` (VARCHAR) - País de origen
- `anio_lanzamiento` (INTEGER) - Año de lanzamiento
- `garantia` (VARCHAR) - Período de garantía
- `precio_compra_usd` (DECIMAL) - Precio de compra en USD
- `precio_venta_usd` (DECIMAL) - Precio de venta en USD
- `stock` (INTEGER) - Cantidad en stock
- `estado` (VARCHAR) - Estado del producto (activo/inactivo/agotado)
- `created_at` (TIMESTAMP) - Fecha de creación
- `updated_at` (TIMESTAMP) - Fecha de actualización

## 2. Funcionalidades Implementadas

### 2.1 Operaciones CRUD
- ✅ **Crear**: Nuevo producto con validaciones completas
- ✅ **Leer**: Lista de productos con búsqueda avanzada
- ✅ **Actualizar**: Editar producto existente
- ✅ **Eliminar**: Eliminar producto con confirmación

### 2.2 Validaciones
- Marca, modelo, procesador, RAM y almacenamiento requeridos
- Precios de compra y venta: números mayores a 0
- Stock: número mayor o igual a 0
- Año de lanzamiento: entre 1990 y el año siguiente
- Estado: activo, inactivo o agotado

### 2.3 Características adicionales
- Búsqueda en tiempo real por marca, modelo y procesador
- Estados de carga con spinners
- Manejo de errores con mensajes descriptivos
- Confirmaciones de acciones
- Diseño responsivo con tabla optimizada
- Cálculo automático del margen de ganancia
- Indicadores visuales de stock y estado

## 3. Estructura de Archivos

```
src/
├── composables/
│   └── useProductos.js       # Lógica CRUD para productos
├── components/
│   └── ProductoCRUD.vue      # Componente principal del CRUD
└── database/
    └── productos_schema.sql  # Script SQL para crear la tabla
```

## 4. Uso

### 4.1 Acceder al CRUD de productos
1. Ve a `http://localhost:5175/`
2. Navega a la sección "Productos" en el dashboard
3. Usa los botones para crear, editar o eliminar productos

### 4.2 Campos del formulario
**Información básica:**
- Marca, modelo, procesador

**Especificaciones técnicas:**
- RAM, almacenamiento, tarjeta gráfica, pantalla

**Sistema y conectividad:**
- Sistema operativo, conectividad

**Información comercial:**
- Origen, año lanzamiento, garantía

**Precios y stock:**
- Precio compra USD, precio venta USD, stock, estado

## 5. Ejemplos de Datos

### 5.1 Laptop Dell
- **Marca:** Dell
- **Modelo:** Inspiron 15 3000
- **Procesador:** Intel Core i5-1135G7
- **RAM:** 8GB DDR4
- **Almacenamiento:** 256GB SSD
- **Tarjeta gráfica:** Intel UHD Graphics
- **Pantalla:** 15.6 pulgadas FHD
- **Sistema operativo:** Windows 11
- **Conectividad:** WiFi 6, Bluetooth 5.0
- **Origen:** China
- **Año lanzamiento:** 2023
- **Garantía:** 1 año
- **Precio compra:** $450.00
- **Precio venta:** $599.99
- **Stock:** 10
- **Estado:** activo

### 5.2 Laptop HP
- **Marca:** HP
- **Modelo:** Pavilion 14
- **Procesador:** AMD Ryzen 5 5500U
- **RAM:** 16GB DDR4
- **Almacenamiento:** 512GB SSD
- **Tarjeta gráfica:** AMD Radeon Graphics
- **Pantalla:** 14 pulgadas FHD
- **Sistema operativo:** Windows 11
- **Conectividad:** WiFi 6, Bluetooth 5.0
- **Origen:** China
- **Año lanzamiento:** 2023
- **Garantía:** 1 año
- **Precio compra:** $480.00
- **Precio venta:** $649.99
- **Stock:** 5
- **Estado:** activo

## 6. Solución de Problemas

### 6.1 Error de conexión
- Verifica que las credenciales en `src/lib/supabase.js` sean correctas
- Asegúrate de que el proyecto de Supabase esté activo
- Verifica que la tabla `productos` exista

### 6.2 Error de permisos
- Verifica que RLS esté configurado correctamente
- Revisa las políticas de la tabla en Supabase

### 6.3 Error de validación
- Los campos marcados con * son obligatorios
- Los precios deben ser números positivos
- El stock debe ser un número mayor o igual a 0
- El año de lanzamiento debe estar entre 1990 y el año siguiente

## 7. Próximos Pasos

### 7.1 Mejoras sugeridas
- Implementar categorías de productos
- Agregar imágenes de productos
- Implementar filtros avanzados por precio, marca, etc.
- Agregar exportación de catálogo
- Implementar alertas de stock bajo
- Agregar historial de cambios de precios

### 7.2 Integración con otros módulos
- Conectar con el módulo de ventas
- Integrar con el módulo de inventario
- Conectar con el módulo de proveedores
- Implementar reportes de productos más vendidos

## 8. Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Vue 3](https://vuejs.org/guide/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Buenas prácticas para CRUD](https://vuejs.org/guide/best-practices/) 