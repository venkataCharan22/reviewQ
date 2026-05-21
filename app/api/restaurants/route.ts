import { NextRequest, NextResponse } from "next/server";
import { createRestaurant } from "@/lib/store";
import { isPlausiblePlaceId } from "@/lib/google";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, placeId, features, ownerEmail, minStarsForGoogle } = body;

  if (!name || !placeId) {
    return NextResponse.json(
      { error: "name and placeId are required" },
      { status: 400 },
    );
  }

  const cleanPlaceId = String(placeId).trim();
  if (!isPlausiblePlaceId(cleanPlaceId)) {
    return NextResponse.json(
      { error: "placeId looks invalid. It should be the Google Place ID (e.g. ChIJ...)" },
      { status: 400 },
    );
  }

  const restaurant = await createRestaurant({
    name: String(name).trim(),
    placeId: cleanPlaceId,
    features: Array.isArray(features)
      ? features.map((f: unknown) => String(f).trim()).filter(Boolean)
      : [],
    ownerEmail: ownerEmail ? String(ownerEmail).trim() : undefined,
    minStarsForGoogle: Number.isFinite(Number(minStarsForGoogle))
      ? Math.min(5, Math.max(1, Number(minStarsForGoogle)))
      : 4,
  });

  return NextResponse.json(restaurant, { status: 201 });
}
