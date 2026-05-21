import { notFound } from "next/navigation";
import { getRestaurant } from "@/lib/store";
import ReviewFlow from "./ReviewFlow";

export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const restaurant = await getRestaurant(params.id);
  if (!restaurant) notFound();

  return (
    <ReviewFlow
      restaurant={{
        id: restaurant.id,
        name: restaurant.name,
        placeId: restaurant.placeId,
        features: restaurant.features,
        minStarsForGoogle: restaurant.minStarsForGoogle,
      }}
    />
  );
}
