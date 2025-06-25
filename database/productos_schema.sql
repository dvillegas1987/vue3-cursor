-- Script para crear la tabla de productos en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id BIGSERIAL PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    procesador VARCHAR(200) NOT NULL,
    ram VARCHAR(100) NOT NULL,
    almacenamiento VARCHAR(100) NOT NULL,
    tarjeta_grafica VARCHAR(200),
    pantalla VARCHAR(100),
    sistema_operativo VARCHAR(100),
    conectividad VARCHAR(200),
    origen VARCHAR(100),
    anio_lanzamiento INTEGER NOT NULL,
    garantia VARCHAR(100),
    precio_compra_usd DECIMAL(10,2) NOT NULL,
    precio_venta_usd DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_marca ON productos(marca);
CREATE INDEX IF NOT EXISTS idx_productos_modelo ON productos(modelo);
CREATE INDEX IF NOT EXISTS idx_productos_procesador ON productos(procesador);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos(estado);
CREATE INDEX IF NOT EXISTS idx_productos_stock ON productos(stock);
CREATE INDEX IF NOT EXISTS idx_productos_created_at ON productos(created_at);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_productos_updated_at 
    BEFORE UPDATE ON productos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas las operaciones (para desarrollo)
-- En producción, deberías crear políticas más específicas
CREATE POLICY "Permitir todas las operaciones en productos" ON productos
    FOR ALL USING (true);

-- Insertar algunos datos de ejemplo (opcional)
INSERT INTO productos (
    marca, modelo, procesador, ram, almacenamiento, tarjeta_grafica, 
    pantalla, sistema_operativo, conectividad, origen, anio_lanzamiento, 
    garantia, precio_compra_usd, precio_venta_usd, stock, estado
) VALUES
    ('Dell', 'Inspiron 15 3000', 'Intel Core i5-1135G7', '8GB DDR4', '256GB SSD', 
     'Intel UHD Graphics', '15.6 pulgadas FHD', 'Windows 11', 'WiFi 6, Bluetooth 5.0', 
     'China', 2023, '1 año', 450.00, 599.99, 10, 'activo'),
    
    ('HP', 'Pavilion 14', 'AMD Ryzen 5 5500U', '16GB DDR4', '512GB SSD', 
     'AMD Radeon Graphics', '14 pulgadas FHD', 'Windows 11', 'WiFi 6, Bluetooth 5.0', 
     'China', 2023, '1 año', 480.00, 649.99, 5, 'activo'),
    
    ('Lenovo', 'ThinkPad E15', 'Intel Core i7-1165G7', '16GB DDR4', '1TB SSD', 
     'Intel Iris Xe Graphics', '15.6 pulgadas FHD', 'Windows 11 Pro', 'WiFi 6, Bluetooth 5.0', 
     'China', 2023, '2 años', 650.00, 849.99, 3, 'activo')
ON CONFLICT DO NOTHING; 