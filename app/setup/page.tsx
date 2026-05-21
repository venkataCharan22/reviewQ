"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QrCode, ArrowLeft, Loader2 } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [featuresText, setFeaturesText] = useState("biryani, service, ambience");
  const [minStarsForGoogle, setMinStarsForGoogle] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const features = featuresText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        placeId: placeId.trim(),
        features,
        ownerEmail: ownerEmail || undefined,
        minStarsForGoogle,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      setSubmitting(false);
      return;
    }

    const { id } = await res.json();
    router.push(`/dashboard/${id}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-brand-50">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-white">
            <QrCode className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Set up your restaurant</h1>
        </div>
        <p className="mt-2 text-neutral-600">
          Takes 30 seconds. You&apos;ll get a QR code to print on the next screen.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6 rounded-2xl bg-white p-8 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Restaurant name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pavithra Restaurant"
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Google Place ID
            </label>
            <input
              required
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 font-mono text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              Don&apos;t know yours? Find it on{" "}
              <a
                className="font-medium text-brand-600 underline"
                href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                target="_blank"
                rel="noreferrer"
              >
                Google&apos;s Place ID finder
              </a>{" "}
              — search your restaurant on the map, the ID appears below the pin.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              What should reviews highlight?
            </label>
            <input
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="biryani, ambience, service"
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              Comma-separated. These get woven into the auto-generated review text.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Send to Google when rating is at least
            </label>
            <div className="mt-2 flex gap-2">
              {[3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMinStarsForGoogle(n)}
                  className={`flex-1 rounded-xl border px-4 py-3 font-medium transition ${
                    minStarsForGoogle === n
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  {n}+ stars
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-neutral-500">
              Anything below this threshold goes to a private feedback form (only you see it).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Owner email <span className="text-neutral-400">(optional)</span>
            </label>
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="you@restaurant.com"
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-4 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Generate my QR code"}
          </button>
        </form>
      </div>
    </main>
  );
}
