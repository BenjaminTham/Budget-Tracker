import { PiggyBank } from "lucide-react";
import Image from "next/image";
import React from "react";
import logoImg from "../img/Logo.png";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 justify-center align-middle">
      {/* <PiggyBank className="stroke h-11 w-11 stroke-fuchsia-600 stroke-[1.5]" /> */}
      {/* <img src="../img/Logo.png" alt="Logo" /> */}
      <Image width={70} height={70} src={logoImg} alt="Logo"></Image>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex item-center gap-2">
      <p className="bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
    </a>
  );
}

export default Logo;
