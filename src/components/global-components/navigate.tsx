"use client";

import { cn } from "@/lib/utils";
import { useState, type ComponentProps } from "react";
import { Logo } from "./logo";
import { LogIn, MenuIcon } from "lucide-react";
import { LoginDialog } from "../custom/_custom-dialog/login-dialog";
import { RegisterDialog } from "../custom/_custom-dialog/register-dialog";
import { ShoppingBagSheet } from "../custom/_custom-sheet/shopping-bag-sheet";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/navbar-menu";

export const Navigate = () => {
  const [active, setActive] = useState<string | null>(null);

  const styleClassName =
    "relative inline-flex text-sm h-11 w-28 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer";

  return (
    // <NavbarContainer className="w-full rounded-none list-none flex items-center justify-between">
    //   {/* <div className="flex items-center justify-between "> */}
    //   <div className="flex items-center gap-x-1  ">
    //     <div className="pl-4">
    //       <Logo height={70} width={70} />
    //     </div>
    //     <NavbarLink href="#">Icons</NavbarLink>
    //     <NavbarLink href="#">App</NavbarLink>
    //     <NavbarLink href="#">Pricing</NavbarLink>
    //     <NavbarLink href="#" isHighlighted={true}>
    //       Buy Icons
    //     </NavbarLink>
    //   </div>
    //   <div className="flex items-center gap-x-1 mr-8">
    //     {/* <NavbarLink href="#" onClick={() => {}}>
    //       <LogIn className="size-4 mr-1" /> Login
    //     </NavbarLink> */}
    //     {/* <NavbarLink href="#">Sign Up</NavbarLink> */}
    //     <LoginDialog />
    //     <RegisterDialog />
    //     <ShoppingBagSheet />
    //   </div>

    //   {/* </div> */}
    // </NavbarContainer>

    <div
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 w-full",
        "w-full rounded-none list-none  "
      )}
    >
      <Menu
        setActive={setActive}
        className="h-full flex items-center justify-between w-full rounded-none "
      >
        <div className="pl-4 py-4">
          <Logo height={60} width={60} />
        </div>

        <div>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Services"
            className={styleClassName}
          >
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/web-dev">Web Development</HoveredLink>
              <HoveredLink href="/interface-design">
                Interface Design
              </HoveredLink>
              <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
              <HoveredLink href="/branding">Branding</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Products"
            className={styleClassName}
          >
            <div className="  text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="Algochurn"
                href="https://algochurn.com"
                src="https://assets.aceternity.com/demos/algochurn.webp"
                description="Prepare for tech interviews like never before."
              />
              <ProductItem
                title="Tailwind Master Kit"
                href="https://tailwindmasterkit.com"
                src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                description="Production ready Tailwind css components for your next project"
              />
              <ProductItem
                title="Moonbeam"
                href="https://gomoonbeam.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
                description="Never write from scratch again. Go from idea to blog in minutes."
              />
              <ProductItem
                title="Rogue"
                href="https://userogue.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
                description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
              />
            </div>
          </MenuItem>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Pricing"
            className={styleClassName}
          >
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/hobby">Hobby</HoveredLink>
              <HoveredLink href="/individual">Individual</HoveredLink>
              <HoveredLink href="/team">Team</HoveredLink>
              <HoveredLink href="/enterprise">Enterprise</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem
            setActive={setActive}
            active={active}
            item="Control"
            className={styleClassName}
          >
            <div className="flex items-center gap-x-1 mr-8">
              {/* <NavbarLink href="#" onClick={() => {}}>
         <LogIn className="size-4 mr-1" /> Login
       </NavbarLink> */}
              {/* <NavbarLink href="#">Sign Up</NavbarLink> */}
              <LoginDialog />
              <RegisterDialog />
              <ShoppingBagSheet />
            </div>
          </MenuItem>
        </div>

        <div />
      </Menu>
    </div>
  );
};

export default Navigate;

export const NavbarContainer = ({
  children,
  className,
  ...props
}: ComponentProps<"nav">) => {
  return (
    <nav
      className={cn(
        "flex w-fit backdrop-blur-md bg-neutral-100/50 dark:bg-neutral-800/50 rounded-2xl shadow-xl shadow-black/5 p-px relative border border-neutral-400/10",
        className
      )}
      {...props}
    >
      {/* <ul className="gap-2 flex w-fit items-center justify-between"> */}
      {children}
      {/* </ul> */}
    </nav>
  );
};

export const NavbarLink = ({
  children,
  href,
  isHighlighted,
  ...props
}: {
  isHighlighted?: boolean;
} & ComponentProps<"a">) => {
  return (
    <li>
      <a
        href={href}
        className={cn(
          "relative inline-flex text-sm h-11 w-28 tracking-tight items-center justify-center",
          isHighlighted
            ? "text-white bg-gradient-to-b from-violet-500 to-violet-600 rounded-[14px] hover:from-violet-500/80 hover:to-violet-600/80 shadow-md transition-all hover:scale-105"
            : "text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px]"
        )}
        {...props}
      >
        {children}
      </a>
    </li>
  );
};
