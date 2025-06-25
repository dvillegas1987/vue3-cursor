<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo o título -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Bienvenido</h1>
        <p class="text-gray-300">Inicia sesión en tu cuenta</p>
      </div>

      <!-- Contenedor del formulario -->
      <div class="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
        <!-- Tabs para login/registro -->
        <div class="flex mb-6 bg-gray-700/50 rounded-lg p-1">
          <button
            @click="activeTab = 'login'"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
              activeTab === 'login'
                ? 'bg-gray-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            ]"
          >
            Iniciar Sesión
          </button>
          <button
            @click="activeTab = 'register'"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
              activeTab === 'register'
                ? 'bg-gray-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            ]"
          >
            Registrarse
          </button>
        </div>

        <!-- Formulario de Login -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="login-email" class="block text-sm font-medium text-gray-200 mb-2">
              Correo Electrónico
            </label>
            <input
              id="login-email"
              v-model="loginForm.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label for="login-password" class="block text-sm font-medium text-gray-200 mb-2">
              Contraseña
            </label>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>

        <!-- Formulario de Registro -->
        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label for="register-email" class="block text-sm font-medium text-gray-200 mb-2">
              Correo Electrónico
            </label>
            <input
              id="register-email"
              v-model="registerForm.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label for="register-password" class="block text-sm font-medium text-gray-200 mb-2">
              Contraseña
            </label>
            <input
              id="register-password"
              v-model="registerForm.password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label for="register-confirm-password" class="block text-sm font-medium text-gray-200 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="register-confirm-password"
              v-model="registerForm.confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Repite tu contraseña"
            />
          </div>

          <button
            type="submit"
            :disabled="loading || !passwordsMatch"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta...
            </span>
            <span v-else>Crear Cuenta</span>
          </button>

          <p v-if="!passwordsMatch && registerForm.confirmPassword" class="text-red-400 text-sm text-center">
            Las contraseñas no coinciden
          </p>
        </form>

        <!-- Mensaje de error -->
        <div v-if="error" class="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
          <p class="text-red-300 text-sm">{{ error }}</p>
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="mt-4 p-3 bg-green-900/50 border border-green-700 rounded-lg">
          <p class="text-green-300 text-sm">{{ successMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { signIn, signUp, loading, error } = useAuth()

const activeTab = ref('login')
const successMessage = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordsMatch = computed(() => {
  return registerForm.value.password === registerForm.value.confirmPassword
})

const handleLogin = async () => {
  const result = await signIn(loginForm.value.email, loginForm.value.password)
  if (result.success) {
    router.push('/')
  }
}

const handleRegister = async () => {
  if (!passwordsMatch.value) return

  const result = await signUp(registerForm.value.email, registerForm.value.password)
  if (result.success) {
    successMessage.value = 'Cuenta creada exitosamente. Revisa tu email para confirmar.'
    registerForm.value = { email: '', password: '', confirmPassword: '' }
    setTimeout(() => {
      activeTab.value = 'login'
      successMessage.value = ''
    }, 3000)
  }
}
</script> 