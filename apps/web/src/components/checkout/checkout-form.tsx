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
  | { type: "idle"; message: "" }
  | { type: "success" | "error"; message: string };

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const [couponCode, setCouponCode] = useState("");
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
          couponCode,
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
      <div className="rounded-[2rem] border border-[#e9d8dc] bg-[#faf7f8] p-10">
        <h1 className="text-4xl font-light text-[#181818]">Your cart is empty.</h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#6b6b6b]">
          Add products to your private selection before continuing to checkout.
        </p>

        <Link
          href="/products"
          className="mt-8 inline-flex rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
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
        className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_18px_50px_rgba(179,19,43,0.06)] md:p-8"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">Secure Checkout</p>

        <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] text-[#181818] md:text-6xl">
          Complete your details.
        </h1>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Field label="First name" error={errors.firstName?.message} inputProps={register("firstName")} />
          <Field label="Last name" error={errors.lastName?.message} inputProps={register("lastName")} />

          <Field label="Email address" error={errors.email?.message} inputProps={register("email")} className="md:col-span-2" />
          <Field label="Address" error={errors.address?.message} inputProps={register("address")} className="md:col-span-2" />
          <Field label="City" error={errors.city?.message} inputProps={register("city")} />
          <Field label="Country" error={errors.country?.message} inputProps={register("country")} />
          <Field label="Postal code" error={errors.postalCode?.message} inputProps={register("postalCode")} className="md:col-span-2" />

          <label className="md:col-span-2">
            <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Discount code</span>
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              className="field-input mt-3"
              placeholder="WELCOME10"
            />
          </label>
        </div>

        {status.type !== "idle" ? (
          <div className="mt-8 rounded-2xl border border-red-300/40 bg-red-50 p-5 text-sm leading-6 text-[#8e1023]">
            {status.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating Secure Order..." : "Place Secure Order"}
        </button>
      </form>

      <aside className="h-fit rounded-[2rem] border border-[#e9d8dc] bg-[#faf7f8] p-6 lg:sticky lg:top-28">
        <p className="text-sm uppercase tracking-[0.3em] text-[#b3132b]">Order Summary</p>

        <div className="mt-8 space-y-5">
          {items.map((item) => (
            <div key={item.sku} className="border-b border-[#e9d8dc] pb-5">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-[#181818]">{item.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                    Qty {item.quantity}
                  </p>
                </div>

                <p className="text-[#181818]">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-xl text-[#181818]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <p className="mt-6 text-xs leading-6 text-[#6b6b6b]">
          Discount codes are validated on the server when the order is created.
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
      <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">{label}</span>
      <input {...inputProps} className="field-input mt-3" />
      {error ? <span className="mt-2 block text-sm text-[#b3132b]">{error}</span> : null}
    </label>
  );
}
