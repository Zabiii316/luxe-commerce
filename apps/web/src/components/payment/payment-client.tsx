"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

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

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export function PaymentClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState<IntentStatus>({
    type: "loading",
    message: "Preparing secure payment...",
  });

  useEffect(() => {
    async function createIntent() {
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
        const response = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (!response.ok || !data.ok || !data.clientSecret) {
          setStatus({
            type: "error",
            message: data.message || "Unable to prepare payment.",
          });
          return;
        }

        setStatus({
          type: "ready",
          message: "Payment ready.",
          clientSecret: data.clientSecret,
        });
      } catch {
        setStatus({
          type: "error",
          message: "Unable to contact payment service.",
        });
      }
    }

    createIntent();
  }, [orderId]);

  const options = useMemo(
    () =>
      status.type === "ready"
        ? {
            clientSecret: status.clientSecret,
            appearance: {
              theme: "night" as const,
              variables: {
                colorPrimary: "#d6b46a",
                colorBackground: "#0d0b08",
                colorText: "#f8f2e8",
                colorDanger: "#ff8a8a",
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
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#d6b46a]" />
        </div>
      </PaymentShell>
    );
  }

  if (status.type === "error") {
    return (
      <PaymentShell title="Payment setup issue" message={status.message}>
        <Link
          href="/checkout"
          className="mt-8 inline-flex rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82]"
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
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82] disabled:cursor-not-allowed disabled:opacity-50"
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
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:p-12">
      <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">Stripe Checkout</p>

      <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-white md:text-7xl">
        {title}.
      </h1>

      <p className="mt-6 text-lg leading-8 text-white/60">{message}</p>

      {children}
    </div>
  );
}
