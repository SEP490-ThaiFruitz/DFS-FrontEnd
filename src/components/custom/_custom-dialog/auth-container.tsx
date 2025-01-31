import { useState } from "react";
import { LoginDialog } from "./login-dialog";
import { RegisterDialog } from "./register-dialog";

export const AuthContainer = () => {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-x-1 mr-8">
      {/* <NavbarLink href="#" onClick={() => {}}>
          <LogIn className="size-4 mr-1" /> Login
        </NavbarLink> */}
      {/* <NavbarLink href="#">Sign Up</NavbarLink> */}
      <LoginDialog />
      <RegisterDialog />
    </div>
  );
};
