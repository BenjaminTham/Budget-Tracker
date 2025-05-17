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
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
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
const user = "User";

function SideNavbar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-[240px] z-50 bg-card border-r">
      <nav className="container flex flex-col items-center justify-center pt-4 px-8   h-screen  ">
        {/* <div className="flex flex-col h-full min-h-[60px] items-start gap-x-4 bg-green-600"> */}
        {/* <Logo /> */}
        {/* <div className="h-1/4"></div> */}
        <div className="flex flex-grow h-1/3  w-full justify-center">
          <p className="text-3xl font-bold">Hello, {user}</p>
        </div>
        <div className="flex flex-col h-1/3 justify-center gap-6 ">
          {items.map((item) => (
            <NavbarItem key={item.label} link={item.link} label={item.label} />
          ))}
        </div>
        {/* </div> */}
        <div className="flex flex-grow h-1/3 items-end pb-2 w-full justify-center ">
          <ThemeSwitcherBtn />
        </div>
        <div className="flex item-center gap-2"></div>
      </nav>
    </div>
  );
}

function NavbarItem({
  link,
  label,
  clickCallback,
}: {
  link: string;
  label: string;
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
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block"></div>
      )}
    </div>
  );
}
export default navbar;
