import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;

function loadServiceAccount() {
  const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inlineJson) {
    return JSON.parse(inlineJson);
  }

  const filePath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(process.cwd(), "secrets", "firebase-admin.json");

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Firebase service account not found. Expected at ${filePath}. ` +
        `Download it from Firebase Console → Project settings → Service accounts → Generate new private key.`,
    );
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getDb(): Firestore {
  if (cachedDb) return cachedDb;

  if (!cachedApp) {
    const existing = getApps();
    if (existing.length > 0) {
      cachedApp = existing[0];
    } else {
      const serviceAccount = loadServiceAccount();
      cachedApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    }
  }

  cachedDb = getFirestore(cachedApp);
  return cachedDb;
}

export function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}
