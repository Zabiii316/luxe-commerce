"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function CustomerRegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setMessage(data.message || "Unable to create account.");
        setIsSubmitting(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        setMessage("Account created, but automatic sign-in failed.");
        setIsSubmitting(false);
        return;
      }

      window.location.href = "/account";
    } catch {
      setMessage("Unable to create account.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">First name</span>
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="field-input mt-3"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Last name</span>
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="field-input mt-3"
            required
          />
        </label>
      </div>

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
          minLength={8}
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
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>

      <p className="text-sm text-[#6b6b6b]">
        Already have an account?{" "}
        <Link href="/account/login" className="text-[#b3132b] hover:text-[#8e1023]">
          Sign in
        </Link>
      </p>
    </form>
  );
}
