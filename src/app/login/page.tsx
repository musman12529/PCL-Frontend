"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const { data: session, status: sessionStatus } = useSession();
  const [email, setEmail] = useState("testing@gmail.com");
  const [password, setPassword] = useState("testing@gmail.com");
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer); // Cleanup on component unmount or re-render
    }
  }, [showNotification]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      setLoading(false); // Reset loading
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      setLoading(false); // Reset loading
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    localStorage.setItem("email", email);

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false); // Reset loading
    } else {
      setError("");
      setLoading(false); // Reset loading
      if (res?.url) {
        router.replace("/");
      }
    }
  };

  if (sessionStatus === "loading" || loading) {
    // Show loading animation during authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        {showNotification && (
          <div className="fixed top-4 bg-green-500 text-white px-4 py-2 rounded shadow-md">
            Sample credentials are already entered.
          </div>
        )}
        <div className="bg-[#212121] p-8 rounded shadow-md w-96">
          <h1 className="text-4xl text-center font-semibold mb-8 text-white">
            Login
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={loading} // Disable button during loading
            >
              {loading ? "Signing In..." : "Sign In"} {/* Show different text */}
            </button>
            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
          </form>
          <div className="text-center text-gray-500 mt-4">- OR -</div>
          <Link
            className="block text-center text-blue-500 hover:underline mt-2"
            href="/register"
          >
            Register Here
          </Link>
        </div>
      </div>
    )
  );
};

export default Login;
