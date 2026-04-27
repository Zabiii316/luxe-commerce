"use client";

import { useMemo, useState } from "react";
import type { ProductReview } from "@/lib/data/reviews";

type ProductReviewsProps = {
  productSlug: string;
  initialReviews: ProductReview[];
};

export function ProductReviews({ productSlug, initialReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = useMemo(() => {
    if (!reviews.length) {
      return 0;
    }

    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [reviews]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${encodeURIComponent(productSlug)}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          rating,
          title,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok || !data.review) {
        setMessage(data.message || "Unable to submit review.");
        return;
      }

      setReviews((current) => [data.review, ...current]);
      setName("");
      setEmail("");
      setRating(5);
      setTitle("");
      setComment("");
      setMessage("Review submitted successfully.");
    } catch {
      setMessage("Unable to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)] md:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">Customer Reviews</p>
        <h2 className="mt-4 text-4xl font-light text-[#181818] md:text-5xl">
          Shared product experience.
        </h2>

        <div className="mt-8 flex items-end gap-4">
          <p className="text-5xl font-light text-[#181818]">
            {reviews.length ? averageRating.toFixed(1) : "—"}
          </p>
          <div className="pb-1">
            <p className="text-sm uppercase tracking-[0.22em] text-[#b3132b]">
              {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-sm text-[#6b6b6b]">
              Verified product impressions from your storefront.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="field-input"
                required
              />
            </Field>

            <Field label="Email">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field-input"
                type="email"
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-[180px_1fr]">
            <Field label="Rating">
              <select
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="field-input"
              >
                <option value={5}>5 stars</option>
                <option value={4}>4 stars</option>
                <option value={3}>3 stars</option>
                <option value={2}>2 stars</option>
                <option value={1}>1 star</option>
              </select>
            </Field>

            <Field label="Review title">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="field-input"
                required
              />
            </Field>
          </div>

          <Field label="Review">
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="field-input min-h-36"
              required
            />
          </Field>

          {message ? (
            <div className="rounded-2xl border border-[#e9d8dc] bg-[#faf7f8] p-4 text-sm text-[#181818]">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-8 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
            <h3 className="text-2xl font-light text-[#181818]">No reviews yet.</h3>
            <p className="mt-3 text-sm leading-7 text-[#6b6b6b]">
              Be the first to share your thoughts on this product.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg text-[#181818]">{review.title}</p>
                  <p className="mt-1 text-sm text-[#6b6b6b]">{review.name}</p>
                </div>

                <div className="text-sm uppercase tracking-[0.18em] text-[#b3132b]">
                  {"★".repeat(review.rating)}
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-[#6b6b6b]">{review.comment}</p>

              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}
