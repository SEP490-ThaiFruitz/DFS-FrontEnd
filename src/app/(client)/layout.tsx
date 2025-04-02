import { Footer } from "@/components/global-components/footer/footer";
import Navigate from "@/components/global-components/navigate";
import React from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
  common: React.ReactNode;
}
export async function generateMetadata() {
  return {
    title: "Trang chủ",
    description:
      "Thai Fruitz - Trang chủ nơi bạn có thể tìm thấy những sản phẩm organic tươi ngon nhất, giup bạn duy trì một lối sống lành mạnh.",
  };
}
const ClientLayout = ({ children, common }: ClientLayoutProps) => {
  return (
    <>
      <Navigate />
      {/* <div className="bg-zinc-50"> */}
      <div className="bg-white">
        {/* <div> */}
        {children}

        {common}
      </div>
      <Footer />
    </>
  );
};

export default ClientLayout;
