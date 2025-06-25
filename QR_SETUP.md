# Configuración de Códigos QR para Productos

## Descripción
Esta funcionalidad permite generar códigos QR para cada producto que, al ser escaneados, llevan a una página de detalle del producto con información completa como stock, estado, especificaciones técnicas y precios.

## Características Implementadas

### 1. Generación de Códigos QR
- **Botón QR**: Cada producto en la tabla tiene un botón azul con icono QR
- **Modal QR**: Al hacer clic se abre un modal que muestra el código QR generado
- **URL del Producto**: El QR contiene la URL directa al detalle del producto
- **Descarga**: Opción para descargar el código QR como imagen PNG

### 2. Página de Detalle del Producto
- **Ruta**: `/producto/:id` donde `:id` es el ID del producto
- **Información Completa**: Muestra todas las especificaciones del producto
- **Estado y Stock**: Información destacada con colores indicativos
- **Precios**: Precio de compra, venta y margen de ganancia
- **Navegación**: Botón para volver al dashboard

### 3. Navegación con Vue Router
- **Configuración**: Router configurado con rutas para dashboard y detalle de producto
- **Historial**: Navegación con historial del navegador
- **Props**: Parámetros de ruta pasados como props al componente

## Archivos Creados/Modificados

### Nuevos Archivos:
- `src/router/index.js` - Configuración de Vue Router
- `src/components/ProductoDetalle.vue` - Página de detalle del producto
- `src/components/QRModal.vue` - Modal para mostrar códigos QR
- `src/composables/useQRCode.js` - Composable para generar códigos QR

### Archivos Modificados:
- `src/main.js` - Configuración del router
- `src/App.vue` - Uso del router-view
- `src/components/ProductoCRUD.vue` - Agregado botón QR y modal

## Dependencias Instaladas

```bash
npm install qrcode vue-router
```

- **qrcode**: Biblioteca para generar códigos QR
- **vue-router**: Router oficial de Vue.js

## Cómo Usar

### 1. Generar Código QR
1. Ve al dashboard y abre la sección de Productos
2. En la tabla de productos, busca el botón azul con icono QR
3. Haz clic en el botón para abrir el modal
4. El código QR se genera automáticamente
5. Opcional: Descarga el código QR como imagen

### 2. Escanear Código QR
1. Usa cualquier aplicación de escaneo de QR en tu dispositivo móvil
2. Apunta la cámara al código QR
3. Se abrirá automáticamente la página de detalle del producto
4. Verás toda la información del producto incluyendo stock y estado

### 3. Navegar Manualmente
- URL directa: `http://localhost:5173/producto/{ID_DEL_PRODUCTO}`
- Reemplaza `{ID_DEL_PRODUCTO}` con el ID real del producto

## Funcionalidades del Código QR

### Información Incluida en el QR:
- URL completa al detalle del producto
- Formato: `{BASE_URL}/producto/{ID}`

### Información Mostrada en el Detalle:
- **Información Básica**: Marca, modelo, procesador
- **Especificaciones Técnicas**: RAM, almacenamiento, GPU, pantalla
- **Sistema y Conectividad**: SO, conectividad, origen, año
- **Información Comercial**: Precios en USD, stock, estado
- **Fechas**: Fecha de creación y última actualización

## Personalización

### Colores de Estado:
- **Stock**: Verde (>5), Naranja (≤5), Rojo (0)
- **Estado**: Verde (activo), Rojo (inactivo), Gris (agotado)

### Configuración del QR:
- **Tamaño**: 200x200 píxeles
- **Márgenes**: 2 píxeles
- **Colores**: Negro sobre blanco
- **Formato de descarga**: PNG

## Consideraciones Técnicas

### Seguridad:
- Los códigos QR son públicos y accesibles a cualquiera
- Considera implementar autenticación si la información es sensible

### Rendimiento:
- Los códigos QR se generan dinámicamente
- Se cachean en el modal para evitar regeneración

### Compatibilidad:
- Funciona en cualquier dispositivo con cámara
- Compatible con todas las aplicaciones de escaneo de QR

## Solución de Problemas

### El código QR no se genera:
- Verifica que las dependencias estén instaladas
- Revisa la consola del navegador para errores
- Asegúrate de que el producto tenga un ID válido

### La página de detalle no carga:
- Verifica que el producto existe en la base de datos
- Revisa la configuración de Supabase
- Comprueba que la ruta esté correctamente configurada

### El QR no funciona en móvil:
- Asegúrate de que la aplicación esté corriendo en un servidor accesible
- Verifica que la URL base sea correcta
- Prueba con diferentes aplicaciones de escaneo

## Próximas Mejoras Posibles

1. **QR Personalizado**: Permitir personalizar colores y logo
2. **Múltiples Formatos**: Soporte para PDF, SVG
3. **Estadísticas**: Tracking de escaneos de QR
4. **Autenticación**: Proteger información sensible
5. **Offline**: Generar QR sin conexión a internet 