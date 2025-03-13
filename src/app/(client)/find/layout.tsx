interface LayoutFindProps {
  children: React.ReactNode;
}

export async function generateMetadata() {
  return {
    title: "Tìm kiếm",
    description:
      "Thai Fruitz - Trang chủ nơi bạn có thể tìm thấy những sản phẩm organic tươi ngon nhất, giup bạn duy trì một lối sống lành mạnh.",
  };
}

const LayoutFind = ({ children }: LayoutFindProps) => {
  return <div className="p-10">{children}</div>;
};

export default LayoutFind;
