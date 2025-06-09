"use client";

import React, { useState } from "react";
import Logo, { LogoMobile } from "@/components/Logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { ThemeSwitcherBtn } from "./ThemeSwitcherBtn";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { MdHomeFilled } from "react-icons/md";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { div } from "three/src/nodes/TSL.js";

function navbar() {
  return (
    <>
      {/* <DesktopNavbar /> */}
      <SideNavbar />
      {/* <MobileNavbar /> */}
    </>
  );
}

const items = [
  { label: "Dashboard", link: "/", icon: <MdHomeFilled /> },
  {
    label: "Transactions",
    link: "/transactions",
    icon: <FaMoneyCheckDollar />,
  },
  { label: "Manage", link: "/manage", icon: <IoMdSettings /> },
  // { label: "Settings", link: "/wizard" },
];

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <LogoMobile />
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
        </div>
        <div className="flex item-center gap-2">
          <ThemeSwitcherBtn />
        </div>
      </nav>
    </div>
  );
}

function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="flex item-center gap-2">
          <ThemeSwitcherBtn />
        </div>
      </nav>
    </div>
  );
}

function SideNavbar() {
  return (
    <div
      className="fixed left-3 top-1/2 -translate-y-1/2 h-11/12 w-[75px] z-50 border-r rounded-2xl"
      style={{ backgroundColor: "#16425B" }}
    >
      <nav className="container flex flex-col items-center justify-start h-full w-full pt-5">
        <Logo />
        {items.map((item) => (
          <NavbarItem
            key={item.label}
            link={item.link}
            label={item.label}
            icon={item.icon}
            showLabel={false}
          />
        ))}
        {/* <ThemeSwitcherBtn /> */}
      </nav>
    </div>
  );
}

function NavbarItem({
  link,
  label,
  icon,
  showLabel = true,
  clickCallback,
}: {
  link: string;
  label: string;
  icon?: React.ReactNode; // Icon is optional
  showLabel?: boolean;
  clickCallback?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground mt-6",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {icon && <span>{icon}</span>}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block"></div>
      )}
    </div>
  );
}
export default navbar;
