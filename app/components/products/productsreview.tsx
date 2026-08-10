"use client";

import { useEffect, useState } from "react";

type Review = {
  id: number;
  rating: number;
  comment: string;
  user: {
    name: string;
  };
};

type ProductReviewsProps = {
  productId: number;
};

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    try {
      const response = await fetch(
        `/api/products/${productId}/reviews`
      );

      const data = await response.json();

      if (response.ok) {
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("Please write a review.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            comment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to submit review.");
        return;
      }

      setReviews((previous) => [data, ...previous]);

      setRating(5);
      setComment("");

      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Review error:", error);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="mb-6 text-2xl font-bold">
        Customer Reviews
      </h2>

      {loading ? (
        <p className="text-gray-500">
          Loading reviews...
        </p>
      ) : reviews.length === 0 ? (
        <p className="mb-8 text-gray-500">
          No reviews yet.
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border p-4"
            >
              <h3 className="font-semibold">
                {review.user.name}
              </h3>

              <p className="text-yellow-500">
                {"⭐".repeat(review.rating)}
              </p>

              <p className="mt-2 text-gray-600">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-lg border p-6">
        <h3 className="mb-4 text-xl font-semibold">
          Write a Review
        </h3>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
            className="w-full rounded border p-3"
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
            <option value={4}>⭐⭐⭐⭐ (4)</option>
            <option value={3}>⭐⭐⭐ (3)</option>
            <option value={2}>⭐⭐ (2)</option>
            <option value={1}>⭐ (1)</option>
          </select>

          <textarea
            rows={4}
            placeholder="Write your review..."
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            className="w-full rounded border p-3"
          />

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </form>
      </div>
    </section>
  );
}