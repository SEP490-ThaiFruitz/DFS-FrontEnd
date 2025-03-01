import { Footer } from "@/components/global-components/footer/footer";
import Navigate from "@/components/global-components/navigate";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {

  return (
    <>
      <Navigate />
      <>
        {children}
      </>
      <Footer />
    </>
  );
};

export default ClientLayout;
