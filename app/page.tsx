import Link from "next/link";
import { QrCode, Star, Sparkles, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-brand-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
              <QrCode className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">ReviewQ</span>
          </div>
          <Link
            href="/setup"
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Get your QR
          </Link>
        </nav>

        <section className="mt-20 grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
              <Sparkles className="h-3.5 w-3.5" /> Built for Indian restaurants
            </div>
            <h1 className="mt-5 text-5xl font-bold tracking-tight text-neutral-900 md:text-6xl">
              Turn happy diners into <span className="text-brand-500">5-star reviews.</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-600">
              Print a QR code. Customers scan, pick stars, and post a polished Google
              review in 10 seconds. Low ratings stay private so you can fix them first.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href="/setup"
                className="rounded-full bg-brand-500 px-6 py-3 font-medium text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600"
              >
                Set up your restaurant
              </Link>
              <a
                href="#how"
                className="rounded-full border border-neutral-200 bg-white px-6 py-3 font-medium text-neutral-700 hover:border-neutral-300"
              >
                How it works
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-neutral-200">
              <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white">
                <p className="text-sm opacity-80">How was your visit?</p>
                <p className="mt-1 text-xl font-semibold">Pavithra Restaurant</p>
                <div className="mt-6 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-9 w-9 ${i <= 5 ? "fill-yellow-300 text-yellow-300" : "text-white/30"}`}
                    />
                  ))}
                </div>
                <p className="mt-6 rounded-xl bg-white/15 p-3 text-sm leading-relaxed">
                  Absolutely loved my experience! The biryani was outstanding and the
                  service was on point. Highly recommend!
                </p>
                <button className="mt-4 w-full rounded-xl bg-white py-3 font-medium text-brand-700">
                  Post to Google →
                </button>
              </div>
            </div>
            <div className="absolute -right-6 -top-6 rotate-12 rounded-2xl bg-white p-3 shadow-xl">
              <QrCode className="h-16 w-16 text-neutral-900" />
            </div>
          </div>
        </section>

        <section id="how" className="mt-32">
          <h2 className="text-center text-3xl font-bold tracking-tight">How it works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: QrCode,
                title: "1. Print your QR",
                body: "Sign up in 30 seconds, get a QR code to put on tables, bills, or the door.",
              },
              {
                icon: Star,
                title: "2. Customer rates",
                body: "They scan, tap stars. We pick the right path based on how they felt.",
              },
              {
                icon: ShieldCheck,
                title: "3. Reviews where they belong",
                body: "Happy → Google with one tap. Unhappy → private feedback to you.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-neutral-100 bg-white p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-32 border-t border-neutral-100 pt-8 text-center text-sm text-neutral-500">
          ReviewQ · Built for restaurants that care about every guest.
        </footer>
      </div>
    </main>
  );
}
