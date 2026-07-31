"use client";

import { useEffect, useState } from "react";

type Review = {
  name: string;
  rating: number;
  comment: string;
};

type ProductReviewsProps = {
  productId: number;
};

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`reviews-${productId}`);

    if (stored) {
      setReviews(JSON.parse(stored));
    }
  }, [productId]);

  const handleSubmit = () => {
    if (!name.trim() || !comment.trim()) {
      alert("Please fill all fields.");
      return;
    }

    const newReview: Review = {
      name,
      rating,
      comment,
    };

    const updatedReviews = [...reviews, newReview];

    setReviews(updatedReviews);

    localStorage.setItem(
      `reviews-${productId}`,
      JSON.stringify(updatedReviews)
    );

    setName("");
    setRating(5);
    setComment("");
  };

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-3xl font-bold">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="mb-8 text-gray-500">
          No reviews yet.
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="rounded-lg border p-4"
            >
              <h3 className="font-semibold">
                {review.name}
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

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full rounded border p-3"
        />

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mb-4 w-full rounded border p-3"
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
          onChange={(e) => setComment(e.target.value)}
          className="mb-4 w-full rounded border p-3"
        />

        <button
          onClick={handleSubmit}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Submit Review
        </button>
      </div>
    </section>
  );
}