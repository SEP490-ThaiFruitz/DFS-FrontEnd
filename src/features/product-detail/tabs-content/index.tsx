"use client";

import { VercelTab } from "@/components/custom/_custom_tabs/vercel-tabs";
import { useState } from "react";
import { DetailTab } from "./detail-tab";
import { ProductDetailTypes } from "../product-detail.types";
import {
  FlaskConical,
  ListTree,
  LucideIcon,
  MessageCircleMore,
  ShieldCheck,
} from "lucide-react";
import { NutritionTab } from "./nutrition-tab";
import { CertificateTab } from "./certificate-tab";
import { ReviewsTab } from "./reviews-tab";

const TABS: {
  id: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    id: "detail",
    label: "Chi tiết",
    icon: ListTree,
  },

  {
    id: "nutrition",
    label: "Dinh dưỡng",
    icon: FlaskConical,
  },
  {
    id: "certificate",
    label: "Chứng nhận",
    icon: ShieldCheck,
  },
  {
    id: "reviews",
    label: "Đánh giá",
    icon: MessageCircleMore,
  },
];

interface TabContainerProps {
  product: ProductDetailTypes;
}
export const TabContainer = ({ product }: TabContainerProps) => {
  const [tab, setTab] = useState(TABS[0].id);

  console.log(tab);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      {/* vercel tab */}

      <VercelTab
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        classNameContent="text-slate-800 "
      />

      {tab === "detail" ? (
        <DetailTab
          product={{
            description: product.description,
            dryingMethod: product.dryingMethod,
            moistureContent: product.moistureContent,
          }}
        />
      ) : tab === "nutrition" ? (
        <NutritionTab nutritionalData={product.productNutrition as any} />
      ) : tab === "certificate" ? (
        <CertificateTab
          certificates={{
            productCertification: product.productCertification,
          }}
        />
      ) : (
        <ReviewsTab overallRatingResponse={product.overallRatingResponse} />
      )}
    </div>
  );
};
