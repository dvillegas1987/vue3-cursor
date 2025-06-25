import { supabase } from '../lib/supabase'

export async function requireAuth(to, from, next) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Usuario autenticado, permitir acceso
      next()
    } else {
      // Usuario no autenticado, redirigir al login
      next('/login')
    }
  } catch (error) {
    console.error('Error en guard de autenticación:', error)
    next('/login')
  }
}

export async function requireGuest(to, from, next) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Usuario ya autenticado, redirigir al dashboard
      next('/')
    } else {
      // Usuario no autenticado, permitir acceso al login
      next()
    }
  } catch (error) {
    console.error('Error en guard de invitado:', error)
    next()
  }
} 