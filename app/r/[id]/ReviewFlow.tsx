"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, RefreshCw, Copy, Heart, Loader2 } from "lucide-react";
import { generateReviews } from "@/lib/templates";
import { buildReviewUrl } from "@/lib/google";

type Props = {
  restaurant: {
    id: string;
    name: string;
    placeId: string;
    features: string[];
    minStarsForGoogle: number;
  };
};

type Step = "rate" | "pick" | "low" | "done";

export default function ReviewFlow({ restaurant }: Props) {
  const [step, setStep] = useState<Step>("rate");
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [regenKey, setRegenKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackContact, setFeedbackContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reviews = useMemo(
    () =>
      generateReviews(Math.max(stars, 4), {
        name: restaurant.name,
        features: restaurant.features,
      }),
    [stars, restaurant.name, restaurant.features, regenKey],
  );

  function onPickStars(n: number) {
    setStars(n);
    setTimeout(() => {
      if (n >= restaurant.minStarsForGoogle) {
        setStep("pick");
      } else {
        setStep("low");
      }
    }, 400);
  }

  async function onPostToGoogle() {
    if (!selectedReview) return;
    try {
      await navigator.clipboard.writeText(selectedReview);
      setCopied(true);
    } catch {
      // proceed anyway
    }
    setTimeout(() => {
      window.location.href = buildReviewUrl(restaurant.placeId);
    }, 700);
  }

  async function onSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    setSubmitting(true);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: restaurant.id,
        stars,
        message: feedbackMsg,
        contact: feedbackContact || undefined,
      }),
    });
    setSubmitting(false);
    setStep("done");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-amber-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-600">
            Welcome to
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{restaurant.name}</h1>
        </header>

        <div className="mt-12 flex-1">
          <AnimatePresence mode="wait">
            {step === "rate" && (
              <motion.div
                key="rate"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-center text-lg text-neutral-700">
                  How was your visit?
                </p>
                <div
                  className="mt-8 flex justify-center gap-2"
                  onMouseLeave={() => setHover(0)}
                >
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = n <= (hover || stars);
                    return (
                      <button
                        key={n}
                        onMouseEnter={() => setHover(n)}
                        onClick={() => onPickStars(n)}
                        className="transition-transform hover:scale-110 active:scale-95"
                        aria-label={`${n} stars`}
                      >
                        <Star
                          className={`h-14 w-14 transition ${
                            active
                              ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                              : "text-neutral-300"
                          }`}
                          strokeWidth={1.5}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="mt-10 text-center text-sm text-neutral-500">
                  Tap a star to begin
                </p>
              </motion.div>
            )}

            {step === "pick" && (
              <motion.div
                key="pick"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-6 w-6 ${
                        n <= stars
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-center font-medium text-neutral-700">
                  Pick a review you&apos;d like to post:
                </p>

                <div className="mt-6 space-y-3">
                  {reviews.map((text, i) => {
                    const isSelected = selectedReview === text;
                    return (
                      <motion.button
                        key={`${regenKey}-${i}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => setSelectedReview(text)}
                        className={`w-full rounded-2xl border-2 p-4 text-left text-sm leading-relaxed transition ${
                          isSelected
                            ? "border-brand-500 bg-brand-50 text-neutral-900"
                            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border-2 ${
                              isSelected
                                ? "border-brand-500 bg-brand-500"
                                : "border-neutral-300"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <p>{text}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setRegenKey((k) => k + 1);
                    setSelectedReview(null);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Show different options
                </button>

                <button
                  onClick={onPostToGoogle}
                  disabled={!selectedReview}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-4 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5" /> Copied — opening Google…
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" /> Copy &amp; post on Google
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-neutral-500">
                  We&apos;ll copy the text and open Google. Just paste &amp; post.
                </p>
              </motion.div>
            )}

            {step === "low" && (
              <motion.div
                key="low"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-6 w-6 ${
                        n <= stars
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <h2 className="mt-5 text-center text-xl font-semibold">
                  We&apos;d love to make this right.
                </h2>
                <p className="mt-2 text-center text-sm text-neutral-600">
                  Your feedback goes straight to the owner — not Google. Tell us what
                  happened so we can fix it.
                </p>

                <form onSubmit={onSubmitFeedback} className="mt-6 space-y-3">
                  <textarea
                    required
                    rows={5}
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                    placeholder="What could we have done better?"
                    className="w-full rounded-2xl border border-neutral-200 bg-white p-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  />
                  <input
                    value={feedbackContact}
                    onChange={(e) => setFeedbackContact(e.target.value)}
                    placeholder="Phone or email (optional)"
                    className="w-full rounded-2xl border border-neutral-200 bg-white p-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !feedbackMsg.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-4 font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Send feedback"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-brand-600 animate-pop">
                  <Heart className="h-10 w-10 fill-brand-500 text-brand-500" />
                </div>
                <h2 className="mt-6 text-2xl font-bold">Thank you!</h2>
                <p className="mt-2 max-w-xs text-neutral-600">
                  We&apos;ve passed your feedback to the team. We genuinely appreciate
                  you taking the time.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-10 text-center text-xs text-neutral-400">
          Powered by ReviewQ
        </footer>
      </div>
    </main>
  );
}
