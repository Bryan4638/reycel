import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();

export const cleanExpiredReservations = async () => {
  try {
    const now = new Date();
    console.log(`Ejecutando limpieza de reservas expiradas: ${now}`);
  
    // 1. Obtener reservas expiradas
    const expiredReservations = await prisma.tempInventoryReservation.findMany({
      where: {
        expiresAt: { lte: now }
      },
      select: {
        orderId: true,
        productId: true,
        quantity: true
      }
    });


    if (expiredReservations.length === 0) {
      console.log('No hay reservas expiradas para limpiar');
      return;
    }

    //actualizar el inventario de los productos
    for (const reservation of expiredReservations) {
      await prisma.product.update({
        where: {
          id: reservation.productId
        },
        data: {
          inventoryCount: {
            increment: reservation.quantity
          }
        }
      })
    }

    // 3. Eliminar las reservas expiradas
    const deletedReservations = await prisma.tempInventoryReservation.deleteMany({
      where: {
        expiresAt: { lte: now }
      }
    })

    console.log(
      `Limpieza de reservas completada. Se eliminaron ${deletedReservations.count} reservas expiradas.`
    );
  } catch (error) {
    console.error("Error al limpiar las reservas expiradas:", error);
  }
};

const refreshSalesFacts = async () => {
  try {
    const now = new Date();
    console.log(`Ejecutando actualización de sales_facts: ${now}`);

    await prisma.$executeRaw`
    CALL refresh_sales_facts ();
    `

    console.log("Actualización de sales_facts completada");
  } catch (error) {
    console.error("Error al actualizar sales_facts:", error);
  }
}

// Ejecutar la limpieza cada 5 minutos
export const startReservationCleanup = () => {
  cron.schedule("*/5 * * * *", async () => {
    await cleanExpiredReservations();
  });
  console.log("Programador de limpieza de reservas iniciado");
};

// Ejecutar la actualización de sales_facts cada 5 minutos
export const startSalesFactsRefresh = () => {
  cron.schedule("0 2 * * *", async () => {
    await refreshSalesFacts();
  });
  console.log("Programador de actualización de sales_facts iniciado");
};

