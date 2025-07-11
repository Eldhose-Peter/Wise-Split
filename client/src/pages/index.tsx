import { AuthApi } from "@/api/authApi";
import { User } from "@/types/user.type";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const me = await AuthApi.fetchMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userLoading && user) {
      router.replace("/groups");
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Welcome to Wise-Split!
        </h1>
        <p className="text-lg mb-6 text-gray-700">
          Please log in to view your groups and manage expenses.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        Welcome to Wise-Split!
      </h1>
      <p className="text-lg mb-6 text-gray-700">
        You are logged in.{" "}
        <Link href="/groups" className="text-blue-500 underline">
          View your groups
        </Link>
        .
      </p>
    </div>
  );
}
