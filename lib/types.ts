export type Restaurant = {
  id: string;
  name: string;
  placeId: string;
  features: string[];
  ownerEmail?: string;
  minStarsForGoogle: number;
  createdAt: string;
};

export type Feedback = {
  id: string;
  restaurantId: string;
  stars: number;
  message: string;
  contact?: string;
  createdAt: string;
};
