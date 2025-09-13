import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.paymentMethod.createMany({
    data: [
      { code: 'CASH', name: 'Efectivo' },
      { code: 'CARD', name: 'Tarjeta crédito/débito' },
      { code: 'MP_QR', name: 'QR Mercado Pago' },
    ],
    skipDuplicates: true,
  });

  // cargar opciones principales del menú
  await prisma.option.createMany({
    data: [
      { code: 'BTN_ORDER', title: '1) Ver pedido', type: 'menu' },
      { code: 'BTN_PRICE', title: '2) Consultar precio', type: 'menu' },
      { code: 'BTN_AGENT', title: '3) Hablar con un agente', type: 'menu' },
      { code: 'BTN_PAY', title: '4) Medios de pago', type: 'menu' },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log('datos iniciales cargados✅'))
  .catch((e) => console.error(e))
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
