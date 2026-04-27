"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { formatPrice } from "@/lib/utils/money";

type IntentStatus =
  | {
      type: "loading";
      message: string;
      clientSecret?: undefined;
    }
  | {
      type: "ready";
      message: string;
      clientSecret: string;
    }
  | {
      type: "error";
      message: string;
      clientSecret?: undefined;
    };

type OrderSummary = {
  id: string;
  subtotal: number;
  discountCode: string | null;
  discountAmount: number;
  total: number;
  currency: "USD";
  status: string;
};

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function getDisplayTotal(summary: OrderSummary) {
  if (summary.discountAmount > 0) {
    return summary.total;
  }

  return summary.total > 0 ? summary.total : summary.subtotal;
}

export function PaymentClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState<IntentStatus>({
    type: "loading",
    message: "Preparing secure payment...",
  });

  const [summary, setSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    async function preparePayment() {
      if (!orderId) {
        setStatus({
          type: "error",
          message: "Missing order ID. Please return to checkout.",
        });
        return;
      }

      if (!publishableKey) {
        setStatus({
          type: "error",
          message:
            "Stripe publishable key is missing. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to apps/web/.env.local",
        });
        return;
      }

      try {
        const [intentResponse, summaryResponse] = await Promise.all([
          fetch("/api/payments/create-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
          }),
          fetch(`/api/orders/${encodeURIComponent(orderId)}/summary`),
        ]);

        const intentData = await intentResponse.json();
        const summaryData = await summaryResponse.json();

        if (!intentResponse.ok || !intentData.ok || !intentData.clientSecret) {
          setStatus({
            type: "error",
            message: intentData.message || "Unable to prepare payment.",
          });
          return;
        }

        if (summaryResponse.ok && summaryData.ok && summaryData.order) {
          setSummary(summaryData.order);
        }

        setStatus({
          type: "ready",
          message: "Payment ready.",
          clientSecret: intentData.clientSecret,
        });
      } catch {
        setStatus({
          type: "error",
          message: "Unable to contact payment service.",
        });
      }
    }

    preparePayment();
  }, [orderId]);

  const options = useMemo(
    () =>
      status.type === "ready"
        ? {
            clientSecret: status.clientSecret,
            appearance: {
              theme: "stripe" as const,
              variables: {
                colorPrimary: "#b3132b",
                colorBackground: "#ffffff",
                colorText: "#181818",
                colorDanger: "#b3132b",
                borderRadius: "16px",
              },
            },
          }
        : undefined,
    [status],
  );

  if (status.type === "loading") {
    return (
      <PaymentShell title="Preparing payment" message={status.message}>
        <div className="h-2 overflow-hidden rounded-full bg-[#fcebed]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#b3132b]" />
        </div>
      </PaymentShell>
    );
  }

  if (status.type === "error") {
    return (
      <PaymentShell title="Payment setup issue" message={status.message}>
        <Link
          href="/checkout"
          className="mt-8 inline-flex rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
        >
          Back to Checkout
        </Link>
      </PaymentShell>
    );
  }

  return (
    <PaymentShell
      title="Secure payment"
      message="Complete payment using Stripe Payment Element. Card details are collected by Stripe, not LuxeCommerce."
    >
      {summary ? (
        <div className="mt-8 rounded-[2rem] border border-[#e9d8dc] bg-[#faf7f8] p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-[#b3132b]">Order Summary</p>

          <div className="mt-5 space-y-3 text-sm text-[#6b6b6b]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(summary.subtotal, summary.currency)}</span>
            </div>

            {summary.discountCode ? (
              <div className="flex justify-between">
                <span>Discount ({summary.discountCode})</span>
                <span>-{formatPrice(summary.discountAmount, summary.currency)}</span>
              </div>
            ) : null}

            <div className="flex justify-between border-t border-[#e9d8dc] pt-3 text-base text-[#181818]">
              <span>Total</span>
              <span>{formatPrice(getDisplayTotal(summary), summary.currency)}</span>
            </div>
          </div>
        </div>
      ) : null}

      <Elements stripe={stripePromise} options={options}>
        <StripePaymentForm orderId={orderId || ""} />
      </Elements>
    </PaymentShell>
  );
}

function StripePaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?orderId=${encodeURIComponent(
          orderId,
        )}`,
      },
    });

    if (result.error) {
      setErrorMessage(result.error.message || "Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <PaymentElement />

      {errorMessage ? (
        <div className="rounded-2xl border border-red-300/40 bg-red-50 p-5 text-sm text-[#8e1023]">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Processing Payment..." : "Pay Securely"}
      </button>
    </form>
  );
}

function PaymentShell({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-[#e9d8dc] bg-white p-8 shadow-[0_18px_50px_rgba(179,19,43,0.06)] md:p-12">
      <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">Stripe Checkout</p>

      <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-[#181818] md:text-7xl">
        {title}.
      </h1>

      <p className="mt-6 text-lg leading-8 text-[#6b6b6b]">{message}</p>

      {children}
    </div>
  );
}
