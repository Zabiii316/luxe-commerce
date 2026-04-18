"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatPrice } from "@/lib/utils/money";
import { useCartStore } from "@/lib/store/cart-store";
import {
  checkoutCustomerSchema,
  type CheckoutCustomerInput,
} from "@/lib/validators/checkout";

type OrderStatus =
  | {
      type: "idle";
      message: "";
    }
  | {
      type: "success" | "error";
      message: string;
    };

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const [status, setStatus] = useState<OrderStatus>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutCustomerInput>({
    resolver: zodResolver(checkoutCustomerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
  });

  async function onSubmit(customer: CheckoutCustomerInput) {
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          clientSubtotal: subtotal,
          lineItems: items.map((item) => ({
            sku: item.sku,
            quantity: item.quantity,
            clientUnitPrice: item.price,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setStatus({
          type: "error",
          message: data.message || "Order creation failed",
        });
        return;
      }

      clearCart();
      router.push(`/checkout/payment?orderId=${encodeURIComponent(data.order.id)}`);
    } catch {
      setStatus({
        type: "error",
        message: "Unable to create order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-10">
        <h1 className="text-4xl font-light text-white">Your cart is empty.</h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
          Add products to your private selection before continuing to checkout.
        </p>

        <Link
          href="/products"
          className="mt-8 inline-flex rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82]"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">Secure Checkout</p>

        <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] text-white md:text-6xl">
          Complete your details.
        </h1>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Field
            label="First name"
            error={errors.firstName?.message}
            inputProps={register("firstName")}
          />

          <Field
            label="Last name"
            error={errors.lastName?.message}
            inputProps={register("lastName")}
          />

          <Field
            label="Email address"
            error={errors.email?.message}
            inputProps={register("email")}
            className="md:col-span-2"
          />

          <Field
            label="Address"
            error={errors.address?.message}
            inputProps={register("address")}
            className="md:col-span-2"
          />

          <Field label="City" error={errors.city?.message} inputProps={register("city")} />

          <Field
            label="Country"
            error={errors.country?.message}
            inputProps={register("country")}
          />

          <Field
            label="Postal code"
            error={errors.postalCode?.message}
            inputProps={register("postalCode")}
            className="md:col-span-2"
          />
        </div>

        {status.type !== "idle" ? (
          <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-sm leading-6 text-red-200">
            {status.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating Secure Order..." : "Place Secure Order"}
        </button>
      </form>

      <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-28">
        <p className="text-sm uppercase tracking-[0.3em] text-[#d6b46a]">Order Summary</p>

        <div className="mt-8 space-y-5">
          {items.map((item) => (
            <div key={item.sku} className="border-b border-white/10 pb-5">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-white">{item.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/35">
                    Qty {item.quantity}
                  </p>
                </div>

                <p className="text-white/70">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-xl text-white">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <p className="mt-6 text-xs leading-6 text-white/40">
          The browser subtotal is submitted only for comparison. The server recomputes the
          authoritative total before creating the order.
        </p>
      </aside>
    </div>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  className?: string;
  inputProps: UseFormRegisterReturn;
};

function Field({ label, error, className = "", inputProps }: FieldProps) {
  return (
    <label className={className}>
      <span className="text-xs uppercase tracking-[0.22em] text-white/45">{label}</span>

      <input
        {...inputProps}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-[#d6b46a]"
      />

      {error ? <span className="mt-2 block text-sm text-red-300">{error}</span> : null}
    </label>
  );
}
