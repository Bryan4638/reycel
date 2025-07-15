import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$use(async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
    if (params.model === 'OrderItem' && (params.action === 'update' || params.action === 'delete')) {
        let orderItemId: string | undefined;
        let updatedTotalAmount: number | null = null;

        if (params.action === 'update' || params.action === 'delete') {
            orderItemId = params.args.where.id;
        }

        if (!orderItemId) {
            throw new Error('El ID del OrderItem no se proporcionó.');
        }

        let orderItemData;
        if (params.action === 'delete') {
            orderItemData = await prisma.orderItem.findUnique({
                where: { id: orderItemId },
                select: { price: true, orderId: true },
            });

            if (!orderItemData) {
                throw new Error('No se encontró el OrderItem para eliminar.');
            }
        }

        const result = await next(params);

        if (params.action === 'delete' && orderItemData) {
            const updatedOrder = await prisma.order.update({
                where: { id: orderItemData.orderId },
                data: {
                    totalAmount: {
                        decrement: orderItemData.price,
                    },
                },
                select: { totalAmount: true },
            });
            updatedTotalAmount = updatedOrder.totalAmount;
        } else if (params.action === 'update') {
            const orderItem = await prisma.orderItem.findUnique({
                where: { id: orderItemId },
                select: { orderId: true },
            });

            if (orderItem) {
                const totalAmount = await prisma.orderItem.aggregate({
                    where: { orderId: orderItem.orderId },
                    _sum: { price: true, quantity: true },
                });

                const updatedOrder = await prisma.order.update({
                    where: { id: orderItem.orderId },
                    data: { totalAmount: (totalAmount._sum.price || 0 ) },
                    select: { totalAmount: true },
                });
                updatedTotalAmount = updatedOrder.totalAmount;
            }
        }

        return { ...result, totalAmount: updatedTotalAmount };
    }

    return next(params);
});

export default prisma;
