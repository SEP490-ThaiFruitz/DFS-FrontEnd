import { CategoryTypes, Promotion } from "@/hooks/use-cart-store";

export type Certificate = {
  id: string;
  name: string;
  agency: string;
  issueDate: string;
  expiryDate: string;
  details: string;
};

export type Nutrition = {
  [key: string]: string | number;
};

export type ProductVariantTypes = {
  productVariantId: string;
  image: string;
  netWeight: number;
  grossWeight: number;
  packagingLength: number;
  packagingWidth: number;
  packagingHeight: number;
  packagingVolume: number;
  shelfLife: number;
  price: number;
  stockQuantity?: number;
  reOrderPoint: number;
  packageType: string;
  promotion: Promotion | null;
};

export type OverallRate = {
  overallRating: number;
  quantityFeedback: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
};

export type ProductDetailTypes = {
  id: string;
  name: string;
  mainImageUrl: string;
  description: string;
  tags: string[];
  origin: string;
  moistureContent: number;
  dryingMethod: string;
  categories: CategoryTypes[];
  productImages: {
    imageUrl: string;
  }[];
  productNutrition: Nutrition | null;
  productVariantDetail: ProductVariantTypes[];
  overallRatingResponse: OverallRate;
  productCertification: Certificate[];
};
