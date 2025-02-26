import { Footer } from "@/components/global-components/footer/footer";
import { Logo } from "@/components/global-components/logo";
import { Navbar } from "@/components/global-components/navbar";
import Navigate from "@/components/global-components/navigate";

interface ClientLayoutProps {
  children: React.ReactNode;
  filter: React.ReactNode;
  test2: React.ReactNode;
}

const ClientLayout = ({ children, filter, test2 }: ClientLayoutProps) => {
  return (
    <>
      <Navbar />
      <>
        {children}

        <div>{filter}</div>
        <div>{test2}</div>
      </>
      <Footer />
    </>
  );
};

export default ClientLayout;
