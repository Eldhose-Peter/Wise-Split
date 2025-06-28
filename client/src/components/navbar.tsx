import { useRouter } from "next/router";
import NavItem from "./navItem";
import { useEffect, useState } from "react";
import { AuthApi } from "../api/authApi";

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await AuthApi.fetchMe();
        setUsername(data.userName); // Assuming the response has a userName field
      } catch {
        setUsername(null);
      }
    };
    fetchUser();
  }, [router]);

  const handleLoginClick = () => {
    router.push("/login"); // Navigate to the login page
  };

  const handleLogout = async () => {
    try {
      await AuthApi.logout();
      setUsername(null); // Clear username on successful logout
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="py-4 px-6 text-sm font-medium bg-slate-800 flex justify-between items-center">
      <ul className="flex space-x-3">
        <NavItem href="/" isActive={router.pathname === "/"}>
          Home
        </NavItem>
        <NavItem href="/about" isActive={router.pathname === "/about"}>
          About
        </NavItem>
      </ul>
      <div className="flex items-center">
        {username ? (
          <>
            <span className="text-white">{username}</span>
            <button
              onClick={handleLogout}
              className="ml-4 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
