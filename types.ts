

export interface QuizAnswer {
  questionId: string;
  value: string;
}

export interface UserPreferences {
  answers: QuizAnswer[];
  transport: string;
  price: string;
  duration: string;
  timeOfDay: string;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}

export interface RecommendationResult {
  text: string;
  groundingLinks: { uri: string; title: string }[];
}

export enum TransportType {
  MRT = 'MRT',
  Bus = 'Bus',
  Walking = 'Walking',
  Car = 'Car'
}

export enum PriceRange {
  Budget = '$',
  Moderate = '$$',
  Luxury = '$$$'
}

export enum Duration {
  Short = '1-2h',
  Medium = '3-5h',
  FullDay = 'Full Day'
}

export enum TimeOfDay {
  Day = 'Daytime',
  Night = 'Nightlife',
  Any = 'Anytime'
}