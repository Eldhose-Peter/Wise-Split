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
        className={`block px-3 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
      >
        {children}
      </Link>
    </li>
  );
}
