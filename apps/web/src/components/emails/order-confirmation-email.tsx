import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type OrderConfirmationEmailProps = {
  customerName: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  discountCode?: string | null;
  discountAmount: number;
  total: number;
  orderUrl: string;
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function getDisplayTotal(total: number, subtotal: number, discountAmount: number) {
  if (discountAmount > 0) return total;
  return total > 0 ? total : subtotal;
}

export function OrderConfirmationEmail({
  customerName,
  orderId,
  items,
  subtotal,
  discountCode,
  discountAmount,
  total,
  orderUrl,
}: OrderConfirmationEmailProps) {
  const displayTotal = getDisplayTotal(total, subtotal, discountAmount);

  return (
    <Html>
      <Head />
      <Preview>Your LuxeCommerce order has been received.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>LUXECOMMERCE</Text>
          <Heading style={heading}>Your order is in.</Heading>

          <Text style={paragraph}>
            Hi {customerName}, we’ve received your order and started processing it.
          </Text>

          <Section style={card}>
            <Text style={label}>Order ID</Text>
            <Text style={value}>{orderId}</Text>
          </Section>

          <Section style={card}>
            <Text style={label}>Items</Text>
            {items.map((item, index) => (
              <Text key={`${item.name}-${index}`} style={listItem}>
                {item.name} × {item.quantity} — {money(item.lineTotal)}
              </Text>
            ))}
          </Section>

          <Section style={card}>
            <Text style={row}>
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </Text>

            {discountCode ? (
              <Text style={row}>
                <span>Discount ({discountCode})</span>
                <span>-{money(discountAmount)}</span>
              </Text>
            ) : null}

            <Hr style={hr} />

            <Text style={totalRow}>
              <span>Total</span>
              <span>{money(displayTotal)}</span>
            </Text>
          </Section>

          <Button href={orderUrl} style={button}>
            View your order
          </Button>

          <Text style={footer}>
            Thank you for shopping with LuxeCommerce.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#faf7f8",
  fontFamily: "Arial, sans-serif",
  padding: "32px 0",
};

const container = {
  maxWidth: "620px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  border: "1px solid #e9d8dc",
  borderRadius: "24px",
  padding: "32px",
};

const eyebrow = {
  color: "#b3132b",
  fontSize: "12px",
  letterSpacing: "0.35em",
  textTransform: "uppercase" as const,
  margin: "0 0 12px",
};

const heading = {
  color: "#181818",
  fontSize: "36px",
  fontWeight: "300",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#6b6b6b",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 24px",
};

const card = {
  border: "1px solid #e9d8dc",
  borderRadius: "18px",
  backgroundColor: "#faf7f8",
  padding: "18px",
  marginBottom: "16px",
};

const label = {
  color: "#6b6b6b",
  fontSize: "12px",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  margin: "0 0 8px",
};

const value = {
  color: "#181818",
  fontSize: "14px",
  margin: "0",
  wordBreak: "break-word" as const,
};

const listItem = {
  color: "#181818",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 8px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  color: "#6b6b6b",
  fontSize: "14px",
  margin: "0 0 8px",
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  color: "#181818",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
};

const hr = {
  borderColor: "#e9d8dc",
  margin: "12px 0",
};

const button = {
  display: "inline-block",
  backgroundColor: "#b3132b",
  color: "#ffffff",
  textDecoration: "none",
  padding: "14px 24px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  marginTop: "8px",
};

const footer = {
  color: "#6b6b6b",
  fontSize: "13px",
  marginTop: "24px",
};
