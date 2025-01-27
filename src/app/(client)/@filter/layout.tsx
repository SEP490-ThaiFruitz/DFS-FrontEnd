import { Metadata } from "next";

interface LayoutFilterProps {
  children: React.ReactNode;
}

export async function generateMetadata() {
  return {
    title: "Trang chủ",
    description:
      "Thai Fruitz - Trang chủ nơi bạn có thể tìm thấy những sản phẩm organic tươi ngon nhất, giup bạn duy trì một lối sống lành mạnh.",
  };
}

const LayoutFilter = ({ children }: LayoutFilterProps) => {
  return <div className="p-10">{children}</div>;
};

export default LayoutFilter;
