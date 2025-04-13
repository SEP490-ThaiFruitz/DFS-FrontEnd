import { CategoryTypes, Promotion } from "@/hooks/use-cart-store";

export type Certificate = {
  id: string;
  name: string;
  agency: string;
  issueDate: string;
  expiryDate: string;
  details: string;

  image: string;
};

export type Nutrition = {
  // [key: string]: string | number;

  nutrientName: string;
  amount: number;
  dailyValue: number;
  unit: string;
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
  productNutrition: {
    nutritionFacts: Nutrition[];
    ingredients: string;
    servingSize: number;
    calories: number;
  };
  productVariantDetail: ProductVariantTypes[];
  overallRatingResponse: OverallRate;
  productCertification: Certificate[];
  quantitySold?: number;
};

// "productNutrition": {
//   "nutritionFacts": [
//     {
//       "nutrientName": "Added sugars",
//       "amount": 1,
//       "dailyValue": 2,
//       "unit": "g"
//     },
//     {
//       "nutrientName": "Biotin",
//       "amount": 2,
//       "dailyValue": 7,
//       "unit": "mcg"
//     },
//     {
//       "nutrientName": "Tổng chất béo",
//       "amount": 12,
//       "dailyValue": 15,
//       "unit": "g"
//     },
//     {
//       "nutrientName": "Total carbohydrate",
//       "amount": 10,
//       "dailyValue": 4,
//       "unit": "g"
//     },
//     {
//       "nutrientName": "Pantothenic Acid",
//       "amount": 0,
//       "dailyValue": 0,
//       "unit": "mg"
//     }
//   ],
//   "ingredients": "Thanh long sấy giòn, Dầu hướng dương ép lạnh.",
//   "servingSize": 37,
//   "calories": 55
// },
