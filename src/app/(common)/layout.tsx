import { Navbar } from "@/components/global-components/navbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <Navbar /> */}

      <div className="bg-gradient-to-b from-amber-50 to-amber-50/60">
        {children}
      </div>
    </>
  );
};

export default CommonLayout;
