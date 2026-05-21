import { NextRequest, NextResponse } from "next/server";
import { addFeedback, getRestaurant } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { restaurantId, stars, message, contact } = body;

  if (!restaurantId || !stars || !message) {
    return NextResponse.json(
      { error: "restaurantId, stars and message are required" },
      { status: 400 },
    );
  }

  const restaurant = await getRestaurant(String(restaurantId));
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  const feedback = await addFeedback({
    restaurantId: String(restaurantId),
    stars: Math.min(5, Math.max(1, Number(stars))),
    message: String(message).trim().slice(0, 2000),
    contact: contact ? String(contact).trim().slice(0, 200) : undefined,
  });

  return NextResponse.json(feedback, { status: 201 });
}
