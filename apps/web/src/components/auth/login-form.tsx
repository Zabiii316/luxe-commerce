"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm() {
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
      setMessage("Invalid admin credentials.");
      setIsSubmitting(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.22em] text-white/45">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field-input mt-3"
          placeholder="admin@luxecommerce.com"
          required
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.22em] text-white/45">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="field-input mt-3"
          placeholder="••••••••"
          required
        />
      </label>

      {message ? (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
