import { Navbar } from "@/components/global-components/navbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="pt-20">{children}</div>
    </>
  );
};

export default CommonLayout;
