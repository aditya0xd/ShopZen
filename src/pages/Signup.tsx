import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigator = useNavigate();
  const [isError, setIsError] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const age = Number(formData.get("age"));
    const city = formData.get("city") as string;

    const payload = { name, email, password, age, city };
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setStatus(data.message);
        return;
      }

      setIsError(false);
      setStatus(data.message);
      navigator("/login");
    } catch {
      setIsError(true);
      setStatus("Something went wrong");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Signup
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-1 text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              required
            />
          </div>

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
            className={`mt-4 text-center ${isError ? "text-red-500" : "text-green-500"}`}
          >
            {status}
          </p>
        )}

        {isError && (
          <p className="mt-2 text-center text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Signup;
