// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.baseUser.findUnique({
    where: { username: "admin" },
    include: { administrator: true },
  });

  if (existingAdmin) {
    console.log("El usuario administrador ya existe:", existingAdmin);
    return;
  }

  const hashedPassword = await bcryptjs.hash("*reycel*4dm1n", 10);

  const adminUser = await prisma.baseUser.create({
    data: {
      email: "admin@example.com",
      username: "admin",
      password: hashedPassword,
      status: true,
      administrator: {
        create: {
          role: Role.OWNER,
        },
      },
    },
    include: {
      administrator: true,
    },
  });

  console.log("Usuario administrador creado:", adminUser);

  console.log("Creando tabla sales_facts");
  await prisma.$executeRaw`
    CREATE TABLE sales_facts (
      fact_id BIGSERIAL PRIMARY KEY,
      product_id VARCHAR(36) REFERENCES "Product"(id),
      sede_id VARCHAR(36) REFERENCES "Sede"(id),
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
  `;

  await prisma.$executeRaw`
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
  `;

  await prisma.$executeRaw`
    CREATE TRIGGER trg_sales_facts_derived_fields
    BEFORE INSERT OR UPDATE ON sales_facts
    FOR EACH ROW EXECUTE FUNCTION update_sales_facts_derived_fields();
  `;

  await prisma.$executeRaw`
    CREATE INDEX idx_sales_facts_date ON sales_facts (transaction_date);
  `;

  await prisma.$executeRaw`
    CREATE INDEX idx_sales_facts_product ON sales_facts (product_id);  
  `;

  await prisma.$executeRaw`
    CREATE INDEX idx_sales_facts_sede ON sales_facts (sede_id);
    
  `;

  await prisma.$executeRaw`
    CREATE INDEX idx_sales_facts_payment ON sales_facts (payment_method_id);
  `;

  await prisma.$executeRaw`
    CREATE INDEX idx_sales_facts_month ON sales_facts (month_year);
  `;

  await prisma.$executeRaw`
    CREATE INDEX idx_sales_facts_quarter ON sales_facts (quarter);
  `;

  await prisma.$executeRaw`
  CREATE OR REPLACE PROCEDURE refresh_sales_facts()
  LANGUAGE plpgsql
  AS $$
  BEGIN
      -- Eliminar datos existentes
      TRUNCATE sales_facts;
      
      -- Insertar nuevos datos
      INSERT INTO sales_facts (
          product_id, sede_id, payment_method_id, 
          order_id, quantity, unit_price, 
          total_amount, transaction_date, investment_price
      )
      SELECT 
          oi."productId",
          p."sedeId",
          pm.id,
          o.id,
          oi.quantity,
          p.price,
          oi.quantity * p.price,
          o."createdAt",
          p.investments * oi.quantity
      FROM 
          "OrderItem" oi
      JOIN 
          "Order" o ON oi."orderId" = o.id
      JOIN 
          "Product" p ON oi."productId" = p.id
      JOIN 
          "Payment" pay ON pay."orderId" = o.id
      JOIN 
          "PaymentMethod" pm ON pay."paymentMethodId" = pm.id
      WHERE 
          o.pending = false
          AND pay."paymentStatus" = 'COMPLETED';
  END;
  $$;
  `;
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
