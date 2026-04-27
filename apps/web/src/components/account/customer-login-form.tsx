"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function CustomerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setMessage("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    window.location.href = "/account";
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field-input mt-3"
          required
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="field-input mt-3"
          required
        />
      </label>

      {message ? (
        <div className="rounded-2xl border border-red-300/40 bg-red-50 p-4 text-sm text-[#8e1023]">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>

      <p className="text-sm text-[#6b6b6b]">
        New here?{" "}
        <Link href="/account/register" className="text-[#b3132b] hover:text-[#8e1023]">
          Create an account
        </Link>
      </p>
    </form>
  );
}
