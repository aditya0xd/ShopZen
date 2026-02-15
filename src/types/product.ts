export interface Product {
  id: string | number;
  title: string;
  description: string;
  price: number;
  image?: string;
  thumbnail: string;
  rating: number;
  discountPercentage?: number;
  stock?: number;
  availabilityStatus?: string;
  brand?: string;
  category?: string;
  images?: string[];
}
