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
    <div className="bg-gradient-to-b from-amber-50 to-amber-50/60">
      <Navigate />
      <div className="">
        {/* <div className="bg-[#fefcfb]"> */}
        {/* <div className="bg-white"> */}
        {/* <div> */}
        {children}

        {common}
      </div>
      <Footer />
    </div>
  );
};

export default ClientLayout;
