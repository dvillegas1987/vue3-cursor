<script setup>
import { useAuth } from './composables/useAuth'

// Inicializar autenticación globalmente
const { loading } = useAuth()
</script>

<template>
  <!-- Loading global mientras se verifica autenticación -->
  <div v-if="loading" class="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-white text-lg">Verificando autenticación...</p>
    </div>
  </div>
  
  <!-- Contenido principal -->
  <router-view v-else />
</template>

<style scoped>
/* Estilos globales si son necesarios */
</style>
