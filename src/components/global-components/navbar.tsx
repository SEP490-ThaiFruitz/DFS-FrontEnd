import { Logo } from "./logo";
import Navigate from "./navigate";

export const Navbar = () => {
  return (
    <div className=" ">
      <div className="flex items-center   ">
        {/* <Logo height={60} width={60} /> */}
        <Navigate />
      </div>
    </div>
  );
};
