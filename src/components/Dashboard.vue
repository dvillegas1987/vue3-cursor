<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import ClienteCRUD from './ClienteCRUD.vue'
import ProductoCRUD from './ProductoCRUD.vue'

const router = useRouter()
const { user, signOut } = useAuth()

// Estados para las diferentes secciones
const activeSection = ref('overview')
const isLoading = ref(true)

// Datos de ejemplo para las estadísticas
const stats = ref([
  { 
    title: 'Total Clientes', 
    value: 156, 
    change: '+12%', 
    changeType: 'positive',
    icon: 'users',
    color: 'bg-blue-600'
  },
  { 
    title: 'Productos en Stock', 
    value: 89, 
    change: '+8%', 
    changeType: 'positive',
    icon: 'cube',
    color: 'bg-emerald-600'
  },
  { 
    title: 'Ingresos Mensuales', 
    value: '$45,230', 
    change: '+15%', 
    changeType: 'positive',
    icon: 'dollar-sign',
    color: 'bg-purple-600'
  },
  { 
    title: 'Tareas Pendientes', 
    value: 8, 
    change: '-3%', 
    changeType: 'negative',
    icon: 'clock',
    color: 'bg-orange-600'
  }
])

// Datos de ejemplo para el gráfico de actividad
const activityData = ref([
  { day: 'Lun', value: 65 },
  { day: 'Mar', value: 78 },
  { day: 'Mié', value: 90 },
  { day: 'Jue', value: 81 },
  { day: 'Vie', value: 95 },
  { day: 'Sáb', value: 70 },
  { day: 'Dom', value: 45 }
])

// Datos de ejemplo para las tareas recientes
const recentTasks = ref([
  { id: 1, title: 'Revisar propuestas de clientes', status: 'completed', priority: 'high' },
  { id: 2, title: 'Actualizar base de datos', status: 'in-progress', priority: 'medium' },
  { id: 3, title: 'Preparar reporte mensual', status: 'pending', priority: 'high' },
  { id: 4, title: 'Contactar proveedores', status: 'completed', priority: 'low' }
])

// Simular carga inicial
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

// Función para obtener el icono SVG
const getIcon = (iconName) => {
  const icons = {
    users: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>`,
    'user-plus': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>`,
    'dollar-sign': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>`,
    clock: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
    cube: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>`
  }
  return icons[iconName] || ''
}

// Función para obtener el color de prioridad
const getPriorityColor = (priority) => {
  const colors = {
    high: 'text-red-400 bg-red-900/30',
    medium: 'text-yellow-400 bg-yellow-900/30',
    low: 'text-green-400 bg-green-900/30'
  }
  return colors[priority] || colors.medium
}

// Función para obtener el color de estado
const getStatusColor = (status) => {
  const colors = {
    completed: 'text-green-400 bg-green-900/30',
    'in-progress': 'text-blue-400 bg-blue-900/30',
    pending: 'text-gray-400 bg-gray-700'
  }
  return colors[status] || colors.pending
}

