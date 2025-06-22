import Link from "next/link";
import { ReactNode } from "react";

interface NavItemProps {
  children: ReactNode;
  isActive?: boolean;
  href: string;
}

export default function NavItem({ href, isActive, children }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={`block px-3 py-2 rounded-md ${isActive ? "bg-sky-500 text-white" : "bg-slate-800"}`}
      >
        {children}
      </Link>
    </li>
  );
}
