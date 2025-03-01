import { Footer } from "@/components/global-components/footer/footer";
import Navigate from "@/components/global-components/navigate";
import React from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
  filter: React.ReactNode;
  common: React.ReactNode;
}

const ClientLayout = ({ children, filter, common }: ClientLayoutProps) => {
  return (
    <>
      <Navigate />
      <>
        {children}

        {filter}

        {common}
      </>
      <Footer />
    </>
  );
};

export default ClientLayout;