// Función para cerrar sesión
const handleLogout = async () => {
  const result = await signOut()
  if (result.success) {
    router.push('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Loading Screen -->
    <div v-if="isLoading" class="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-white text-lg">Cargando Dashboard...</p>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
      <div class="flex items-center justify-center h-16 bg-gray-900">
        <h1 class="text-xl font-bold text-white">Dashboard</h1>
      </div>
      
      <nav class="mt-8">
        <div class="px-4 space-y-2">
          <button
            @click="activeSection = 'overview'"
            :class="[
              'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105',
              activeSection === 'overview' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Resumen
          </button>
          
          <button
            @click="activeSection = 'clients'"
            :class="[
              'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105',
              activeSection === 'clients' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            Clientes
          </button>
          
          <button
            @click="activeSection = 'products'"
            :class="[
              'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105',
              activeSection === 'products' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Productos
          </button>
          
          <button
            @click="activeSection = 'analytics'"
            :class="[
              'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105',
              activeSection === 'analytics' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Análisis
          </button>
          
          <button
            @click="activeSection = 'settings'"
            :class="[
              'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105',
              activeSection === 'settings' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Configuración
          </button>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Header -->
      <header class="bg-gray-800 shadow-sm border-b border-gray-700">
        <div class="flex items-center justify-between px-8 py-4">
          <div>
            <h2 class="text-2xl font-bold text-white">
              {{ 
                activeSection === 'overview' ? 'Resumen General' :
                activeSection === 'clients' ? 'Gestión de Clientes' :
                activeSection === 'products' ? 'Gestión de Productos' :
                activeSection === 'analytics' ? 'Análisis y Reportes' :
                'Configuración'
              }}
            </h2>
            <p class="text-gray-400 mt-1">
              {{ 
                activeSection === 'overview' ? 'Vista general de tu negocio' :
                activeSection === 'clients' ? 'Administra tus clientes' :
                activeSection === 'products' ? 'Administra tu catálogo de productos' :
                activeSection === 'analytics' ? 'Métricas y estadísticas' :
                'Configura tu aplicación'
              }}
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Notificaciones -->
            <button class="p-2 text-gray-400 hover:text-gray-300 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19h6v-1H4v1z"></path>
              </svg>
            </button>
            
            <!-- Información del usuario -->
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm font-medium text-white">{{ user?.email || 'Usuario' }}</p>
                <p class="text-xs text-gray-400">Administrador</p>
              </div>
              
              <div class="relative">
                <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User">
              </div>
              
              <!-- Botón de logout -->
              <button 
                @click="handleLogout"
                class="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                title="Cerrar sesión"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="p-8 bg-gray-900">
        <!-- Overview Section -->
        <div v-if="activeSection === 'overview'" class="space-y-8">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              v-for="(stat, index) in stats" 
              :key="stat.title"
              class="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-400">{{ stat.title }}</p>
                  <p class="text-2xl font-bold text-white mt-1">{{ stat.value }}</p>
                  <div class="flex items-center mt-2">
                    <span :class="[
                      'text-sm font-medium',
                      stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                    ]">
                      {{ stat.change }}
                    </span>
                    <span class="text-sm text-gray-500 ml-1">vs mes anterior</span>
                  </div>
                </div>
                <div :class="`${stat.color} p-3 rounded-lg`">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon(stat.icon)"></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts and Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Activity Chart -->
            <div class="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Actividad Semanal</h3>
              <div class="flex items-end justify-between h-48 space-x-2">
                <div 
                  v-for="(item, index) in activityData" 
                  :key="item.day"
                  class="flex-1 flex flex-col items-center"
                >
                  <div 
                    class="w-full bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-500"
                    :style="{ height: `${(item.value / 100) * 100}%` }"
                  ></div>
                  <span class="text-xs text-gray-400 mt-2">{{ item.day }}</span>
                </div>
              </div>
            </div>

            <!-- Recent Tasks -->
            <div class="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Tareas Recientes</h3>
              <div class="space-y-4">
                <div 
                  v-for="task in recentTasks" 
                  :key="task.id"
                  class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span class="text-sm font-medium text-white">{{ task.title }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span :class="`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`">
                      {{ task.priority }}
                    </span>
                    <span :class="`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`">
                      {{ task.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Clients Section -->
        <div v-if="activeSection === 'clients'" class="space-y-8">
          <ClienteCRUD />
        </div>

        <!-- Products Section -->
        <div v-if="activeSection === 'products'" class="space-y-8">
          <ProductoCRUD />
        </div>

        <!-- Analytics Section -->
        <div v-if="activeSection === 'analytics'" class="space-y-8">
          <div class="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Análisis de Rendimiento</h3>
            <p class="text-gray-400">Aquí irían los gráficos y análisis detallados...</p>
          </div>
        </div>

        <!-- Settings Section -->
        <div v-if="activeSection === 'settings'" class="space-y-8">
          <div class="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Configuración</h3>
            <p class="text-gray-400">Aquí irían las opciones de configuración...</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones personalizadas */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-gray-800 {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Efectos hover adicionales */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:-translate-y-1:hover {
  transform: translateY(-4px);
}

/* Transiciones suaves */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style> 