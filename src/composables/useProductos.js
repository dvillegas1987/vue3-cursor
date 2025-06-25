import { ref, reactive } from 'vue'
import { supabase } from '../lib/supabase'

export function useProductos() {
  const productos = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Cargar todos los productos
  const cargarProductos = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (supabaseError) throw supabaseError
      
      productos.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error al cargar productos:', err)
    } finally {
      loading.value = false
    }
  }

  // Crear nuevo producto
  const crearProducto = async (productoData) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('productos')
        .insert([productoData])
        .select()
      
      if (supabaseError) throw supabaseError
      
      // Agregar el nuevo producto al inicio de la lista
      productos.value.unshift(data[0])
      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Error al crear producto:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar producto
  const actualizarProducto = async (id, productoData) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('productos')
        .update(productoData)
        .eq('id', id)
        .select()
      
      if (supabaseError) throw supabaseError
      
      // Actualizar el producto en la lista local
      const index = productos.value.findIndex(p => p.id === id)
      if (index !== -1) {
        productos.value[index] = data[0]
      }
      
      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Error al actualizar producto:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar producto
  const eliminarProducto = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: supabaseError } = await supabase
        .from('productos')
        .delete()
        .eq('id', id)
      
      if (supabaseError) throw supabaseError
      
      // Remover el producto de la lista local
      productos.value = productos.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Error al eliminar producto:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Buscar productos
  const buscarProductos = async (termino) => {
    if (!termino) {
      await cargarProductos()
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('productos')
        .select('*')
        .or(`marca.ilike.%${termino}%,modelo.ilike.%${termino}%,procesador.ilike.%${termino}%`)
        .order('created_at', { ascending: false })
      
      if (supabaseError) throw supabaseError
      
      productos.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error al buscar productos:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    productos,
    loading,
    error,
    cargarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    buscarProductos
  }
} 