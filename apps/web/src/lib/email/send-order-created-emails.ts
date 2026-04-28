import { prisma } from "@luxe/database";
import { Resend } from "resend";
import { AdminNewOrderEmail } from "@/components/emails/admin-new-order-email";
import { OrderConfirmationEmail } from "@/components/emails/order-confirmation-email";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function getDisplayTotal(total: number, subtotal: number, discountAmount: number) {
  if (discountAmount > 0) return total;
  return total > 0 ? total : subtotal;
}

export async function sendOrderCreatedEmails(orderId: string) {
  try {
    if (!resend || !process.env.EMAIL_FROM) {
      console.warn("Email service not configured. Skipping email send.");
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!order) {
      return;
    }

    const subtotal = Number(order.subtotal);
    const discountAmount = Number(order.discountAmount);
    const total = Number(order.total);
    const displayTotal = getDisplayTotal(total, subtotal, discountAmount);

    const customerName =
      `${order.customer.firstName} ${order.customer.lastName}`.trim() || "Customer";

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const orderUrl = `${baseUrl}/account/orders/${order.id}`;

    const jobs = [
      resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: order.customer.email,
        subject: `We received your order ${order.id.slice(0, 8)}`,
        react: OrderConfirmationEmail({
          customerName,
          orderId: order.id,
          items: order.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            lineTotal: Number(item.lineTotal),
          })),
          subtotal,
          discountCode: order.discountCode,
          discountAmount,
          total: displayTotal,
          orderUrl,
        }),
      }),
    ];

    if (process.env.ADMIN_ALERT_EMAIL) {
      jobs.push(
        resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: process.env.ADMIN_ALERT_EMAIL,
          subject: `New order received ${order.id.slice(0, 8)}`,
          react: AdminNewOrderEmail({
            orderId: order.id,
            customerName,
            customerEmail: order.customer.email,
            itemsCount: order.items.length,
            subtotal,
            discountCode: order.discountCode,
            discountAmount,
            total: displayTotal,
          }),
        }),
      );
    }

    await Promise.allSettled(jobs);
  } catch (error) {
    console.error("Order email send failed:", error);
  }
}
