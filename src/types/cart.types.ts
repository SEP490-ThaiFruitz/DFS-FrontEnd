export type CartProductTypes = {
  cartItemId: string;
  productId: string;
  name: string;
  image: string;
  type: string;
  productVariant: {
    productVariantId: string;
    price: number;
    originalPrice: number;
    percentage: number;
    isDiscount: boolean;
    stockQuantity: number;
  };
  combo: null | any;
  quantity: number;
};
