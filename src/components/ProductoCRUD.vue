<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useProductos } from '../composables/useProductos'
import QRModal from './QRModal.vue'

// Usar el composable de productos
const { 
  productos, 
  loading, 
  error, 
  cargarProductos, 
  crearProducto, 
  actualizarProducto, 
  eliminarProducto, 
  buscarProductos 
} = useProductos()

// Estado para el formulario
const formData = reactive({
  marca: '',
  modelo: '',
  procesador: '',
  ram: '',
  almacenamiento: '',
  tarjeta_grafica: '',
  pantalla: '',
  sistema_operativo: '',
  conectividad: '',
  origen: '',
  anio_lanzamiento: '',
  garantia: '',
  precio_compra_usd: '',
  precio_venta_usd: '',
  stock: '',
  estado: 'activo'
})

// Estados de la UI
const showForm = ref(false)
const editingId = ref(null)
const searchTerm = ref('')
const formLoading = ref(false)

// Estados para el modal QR
const showQRModal = ref(false)
const selectedProducto = ref(null)

// Validación
const errors = ref({})

// Cargar productos al montar el componente
onMounted(() => {
  cargarProductos()
})

// Abrir modal QR
const openQRModal = (producto) => {
  console.log('Abriendo modal QR para producto:', producto)
  selectedProducto.value = producto
  showQRModal.value = true
  console.log('showQRModal.value =', showQRModal.value)
  console.log('selectedProducto.value =', selectedProducto.value)
}

// Cerrar modal QR
const closeQRModal = () => {
  showQRModal.value = false
  selectedProducto.value = null
}

// Validar formulario
const validateForm = () => {
  errors.value = {}
  
  if (!formData.marca.trim()) {
    errors.value.marca = 'La marca es requerida'
  }
  
  if (!formData.modelo.trim()) {
    errors.value.modelo = 'El modelo es requerido'
  }
  
  if (!formData.procesador.trim()) {
    errors.value.procesador = 'El procesador es requerido'
  }
  
  if (!formData.ram.trim()) {
    errors.value.ram = 'La RAM es requerida'
  }
  
  if (!formData.almacenamiento.trim()) {
    errors.value.almacenamiento = 'El almacenamiento es requerido'
  }
  
  if (!formData.precio_compra_usd) {
    errors.value.precio_compra_usd = 'El precio de compra es requerido'
  } else if (isNaN(formData.precio_compra_usd) || parseFloat(formData.precio_compra_usd) <= 0) {
    errors.value.precio_compra_usd = 'El precio de compra debe ser un número mayor a 0'
  }
  
  if (!formData.precio_venta_usd) {
    errors.value.precio_venta_usd = 'El precio de venta es requerido'
  } else if (isNaN(formData.precio_venta_usd) || parseFloat(formData.precio_venta_usd) <= 0) {
    errors.value.precio_venta_usd = 'El precio de venta debe ser un número mayor a 0'
  }
  
  if (!formData.stock) {
    errors.value.stock = 'El stock es requerido'
  } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
    errors.value.stock = 'El stock debe ser un número mayor o igual a 0'
  }
  
  if (!formData.anio_lanzamiento) {
    errors.value.anio_lanzamiento = 'El año de lanzamiento es requerido'
  } else if (isNaN(formData.anio_lanzamiento) || parseInt(formData.anio_lanzamiento) < 1990 || parseInt(formData.anio_lanzamiento) > new Date().getFullYear() + 1) {
    errors.value.anio_lanzamiento = 'El año debe estar entre 1990 y el año siguiente'
  }
  
  return Object.keys(errors.value).length === 0
}

// Limpiar formulario
const clearForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = key === 'estado' ? 'activo' : ''
  })
  errors.value = {}
  editingId.value = null
}

// Abrir formulario para crear
const openCreateForm = () => {
  clearForm()
  showForm.value = true
}

// Abrir formulario para editar
const openEditForm = (producto) => {
  Object.keys(formData).forEach(key => {
    formData[key] = producto[key] || (key === 'estado' ? 'activo' : '')
  })
  editingId.value = producto.id
  showForm.value = true
}

// Guardar producto
const saveProducto = async () => {
  if (!validateForm()) return
  
  formLoading.value = true
  
  try {
    const productoData = {
      ...formData,
      precio_compra_usd: parseFloat(formData.precio_compra_usd),
      precio_venta_usd: parseFloat(formData.precio_venta_usd),
      stock: parseInt(formData.stock),
      anio_lanzamiento: parseInt(formData.anio_lanzamiento)
    }
    
    if (editingId.value) {
      // Editar producto existente
      await actualizarProducto(editingId.value, productoData)
    } else {
      // Crear nuevo producto
      await crearProducto(productoData)
    }
    
    showForm.value = false
    clearForm()
  } catch (err) {
    console.error('Error al guardar producto:', err)
  } finally {
    formLoading.value = false
  }
}

// Eliminar producto
const deleteProducto = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    try {
      await eliminarProducto(id)
    } catch (err) {
      console.error('Error al eliminar producto:', err)
    }
  }
}

