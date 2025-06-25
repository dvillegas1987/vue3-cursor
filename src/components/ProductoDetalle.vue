<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const route = useRoute()
const router = useRouter()

const producto = ref(null)
const loading = ref(true)
const error = ref(null)

// Cargar producto por ID
const cargarProducto = async () => {
  try {
    const { data, error: supabaseError } = await supabase
      .from('productos')
      .select('*')
      .eq('id', route.params.id)
      .single()
    
    if (supabaseError) throw supabaseError
    
    producto.value = data
  } catch (err) {
    error.value = err.message
    console.error('Error al cargar producto:', err)
  } finally {
    loading.value = false
  }
}

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

// Volver al dashboard
const volverAlDashboard = () => {
  router.push('/')
}

onMounted(() => {
  cargarProducto()
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="volverAlDashboard"
          class="flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver al Dashboard
        </button>
        
        <h1 class="text-3xl font-bold text-white">Detalle del Producto</h1>
        <p class="mt-2 text-gray-400">Información completa del producto</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-2 text-gray-400">Cargando producto...</span>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-900/50 border border-red-700 rounded-lg p-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-300">Error al cargar el producto</h3>
            <div class="mt-2 text-sm text-red-400">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Producto no encontrado -->
      <div v-else-if="!producto" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-300">Producto no encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">El producto que buscas no existe o ha sido eliminado.</p>
      </div>

      <!-- Detalle del producto -->
      <div v-else class="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
        <!-- Header del producto -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-3xl font-bold">{{ producto.marca }} {{ producto.modelo }}</h2>
              <p class="text-blue-100 mt-2">{{ producto.procesador }}</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold">{{ formatPriceUSD(producto.precio_venta_usd) }}</div>
              <div class="text-blue-100 text-sm">Precio de venta</div>
            </div>
          </div>
        </div>

        <!-- Información del producto -->
        <div class="p-6">
          <!-- Estado y stock -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex space-x-4">
              <span :class="`px-3 py-1 text-sm font-medium rounded-full ${getStockColor(producto.stock)}`">
                Stock: {{ producto.stock }} unidades
              </span>
              <span :class="`px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(producto.estado)}`">
                {{ producto.estado }}
              </span>
            </div>
            <div class="text-sm text-gray-400">
              ID: {{ producto.id }}
            </div>
          </div>

          <!-- Especificaciones técnicas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Especificaciones Técnicas</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-400">Procesador:</span>
                  <span class="font-medium text-white">{{ producto.procesador }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">RAM:</span>
                  <span class="font-medium text-white">{{ producto.ram }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Almacenamiento:</span>
                  <span class="font-medium text-white">{{ producto.almacenamiento }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Tarjeta Gráfica:</span>
                  <span class="font-medium text-white">{{ producto.tarjeta_grafica || 'No especificada' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Pantalla:</span>
                  <span class="font-medium text-white">{{ producto.pantalla || 'No especificada' }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Sistema y Conectividad</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-400">Sistema Operativo:</span>
                  <span class="font-medium text-white">{{ producto.sistema_operativo || 'No especificado' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Conectividad:</span>
                  <span class="font-medium text-white">{{ producto.conectividad || 'No especificada' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Origen:</span>
                  <span class="font-medium text-white">{{ producto.origen || 'No especificado' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Año Lanzamiento:</span>
                  <span class="font-medium text-white">{{ producto.anio_lanzamiento }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Garantía:</span>
                  <span class="font-medium text-white">{{ producto.garantia || 'No especificada' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Información de precios -->
          <div class="bg-gray-700 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-white mb-4">Información de Precios</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold text-green-400">{{ formatPriceUSD(producto.precio_venta_usd) }}</div>
                <div class="text-gray-400 text-sm">Precio de Venta</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-300">{{ formatPriceUSD(producto.precio_compra_usd) }}</div>
                <div class="text-gray-400 text-sm">Precio de Compra</div>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex justify-center space-x-4">
            <button
              @click="volverAlDashboard"
              class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 