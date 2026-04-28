import { prisma } from "@luxe/database";
import { Resend } from "resend";
import { PaymentSuccessEmail } from "@/components/emails/payment-success-email";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendPaymentSuccessEmail(orderId: string) {
  try {
    if (!resend || !process.env.EMAIL_FROM) {
      console.warn("Email service not configured. Skipping payment success email.");
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
      },
    });

    if (!order) {
      return;
    }

    const total = Number(order.total) > 0 ? Number(order.total) : Number(order.subtotal);
    const customerName =
      `${order.customer.firstName} ${order.customer.lastName}`.trim() || "Customer";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const orderUrl = `${baseUrl}/account/orders/${order.id}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: order.customer.email,
      subject: `Payment confirmed for order ${order.id.slice(0, 8)}`,
      react: PaymentSuccessEmail({
        customerName,
        orderId: order.id,
        total,
        orderUrl,
      }),
    });
  } catch (error) {
    console.error("Payment success email failed:", error);
  }
}
