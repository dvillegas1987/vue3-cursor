<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useClientes } from '../composables/useClientes'

// Usar el composable de clientes
const { 
  clientes, 
  loading, 
  error, 
  cargarClientes, 
  crearCliente, 
  actualizarCliente, 
  eliminarCliente, 
  buscarClientes 
} = useClientes()

// Estado para el formulario
const formData = reactive({
  nombre: '',
  apellido: '',
  dni: '',
  whatsapp: '',
  correo: ''
})

// Estados de la UI
const showForm = ref(false)
const editingId = ref(null)
const searchTerm = ref('')
const formLoading = ref(false)

// Validación
const errors = ref({})

// Cargar clientes al montar el componente
onMounted(() => {
  cargarClientes()
})

// Validar formulario
const validateForm = () => {
  errors.value = {}
  
  if (!formData.nombre.trim()) {
    errors.value.nombre = 'El nombre es requerido'
  }
  
  if (!formData.apellido.trim()) {
    errors.value.apellido = 'El apellido es requerido'
  }
  
  if (!formData.dni.trim()) {
    errors.value.dni = 'El DNI es requerido'
  } else if (!/^\d{8}$/.test(formData.dni)) {
    errors.value.dni = 'El DNI debe tener 8 dígitos'
  }
  
  if (!formData.whatsapp.trim()) {
    errors.value.whatsapp = 'El WhatsApp es requerido'
  } else if (!/^\+549\d{10}$/.test(formData.whatsapp)) {
    errors.value.whatsapp = 'Formato: +549 seguido de 10 dígitos'
  }
  
  if (!formData.correo.trim()) {
    errors.value.correo = 'El correo es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
    errors.value.correo = 'Formato de correo inválido'
  }
  
  return Object.keys(errors.value).length === 0
}

// Limpiar formulario
const clearForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = ''
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
const openEditForm = (cliente) => {
  Object.keys(formData).forEach(key => {
    formData[key] = cliente[key]
  })
  editingId.value = cliente.id
  showForm.value = true
}

// Guardar cliente
const saveCliente = async () => {
  if (!validateForm()) return
  
  formLoading.value = true
  
  try {
    if (editingId.value) {
      // Editar cliente existente
      await actualizarCliente(editingId.value, { ...formData })
    } else {
      // Crear nuevo cliente
      await crearCliente({ ...formData })
    }
    
    showForm.value = false
    clearForm()
  } catch (err) {
    console.error('Error al guardar cliente:', err)
  } finally {
    formLoading.value = false
  }
}

// Eliminar cliente
const deleteCliente = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
    try {
      await eliminarCliente(id)
    } catch (err) {
      console.error('Error al eliminar cliente:', err)
    }
  }
}

// Buscar clientes
const handleSearch = async () => {
  await buscarClientes(searchTerm.value)
}

// Filtrar clientes localmente (como respaldo)
const filteredClientes = computed(() => {
  if (!searchTerm.value) return clientes.value
  
  const term = searchTerm.value.toLowerCase()
  return clientes.value.filter(cliente => 
    cliente.nombre.toLowerCase().includes(term) ||
    cliente.apellido.toLowerCase().includes(term) ||
    cliente.dni.includes(term) ||
    cliente.correo.toLowerCase().includes(term)
  )
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white">Gestión de Clientes</h1>
        <p class="mt-2 text-gray-400">Administra la información de tus clientes</p>
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
            placeholder="Buscar clientes..."
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
          Nuevo Cliente
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Tabla de clientes -->
      <div v-else class="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-700">
            <thead class="bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  DNI
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contacto
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Correo
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-gray-800 divide-y divide-gray-700">
              <tr v-for="cliente in filteredClientes" :key="cliente.id" class="hover:bg-gray-700 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span class="text-sm font-medium text-white">
                          {{ cliente.nombre.charAt(0) }}{{ cliente.apellido.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-white">
                        {{ cliente.nombre }} {{ cliente.apellido }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ cliente.dni }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ cliente.whatsapp }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ cliente.correo }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="openEditForm(cliente)"
                      class="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="deleteCliente(cliente.id)"
                      class="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Mensaje cuando no hay clientes -->
        <div v-if="filteredClientes.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-300">No hay clientes</h3>
          <p class="mt-1 text-sm text-gray-500">Comienza agregando tu primer cliente.</p>
        </div>
      </div>
    </div>

    <!-- Modal del formulario -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-700">
          <h3 class="text-lg font-medium text-white">
            {{ editingId ? 'Editar Cliente' : 'Nuevo Cliente' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveCliente" class="px-6 py-4 space-y-4">
          <!-- Nombre -->
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-200 mb-1">
              Nombre *
            </label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.nombre }"
            >
            <p v-if="errors.nombre" class="mt-1 text-sm text-red-400">{{ errors.nombre }}</p>
          </div>

          <!-- Apellido -->
          <div>
            <label for="apellido" class="block text-sm font-medium text-gray-200 mb-1">
              Apellido *
            </label>
            <input
              id="apellido"
              v-model="formData.apellido"
              type="text"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.apellido }"
            >
            <p v-if="errors.apellido" class="mt-1 text-sm text-red-400">{{ errors.apellido }}</p>
          </div>

          <!-- DNI -->
          <div>
            <label for="dni" class="block text-sm font-medium text-gray-200 mb-1">
              DNI *
            </label>
            <input
              id="dni"
              v-model="formData.dni"
              type="text"
              required
              maxlength="8"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.dni }"
              placeholder="12345678"
            >
            <p v-if="errors.dni" class="mt-1 text-sm text-red-400">{{ errors.dni }}</p>
          </div>

          <!-- WhatsApp -->
          <div>
            <label for="whatsapp" class="block text-sm font-medium text-gray-200 mb-1">
              WhatsApp *
            </label>
            <input
              id="whatsapp"
              v-model="formData.whatsapp"
              type="text"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.whatsapp }"
              placeholder="+5491123456789"
            >
            <p v-if="errors.whatsapp" class="mt-1 text-sm text-red-400">{{ errors.whatsapp }}</p>
          </div>

          <!-- Correo -->
          <div>
            <label for="correo" class="block text-sm font-medium text-gray-200 mb-1">
              Correo Electrónico *
            </label>
            <input
              id="correo"
              v-model="formData.correo"
              type="email"
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.correo }"
              placeholder="cliente@email.com"
            >
            <p v-if="errors.correo" class="mt-1 text-sm text-red-400">{{ errors.correo }}</p>
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
            @click="saveCliente"
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
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 