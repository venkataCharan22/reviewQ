import { nanoid } from "nanoid";
import { getDb, stripUndefined } from "./firebase";
import type { Restaurant, Feedback } from "./types";

const RESTAURANTS = "restaurants";
const FEEDBACK = "feedback";

export async function getRestaurant(id: string): Promise<Restaurant | null> {
  const snap = await getDb().collection(RESTAURANTS).doc(id).get();
  if (!snap.exists) return null;
  return snap.data() as Restaurant;
}

export async function createRestaurant(
  input: Omit<Restaurant, "id" | "createdAt">,
): Promise<Restaurant> {
  const restaurant: Restaurant = {
    ...input,
    id: nanoid(10),
    createdAt: new Date().toISOString(),
  };
  await getDb().collection(RESTAURANTS).doc(restaurant.id).set(stripUndefined(restaurant));
  return restaurant;
}

export async function addFeedback(
  input: Omit<Feedback, "id" | "createdAt">,
): Promise<Feedback> {
  const feedback: Feedback = {
    ...input,
    id: nanoid(10),
    createdAt: new Date().toISOString(),
  };
  await getDb().collection(FEEDBACK).doc(feedback.id).set(stripUndefined(feedback));
  return feedback;
}

export async function listFeedbackFor(restaurantId: string): Promise<Feedback[]> {
  const snap = await getDb()
    .collection(FEEDBACK)
    .where("restaurantId", "==", restaurantId)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => d.data() as Feedback);
}
