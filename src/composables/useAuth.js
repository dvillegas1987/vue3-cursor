import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Obtener usuario actual
  const getCurrentUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser
    } catch (err) {
      console.error('Error al obtener usuario actual:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Iniciar sesión con email y contraseña
  const signIn = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      user.value = data.user
      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Registrarse con email y contraseña
  const signUp = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })

      if (signUpError) throw signUpError

      user.value = data.user
      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Cerrar sesión
  const signOut = async () => {
    try {
      loading.value = true
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError

      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Escuchar cambios en la autenticación
  const setupAuthListener = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null
      loading.value = false
    })
  }

  // Inicializar autenticación
  onMounted(() => {
    setupAuthListener()
    getCurrentUser()
  })

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    getCurrentUser
  }
} 