import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import QRCode from "qrcode";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { getRestaurant } from "@/lib/store";
import CopyButton from "./CopyButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ params }: { params: { id: string } }) {
  const restaurant = await getRestaurant(params.id);
  if (!restaurant) notFound();

  const h = headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const reviewUrl = `${proto}://${host}/r/${restaurant.id}`;

  const qrSvg = await QRCode.toString(reviewUrl, {
    type: "svg",
    margin: 1,
    width: 320,
    color: { dark: "#0a0a0a", light: "#ffffff" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-brand-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-600">
            Your QR is ready
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">{restaurant.name}</h1>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
          <div
            className="mx-auto w-fit rounded-2xl border-2 border-dashed border-neutral-200 p-4"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="mt-6 text-center text-sm text-neutral-500">
            Print this and place it on tables, the counter, or the back of bills.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`}
              download={`${restaurant.name.replace(/\s+/g, "-").toLowerCase()}-qr.svg`}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              <Download className="h-4 w-4" /> Download QR (SVG)
            </a>
            <a
              href={reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-300"
            >
              <ExternalLink className="h-4 w-4" /> Preview flow
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-neutral-700">Shareable link</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-neutral-50 px-3 py-2.5 text-sm text-neutral-700">
              {reviewUrl}
            </code>
            <CopyButton text={reviewUrl} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Min stars for Google" value={`${restaurant.minStarsForGoogle}+`} />
          <Stat label="Highlights" value={restaurant.features.length || "—"} />
          <Stat label="Status" value="Live" />
        </div>

        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">Important</p>
          <p className="mt-1">
            Google does not allow auto-submitting reviews. We generate the text and copy
            it to the customer&apos;s clipboard, then send them to your Google review
            page. They paste &amp; submit in one tap.
          </p>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}
