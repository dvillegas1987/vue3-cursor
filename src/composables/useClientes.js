import { ref, reactive } from 'vue'
import { supabase } from '../lib/supabase'

export function useClientes() {
  const clientes = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Cargar todos los clientes
  const cargarClientes = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (supabaseError) throw supabaseError
      
      clientes.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error al cargar clientes:', err)
    } finally {
      loading.value = false
    }
  }

  // Crear nuevo cliente
  const crearCliente = async (clienteData) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .insert([clienteData])
        .select()
      
      if (supabaseError) throw supabaseError
      
      // Agregar el nuevo cliente al inicio de la lista
      clientes.value.unshift(data[0])
      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Error al crear cliente:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar cliente
  const actualizarCliente = async (id, clienteData) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .update(clienteData)
        .eq('id', id)
        .select()
      
      if (supabaseError) throw supabaseError
      
      // Actualizar el cliente en la lista local
      const index = clientes.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clientes.value[index] = data[0]
      }
      
      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Error al actualizar cliente:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: supabaseError } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
      
      if (supabaseError) throw supabaseError
      
      // Remover el cliente de la lista local
      clientes.value = clientes.value.filter(c => c.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Error al eliminar cliente:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Buscar clientes
  const buscarClientes = async (termino) => {
    if (!termino) {
      await cargarClientes()
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .select('*')
        .or(`nombre.ilike.%${termino}%,apellido.ilike.%${termino}%,dni.ilike.%${termino}%,correo.ilike.%${termino}%`)
        .order('created_at', { ascending: false })
      
      if (supabaseError) throw supabaseError
      
      clientes.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error al buscar clientes:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    clientes,
    loading,
    error,
    cargarClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    buscarClientes
  }
} 