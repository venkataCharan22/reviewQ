import { NextRequest, NextResponse } from "next/server";
import { getRestaurant } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const restaurant = await getRestaurant(params.id);
  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(restaurant);
}
