-- Script para crear la tabla de clientes en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(8) UNIQUE NOT NULL,
    whatsapp VARCHAR(15) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_dni ON clientes(dni);
CREATE INDEX IF NOT EXISTS idx_clientes_correo ON clientes(correo);
CREATE INDEX IF NOT EXISTS idx_clientes_created_at ON clientes(created_at);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_clientes_updated_at 
    BEFORE UPDATE ON clientes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas las operaciones (para desarrollo)
-- En producción, deberías crear políticas más específicas
CREATE POLICY "Permitir todas las operaciones en clientes" ON clientes
    FOR ALL USING (true);

-- Insertar algunos datos de ejemplo (opcional)
INSERT INTO clientes (nombre, apellido, dni, whatsapp, correo) VALUES
    ('Juan', 'Pérez', '12345678', '+5491112345678', 'juan.perez@email.com'),
    ('María', 'González', '87654321', '+5491187654321', 'maria.gonzalez@email.com')
ON CONFLICT (dni) DO NOTHING; 