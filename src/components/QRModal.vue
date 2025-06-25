<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQRCode } from '../composables/useQRCode'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  producto: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const { generarQRDataURL, descargarQR } = useQRCode()
const qrDataURL = ref('')
const loading = ref(false)
const error = ref(null)

// Función para obtener la URL base
const getBaseURL = () => {
  // Usar la URL actual del navegador
  return window.location.origin
}

// Generar código QR cuando se abre el modal
const generarQR = async () => {
  if (!props.producto) {
    error.value = 'No hay producto seleccionado'
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    // Crear URL del producto usando la URL actual
    const baseURL = getBaseURL()
    const productoURL = `${baseURL}/producto/${props.producto.id}`
    
    console.log('Generando QR para URL:', productoURL)
    
    // Generar QR con la URL del producto
    qrDataURL.value = await generarQRDataURL(productoURL)
    console.log('QR generado exitosamente')
  } catch (err) {
    error.value = 'Error al generar el código QR: ' + err.message
    console.error('Error al generar QR:', err)
  } finally {
    loading.value = false
  }
}

// Descargar código QR
const descargarCodigoQR = async () => {
  if (!props.producto) {
    error.value = 'No hay producto seleccionado'
    return
  }
  
  try {
    const nombreArchivo = `qr-${props.producto.marca}-${props.producto.modelo}.png`
    const baseURL = getBaseURL()
    const productoURL = `${baseURL}/producto/${props.producto.id}`
    
    console.log('Descargando QR para URL:', productoURL)
    
    await descargarQR(productoURL, nombreArchivo)
    console.log('QR descargado exitosamente')
  } catch (err) {
    error.value = 'Error al descargar el código QR: ' + err.message
    console.error('Error al descargar QR:', err)
  }
}

// Cerrar modal
const cerrarModal = () => {
  emit('close')
}

// Generar QR cuando se abre el modal
watch(() => props.show, (newValue) => {
  if (newValue && props.producto) {
    console.log('Modal abierto, generando QR...')
    generarQR()
  }
})

// También generar QR cuando se monta el componente
onMounted(() => {
  if (props.show && props.producto) {
    console.log('Componente montado, generando QR...')
    generarQR()
  }
})
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800 border-gray-700">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-white">
            Código QR - {{ producto?.marca }} {{ producto?.modelo }}
          </h3>
          <button
            @click="cerrarModal"
            class="text-gray-400 hover:text-gray-300"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span class="ml-2 text-gray-400">Generando código QR...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-white">Error</h3>
          <p class="mt-1 text-sm text-gray-400">{{ error }}</p>
          <button
            @click="generarQR"
            class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>

        <!-- QR Code -->
        <div v-else class="text-center">
          <div class="mb-4">
            <img 
              v-if="qrDataURL" 
              :src="qrDataURL" 
              alt="Código QR del producto"
              class="mx-auto border border-gray-600 rounded-lg bg-white p-2"
            >
          </div>
          
          <div class="text-sm text-gray-400 mb-4">
            <p>Escanea este código QR para ver</p>
            <p>el detalle completo del producto</p>
          </div>

          <!-- Información del producto -->
          <div class="bg-gray-700 rounded-lg p-4 mb-4 text-left">
            <div class="text-sm">
              <div class="flex justify-between mb-1">
                <span class="text-gray-400">Producto:</span>
                <span class="font-medium text-white">{{ producto?.marca }} {{ producto?.modelo }}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span class="text-gray-400">Stock:</span>
                <span class="font-medium text-white">{{ producto?.stock }} unidades</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Estado:</span>
                <span class="font-medium text-white">{{ producto?.estado }}</span>
              </div>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex space-x-3">
            <button
              @click="descargarCodigoQR"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Descargar
            </button>
            <button
              @click="cerrarModal"
              class="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Cerrar
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