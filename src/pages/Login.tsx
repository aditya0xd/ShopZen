import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const auth = useContext(AuthContext);

  const navigator = useNavigate();
  const [newUser, setNewUser] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const payload = { email, password };
    const API_URL =
      import.meta.env.VITE_API_URL ||
      "https://shopzen-backend-production.up.railway.app";

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("login user name", data.name);

      if (!res.ok) {
        setStatus(data.message);
        setNewUser(true);
        return;
      }

      if (!auth) {
        throw new Error("AuthContext must be used inside AuthProvider");
      }
      auth.login(data.accessToken, data.name);
      console.log("Login successful", data.accessToken);
      console.log("Form submitted");

      setStatus(data.message);
      setNewUser(false);
      setStatus("");

      navigator("/");
    } catch (err) {
      setStatus("Something went wrong");
      setNewUser(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Login
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
          >
            Submit
          </button>
        </form>

        {status && (
          <p
            className={`mt-4 text-center ${newUser ? "text-red-500" : "text-green-500"}`}
          >
            {status}
          </p>
        )}

        {newUser && (
          <p className="mt-2 text-center text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
