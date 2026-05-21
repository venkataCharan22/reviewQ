type TemplateContext = {
  name: string;
  features: string[];
};

function pickTwo(features: string[]): [string, string] {
  if (features.length === 0) return ["food", "service"];
  if (features.length === 1) return [features[0], "service"];
  const shuffled = [...features].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

const FIVE_STAR: ((ctx: TemplateContext) => string)[] = [
  ({ name, features }) => {
    const [a, b] = pickTwo(features);
    return `Absolutely loved my experience at ${name}! The ${a} was outstanding and the ${b} was on point. Easily one of the best spots in the area — will definitely be coming back. Highly recommend!`;
  },
  ({ name, features }) => {
    const [a, b] = pickTwo(features);
    return `${name} is a gem. From the moment we walked in, everything was perfect — ${a} was incredible, ${b} exceeded expectations. Staff was warm and attentive. 10/10 would recommend.`;
  },
  ({ name, features }) => {
    const [a] = pickTwo(features);
    return `Had a fantastic time at ${name}. The ${a} is genuinely some of the best I've had. Service was quick, the vibe was great, and it felt worth every rupee. Don't miss this place.`;
  },
  ({ name, features }) => {
    const [a, b] = pickTwo(features);
    return `Came in not expecting much and left blown away. ${name} nailed it — ${a} was rich and flavourful, and the ${b} made the whole experience. Already planning my next visit.`;
  },
];

const FOUR_STAR: ((ctx: TemplateContext) => string)[] = [
  ({ name, features }) => {
    const [a] = pickTwo(features);
    return `Had a really good time at ${name}. The ${a} was delicious and the staff was friendly. A few small things could be smoother but overall a solid spot — would come back.`;
  },
  ({ name, features }) => {
    const [a, b] = pickTwo(features);
    return `Enjoyed our visit to ${name}. ${a} was great, ${b} was good. Nice atmosphere and reasonable prices. Worth checking out if you're in the area.`;
  },
  ({ name, features }) => {
    const [a] = pickTwo(features);
    return `${name} is a good find. The ${a} stood out, and the place has a nice feel. Service was prompt. Not perfect but I'd happily recommend it to friends.`;
  },
];

export function generateReviews(stars: number, ctx: TemplateContext): string[] {
  const pool = stars >= 5 ? FIVE_STAR : FOUR_STAR;
  return pool.map((fn) => fn(ctx));
}
