import { ViewCardProduct } from "@/components/global-components/card/view-card-product";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
const cartItems: Product[] = [
  {
    id: 1,
    name: "Dried Mango Slices",
    price: 12.99,
    quantity: 2,
    image: "/images/third-background.png",
  },
  {
    id: 2,
    name: "Mixed Dried Berries",
    price: 15.99,
    quantity: 1,
    image: "/images/third-background.png",
  },
  {
    id: 3,
    name: "Mixed Dried Berries",
    price: 15.99,
    quantity: 1,
    image: "/images/third-background.png",
  },
  {
    id: 4,
    name: "Mixed Dried Berries",
    price: 15.99,
    quantity: 1,
    image: "/images/third-background.png",
  },
  {
    id: 5,
    name: "Mixed Dried Berries",
    price: 15.99,
    quantity: 1,
    image: "/images/third-background.png",
  },
  {
    id: 6,
    name: "Mixed Dried Berries",
    price: 15.99,
    quantity: 1,
    image: "/images/third-background.png",
  },
  {
    id: 7,
    name: "Mixed Dried Berries",
    price: 15.99,
    quantity: 1,
    image: "/images/third-background.png",
  },
];
export const ProductList = () => {
  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <ViewCardProduct
          key={item.id}
          productName={item.name}
          productPrice={item.price}
          productQuantity={item.quantity}
          productImage={item.image}
        />
      ))}
    </div>
  );
};
