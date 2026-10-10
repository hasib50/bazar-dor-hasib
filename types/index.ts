export type Product = {
  id: string | number;
  name: string;
  slug: string;
  category: string;
  categoryName?: string;
  unit: string;
  price: number;
  change: number;
  icon: string;
  description?: string;
  markets?: MarketPrice[];
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
};

export type MarketPrice = {
  market: string;
  district?: string;
  min: number;
  max: number;
  avg: number;
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
};
