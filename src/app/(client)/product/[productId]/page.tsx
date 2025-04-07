// import ProductDetail from "@/features/product-detail/product-detail";
import ProductDetail from "@/features/product-detail/content-parts/product-detail";
import { ProductDetailTypes } from "@/features/product-detail/product-detail.types";
import { Product } from "@/hooks/use-cart-store";
import { ApiResponse } from "@/types/types";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

export const revalidate = 30;

export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/Products`
  ).then((res) => res.json());

  return products.value.items.map((product: Product) => {
    return {
      productId: product.id,
    };
  });
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { productId } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/Products/${productId}`
  );

  if (!response.ok || response.status !== 200) {
    return notFound();
  }

  const productDetail: ApiResponse<ProductDetailTypes> = await response.json();

  return <ProductDetail product={productDetail.value as ProductDetailTypes} />;
};

export default ProductDetailPage;
