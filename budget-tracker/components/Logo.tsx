import { PiggyBank } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <a href="/" className="flex item-center gap-2">
      <PiggyBank className="stroke h-11 w-11 stroke-fuchsia-600 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
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
