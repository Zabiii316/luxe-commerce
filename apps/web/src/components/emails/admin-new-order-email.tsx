import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type AdminNewOrderEmailProps = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  subtotal: number;
  discountCode?: string | null;
  discountAmount: number;
  total: number;
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

export function AdminNewOrderEmail({
  orderId,
  customerName,
  customerEmail,
  itemsCount,
  subtotal,
  discountCode,
  discountAmount,
  total,
}: AdminNewOrderEmailProps) {
  const displayTotal = getDisplayTotal(total, subtotal, discountAmount);

  return (
    <Html>
      <Head />
      <Preview>New LuxeCommerce order received.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>ADMIN ALERT</Text>
          <Heading style={heading}>New order received.</Heading>

          <Section style={card}>
            <Text style={line}>Order ID: {orderId}</Text>
            <Text style={line}>Customer: {customerName}</Text>
            <Text style={line}>Email: {customerEmail}</Text>
            <Text style={line}>Items: {itemsCount}</Text>
            <Text style={line}>Subtotal: {money(subtotal)}</Text>
            <Text style={line}>
              Discount: {discountCode ? `${discountCode} (-${money(discountAmount)})` : "—"}
            </Text>
            <Text style={line}>Total: {money(displayTotal)}</Text>
          </Section>
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
  fontSize: "32px",
  fontWeight: "300",
  margin: "0 0 20px",
};

const card = {
  border: "1px solid #e9d8dc",
  borderRadius: "18px",
  backgroundColor: "#faf7f8",
  padding: "18px",
};

const line = {
  color: "#181818",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 8px",
};