// Buscar productos
const handleSearch = async () => {
  await buscarProductos(searchTerm.value)
}

// Filtrar productos localmente (como respaldo)
const filteredProductos = computed(() => {
  if (!searchTerm.value) return productos.value
  
  const term = searchTerm.value.toLowerCase()
  return productos.value.filter(producto => 
    producto.marca.toLowerCase().includes(term) ||
    producto.modelo.toLowerCase().includes(term) ||
    producto.procesador.toLowerCase().includes(term) ||
    producto.ram.toLowerCase().includes(term)
  )
})

// Formatear precio USD
const formatPriceUSD = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Obtener color de stock
const getStockColor = (stock) => {
  if (stock <= 0) return 'text-red-400 bg-red-900/30'
  if (stock <= 5) return 'text-orange-400 bg-orange-900/30'
  return 'text-green-400 bg-green-900/30'
}

// Obtener color de estado
const getEstadoColor = (estado) => {
  const colors = {
    activo: 'text-green-400 bg-green-900/30',
    inactivo: 'text-red-400 bg-red-900/30',
    agotado: 'text-gray-400 bg-gray-900/30'
  }
  return colors[estado] || colors.activo
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white">Gestión de Productos</h1>
        <p class="mt-2 text-gray-400">Administra tu catálogo de productos</p>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-300">Error de conexión</h3>
            <div class="mt-2 text-sm text-red-400">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de acciones -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchTerm"
            @input="handleSearch"
            type="text"
            placeholder="Buscar productos..."
            class="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <button
          @click="openCreateForm"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nuevo Producto
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Grid de productos -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="producto in filteredProductos" 
          :key="producto.id"
          class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <!-- Header del producto -->
          <div class="p-4 border-b border-gray-700">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-white truncate">
                {{ producto.marca }} {{ producto.modelo }}
              </h3>
              <div class="flex space-x-1">
                <button
                  @click="openQRModal(producto)"
                  class="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  title="Ver QR"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                </button>
                <button
                  @click="openEditForm(producto)"
                  class="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  title="Editar"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="deleteProducto(producto.id)"
                  class="text-red-400 hover:text-red-300 transition-colors duration-200"
                  title="Eliminar"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Estado del producto -->
            <div class="flex items-center justify-between">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                producto.estado === 'activo' 
                  ? 'text-green-400 bg-green-900/30' 
                  : 'text-red-400 bg-red-900/30'
              ]">
                {{ producto.estado === 'activo' ? 'Activo' : 'Inactivo' }}
              </span>
              <span class="text-sm text-gray-400">
                Stock: {{ producto.stock }}
              </span>
            </div>
          </div>

          <!-- Especificaciones -->
          <div class="p-4 space-y-3">
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-400">Procesador:</span>
                <p class="text-white font-medium truncate">{{ producto.procesador }}</p>
              </div>
              <div>
                <span class="text-gray-400">RAM:</span>
                <p class="text-white font-medium">{{ producto.ram }}</p>
              </div>
              <div>
                <span class="text-gray-400">Almacenamiento:</span>
                <p class="text-white font-medium truncate">{{ producto.almacenamiento }}</p>
              </div>
              <div>
                <span class="text-gray-400">Año:</span>
                <p class="text-white font-medium">{{ producto.anio_lanzamiento }}</p>
              </div>
            </div>

            <!-- Precios -->
            <div class="border-t border-gray-700 pt-3">
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-sm text-gray-400">Precio Venta:</span>
                  <p class="text-lg font-bold text-green-400">${{ producto.precio_venta_usd }}</p>
                </div>
                <div class="text-right">
                  <span class="text-sm text-gray-400">Compra:</span>
                  <p class="text-sm text-gray-300">${{ producto.precio_compra_usd }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay productos -->
      <div v-if="filteredProductos.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-300">No hay productos</h3>
        <p class="mt-1 text-sm text-gray-500">Comienza agregando tu primer producto.</p>
      </div>
    </div>

    <!-- Modal del formulario -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-700">
          <h3 class="text-lg font-medium text-white">
            {{ editingId ? 'Editar Producto' : 'Nuevo Producto' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveProducto" class="px-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Marca -->
            <div>
              <label for="marca" class="block text-sm font-medium text-gray-200 mb-1">
                Marca *
              </label>
              <input
                id="marca"
                v-model="formData.marca"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.marca }"
              >
              <p v-if="errors.marca" class="mt-1 text-sm text-red-400">{{ errors.marca }}</p>
            </div>

            <!-- Modelo -->
            <div>
              <label for="modelo" class="block text-sm font-medium text-gray-200 mb-1">
                Modelo *
              </label>
              <input
                id="modelo"
                v-model="formData.modelo"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.modelo }"
              >
              <p v-if="errors.modelo" class="mt-1 text-sm text-red-400">{{ errors.modelo }}</p>
            </div>

            <!-- Procesador -->
            <div>
              <label for="procesador" class="block text-sm font-medium text-gray-200 mb-1">
                Procesador *
              </label>
              <input
                id="procesador"
                v-model="formData.procesador"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.procesador }"
              >
              <p v-if="errors.procesador" class="mt-1 text-sm text-red-400">{{ errors.procesador }}</p>
            </div>

            <!-- RAM -->
            <div>
              <label for="ram" class="block text-sm font-medium text-gray-200 mb-1">
                RAM *
              </label>
              <input
                id="ram"
                v-model="formData.ram"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.ram }"
              >
              <p v-if="errors.ram" class="mt-1 text-sm text-red-400">{{ errors.ram }}</p>
            </div>

            <!-- Almacenamiento -->
            <div>
              <label for="almacenamiento" class="block text-sm font-medium text-gray-200 mb-1">
                Almacenamiento *
              </label>
              <input
                id="almacenamiento"
                v-model="formData.almacenamiento"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.almacenamiento }"
              >
              <p v-if="errors.almacenamiento" class="mt-1 text-sm text-red-400">{{ errors.almacenamiento }}</p>
            </div>

            <!-- Tarjeta Gráfica -->
            <div>
              <label for="tarjeta_grafica" class="block text-sm font-medium text-gray-200 mb-1">
                Tarjeta Gráfica
              </label>
              <input
                id="tarjeta_grafica"
                v-model="formData.tarjeta_grafica"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Pantalla -->
            <div>
              <label for="pantalla" class="block text-sm font-medium text-gray-200 mb-1">
                Pantalla
              </label>
              <input
                id="pantalla"
                v-model="formData.pantalla"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Sistema Operativo -->
            <div>
              <label for="sistema_operativo" class="block text-sm font-medium text-gray-200 mb-1">
                Sistema Operativo
              </label>
              <input
                id="sistema_operativo"
                v-model="formData.sistema_operativo"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Conectividad -->
            <div>
              <label for="conectividad" class="block text-sm font-medium text-gray-200 mb-1">
                Conectividad
              </label>
              <input
                id="conectividad"
                v-model="formData.conectividad"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Origen -->
            <div>
              <label for="origen" class="block text-sm font-medium text-gray-200 mb-1">
                Origen
              </label>
              <input
                id="origen"
                v-model="formData.origen"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Año de Lanzamiento -->
            <div>
              <label for="anio_lanzamiento" class="block text-sm font-medium text-gray-200 mb-1">
                Año de Lanzamiento *
              </label>
              <input
                id="anio_lanzamiento"
                v-model="formData.anio_lanzamiento"
                type="number"
                required
                min="1990"
                :max="new Date().getFullYear() + 1"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.anio_lanzamiento }"
              >
              <p v-if="errors.anio_lanzamiento" class="mt-1 text-sm text-red-400">{{ errors.anio_lanzamiento }}</p>
            </div>

            <!-- Garantía -->
            <div>
              <label for="garantia" class="block text-sm font-medium text-gray-200 mb-1">
                Garantía
              </label>
              <input
                id="garantia"
                v-model="formData.garantia"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Precio de Compra -->
            <div>
              <label for="precio_compra_usd" class="block text-sm font-medium text-gray-200 mb-1">
                Precio de Compra (USD) *
              </label>
              <input
                id="precio_compra_usd"
                v-model="formData.precio_compra_usd"
                type="number"
                required
                step="0.01"
                min="0"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.precio_compra_usd }"
              >
              <p v-if="errors.precio_compra_usd" class="mt-1 text-sm text-red-400">{{ errors.precio_compra_usd }}</p>
            </div>

            <!-- Precio de Venta -->
            <div>
              <label for="precio_venta_usd" class="block text-sm font-medium text-gray-200 mb-1">
                Precio de Venta (USD) *
              </label>
              <input
                id="precio_venta_usd"
                v-model="formData.precio_venta_usd"
                type="number"
                required
                step="0.01"
                min="0"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.precio_venta_usd }"
              >
              <p v-if="errors.precio_venta_usd" class="mt-1 text-sm text-red-400">{{ errors.precio_venta_usd }}</p>
            </div>

            <!-- Stock -->
            <div>
              <label for="stock" class="block text-sm font-medium text-gray-200 mb-1">
                Stock *
              </label>
              <input
                id="stock"
                v-model="formData.stock"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.stock }"
              >
              <p v-if="errors.stock" class="mt-1 text-sm text-red-400">{{ errors.stock }}</p>
            </div>

            <!-- Estado -->
            <div>
              <label for="estado" class="block text-sm font-medium text-gray-200 mb-1">
                Estado
              </label>
              <select
                id="estado"
                v-model="formData.estado"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </form>
        
        <div class="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
          <button
            @click="showForm = false"
            class="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            @click="saveProducto"
            :disabled="formLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            <svg v-if="formLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ formLoading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal QR -->
    <QRModal 
      :show="showQRModal"
      :producto="selectedProducto" 
      @close="closeQRModal" 
    />
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 