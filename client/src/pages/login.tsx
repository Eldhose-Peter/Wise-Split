// src/app/LoginRegister.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginRegister() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleToggle = () => setIsLogin(!isLogin); // Toggle between forms

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const endpoint = isLogin
      ? "http://localhost:3000/api/v1/auth/login"
      : "http://localhost:3000/api/v1/auth/register";
    const body = isLogin ? { email, password } : { username, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      console.log(response);

      if (response.ok) {
        router.push("/"); // Redirect to home on successful login or register
      } else {
        // Handle error (optional)
        alert(isLogin ? "Login failed" : "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex-grow flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold ">{isLogin ? "Login" : "Register"}</h1>
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border px-4 py-2 rounded text-gray-900 bg-white placeholder-gray-400"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-4 py-2 rounded text-gray-900 bg-white placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border px-4 py-2 rounded text-gray-900 bg-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isLogin ? "Login" : "Register"}
        </button>
        <button type="button" onClick={handleToggle} className="text-blue-500 hover:underline mt-2">
          {isLogin ? "Don't have an account? Register here" : "Already have an account? Login here"}
        </button>
      </form>
    </div>
  );
}
