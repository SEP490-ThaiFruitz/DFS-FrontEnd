import { Footer } from "@/components/global-components/footer/footer";
import Navigate from "@/components/global-components/navigate";

interface ClientLayoutProps {
  children: React.ReactNode;
  filter: React.ReactNode;
  test2: React.ReactNode;
}

const ClientLayout = ({ children, filter, test2 }: ClientLayoutProps) => {

  return (
    <>
      <Navigate />
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
