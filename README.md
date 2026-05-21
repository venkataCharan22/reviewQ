# ReviewQ

Turn happy diners into 5-star Google reviews. A QR-code-driven review collection app for restaurants.

**Live:** [reviewq-kohl.vercel.app](https://reviewq-kohl.vercel.app)

## How it works

1. A restaurant signs up at `/setup` with its name, Google Place ID, and a list of features it wants reviews to highlight (e.g. *biryani, ambience, service*).
2. The owner gets a printable QR code that customers scan from a table tent, bill, or counter.
3. The customer taps stars (1–5):
   - **4–5 stars** → they pick from auto-generated review templates that mention the restaurant's highlighted features, hit one button, and the text is copied to their clipboard while they're redirected to Google's "write a review" page for that exact business.
   - **1–3 stars** → they're sent to a private feedback form. The owner sees it, Google doesn't. This protects the restaurant's public rating while still surfacing real complaints internally.

The star threshold for sending to Google vs. private feedback is configurable per restaurant.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling, **Framer Motion** for the customer flow animations
- **Firestore** (via `firebase-admin`) for restaurant + feedback storage
- **qrcode** for SVG QR generation
- **Vercel** for hosting

## Local development

### Prerequisites

- Node 18+
- A Firebase project with Firestore enabled
- A Firebase Admin service account JSON ([download from Firebase Console](https://console.firebase.google.com/) → Project settings → Service accounts → Generate new private key)

### Setup

```bash
git clone https://github.com/venkataCharan22/reviewQ.git
cd reviewQ
npm install
```

Drop your Firebase service account key at `secrets/firebase-admin.json` (the path is gitignored). Or set `FIREBASE_SERVICE_ACCOUNT_JSON` as an env var with the JSON contents inline — useful for serverless deploys.

```bash
mkdir -p secrets
mv ~/Downloads/your-project-firebase-adminsdk-*.json secrets/firebase-admin.json
```

### Run

```bash
npm run dev
# http://localhost:3000
```

Visit `/setup` to create a restaurant, then `/dashboard/<id>` to see its QR code.

## Project layout

```
app/
  page.tsx                  Landing page
  setup/                    Restaurant signup form
  dashboard/[id]/           QR code + shareable link for an owner
  r/[id]/                   Customer-facing review flow
  api/
    restaurants/            Create + read restaurants
    feedback/               Submit private feedback
lib/
  firebase.ts               Admin SDK initialization
  store.ts                  Firestore data access
  templates.ts              Review text templates per star rating
  google.ts                 Google review URL builder
  types.ts                  Shared types
```

## Deployment

The app is hosted on Vercel. To deploy your own copy:

```bash
npm install -g vercel
vercel login
vercel
```

Then add the service account JSON as an environment variable named `FIREBASE_SERVICE_ACCOUNT_JSON` (either via `vercel env add` or the Vercel dashboard), and run `vercel --prod`.

## What this does NOT do

Google does not permit programmatic submission of reviews. Every legitimate review-collection service stops at the same point: pre-write the text, copy it to the clipboard, and redirect the customer to Google's own review form. The customer must tap the stars and paste the text themselves in Google's UI. There is no API or URL parameter to bypass this, and attempting browser automation violates Google's Terms of Service and risks delisting the business.

## License

MIT
