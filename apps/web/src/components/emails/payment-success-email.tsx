import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type PaymentSuccessEmailProps = {
  customerName: string;
  orderId: string;
  total: number;
  orderUrl: string;
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function PaymentSuccessEmail({
  customerName,
  orderId,
  total,
  orderUrl,
}: PaymentSuccessEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your payment has been confirmed.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>LUXECOMMERCE</Text>
          <Heading style={heading}>Payment confirmed.</Heading>

          <Text style={paragraph}>
            Hi {customerName}, your payment has been received successfully.
          </Text>

          <Section style={card}>
            <Text style={line}>Order ID: {orderId}</Text>
            <Text style={line}>Paid total: {money(total)}</Text>
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

const line = {
  color: "#181818",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 8px",
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
