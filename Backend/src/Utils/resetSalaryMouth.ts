import { PrismaClient } from "@prisma/client";
import nodeCron from "node-cron";

const prisma = new PrismaClient();

export default async function resetSalaryMouth() {
  const today = new Date();

  // Solo ejecutar si es domingo
  if (today.getDay() === 1) {
    const admins = await prisma.administrator.findMany({
      where: {
        salary: {
          not: null,
        },
      },
      select: {
        id: true,
        salary: true,
      },
    });

    for (const admin of admins) {
      await prisma.administrator.update({
        where: { id: admin.id },
        data: {
          mouthSalary: admin.salary!,
        },
      });
    }

    await prisma.sede.updateMany({
      data: {
        finalLosses: 0,
        netProfits: 0,
      },
    });

    await prisma.investments_Losses.deleteMany({});

    console.log(
      `✅ mouthSalary actualizado correctamente para ${admins.length} administradores.`
    );
  } else if (today.getDay() === 0) {
    console.log("Actualizando Ganancia Neta Semanal");
    const sedes = await prisma.sede.findMany({
      where: {
        finalLosses: {
          not: undefined,
        },
        netProfits: {
          not: undefined,
        },
      },
      select: {
        id: true,
        finalLosses: true,
        netProfits: true,
        workers: true,
      },
    });
    for (const sede of sedes) {
      let netProfit = sede.netProfits - sede.finalLosses;

      const updateSede = await prisma.sede.update({
        where: { id: sede.id },
        data: {
          netProfits: netProfit,
        },
        include: {
          workers: true,
        },
      });

      if (updateSede && updateSede.netProfits >= 50000) {
        const salarySede =
          1000 * parseInt((updateSede.netProfits / 50000).toFixed(0));
        const salarySede100 =
          100 * parseInt((updateSede.netProfits / 5000).toFixed(0));

        for (const workers of updateSede.workers) {
          const finalSalary = salarySede + salarySede100 + workers.mouthSalary;

          await prisma.administrator.update({
            where: {
              id: workers.id,
            },
            data: {
              mouthSalary: finalSalary,
            },
          });
        }
      }
    }
  }
}

// Ejecutar todos los días a las 00:00
nodeCron.schedule("55 23 * * *", () => {
  resetSalaryMouth()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
      console.error("❌ Error al actualizar mouthSalary:", e);
      await prisma.$disconnect();
      process.exit(1);
    });
});
