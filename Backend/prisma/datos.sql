-- 1. Crear la tabla sin columnas generadas
CREATE TABLE sales_facts (
    fact_id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(36) REFERENCES "Product"(id),  -- String (UUID) en lugar de UUID
    sede_id VARCHAR(36) REFERENCES "Sede"(id),       -- Igual aquí
    payment_method_id VARCHAR(36) REFERENCES "PaymentMethod"(id),
    order_id INTEGER REFERENCES "Order"(id),
    quantity INTEGER NOT NULL,
    investment_price DECIMAL(12,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    month_year VARCHAR(7),
    quarter VARCHAR(7)
);
TRUNCATE sales_facts;

ALTER TABLE sales_facts
ADD COLUMN investment_price DECIMAL(12,2) NOT NULL;

-- 2. Crear la función del trigger para actualizar campos calculados
CREATE OR REPLACE FUNCTION update_sales_facts_derived_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcula month_year en formato 'YYYY-MM'
    NEW.month_year := TO_CHAR(NEW.transaction_date, 'YYYY-MM');
    
    -- Calcula quarter en formato 'YYYY-Q1', 'YYYY-Q2', etc.
    NEW.quarter := EXTRACT(YEAR FROM NEW.transaction_date) || '-Q' || EXTRACT(QUARTER FROM NEW.transaction_date);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Asociar el trigger a la tabla (se ejecuta antes de INSERT/UPDATE)
CREATE TRIGGER trg_sales_facts_derived_fields
BEFORE INSERT OR UPDATE ON sales_facts
FOR EACH ROW EXECUTE FUNCTION update_sales_facts_derived_fields();

-- 4. Crear índices para optimizar consultas
CREATE INDEX idx_sales_facts_date ON sales_facts (transaction_date);
CREATE INDEX idx_sales_facts_product ON sales_facts (product_id);
CREATE INDEX idx_sales_facts_sede ON sales_facts (sede_id);
CREATE INDEX idx_sales_facts_payment ON sales_facts (payment_method_id);
CREATE INDEX idx_sales_facts_month ON sales_facts (month_year);
CREATE INDEX idx_sales_facts_quarter ON sales_facts (quarter);



-- 5. (Opcional) Ejemplo de inserción para probar el funcionamiento
INSERT INTO sales_facts (
    product_id, sede_id, payment_method_id, order_id,
    quantity, unit_price, total_amount, transaction_date
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- product_id (UUID)
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', -- sede_id (UUID)
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', -- payment_method_id (UUID)
    1001,                                   -- order_id (NÚMERO, ejemplo)
    5,                                      -- quantity
    19.99,                                 -- unit_price
    99.95,                                 -- total_amount (5 * 19.99)
    '2025-07-11 14:30:00'                  -- transaction_date
);


-- Verificar que los campos calculados se generaron correctamente
SELECT fact_id, month_year, quarter FROM sales_facts;
 -- Cambiar a INTEGER para que coincida con Order(id)