import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
// Reemplaza estas URLs con las de tu proyecto de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://edypzedapilzqilaxohl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkeXB6ZWRhcGlsenFpbGF4b2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MDI0NTcsImV4cCI6MjA2NjM3ODQ1N30.sNifmu-I46LqDlZhX-lnO_iEmnEeiuswi3w-jKZzsNg'

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 