"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // This path should work correctly
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Good practice to clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/chatbot"); // We will create this page next
    } catch (err) {
      console.error("Login Error:", err); // Log the actual error for debugging
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex w-4/5 h-[70vh] rounded-xl overflow-hidden border-[3px] border-[#1a1a2e] shadow-lg">
        {/* Left */}
        <div className="w-1/2 bg-[#1a1a2e] text-white flex flex-col justify-center items-center px-8 text-center">
          <Image src="/logo.png" alt="CaseMate Logo" width={150} height={150} className="mb-6" />
          <h1 className="text-3xl mb-2 font-semibold">Welcome to CaseMate</h1>
          <p className="text-base leading-relaxed">
            Your AI-powered legal assistant for instant legal insights and document analysis.
          </p>
        </div>

        {/* Right */}
        <div className="w-1/2 bg-white flex flex-col justify-center items-center px-10">
          <h2 className="text-2xl text-[#1a1a2e] font-semibold mb-5">Login</h2>
          <form className="w-full" onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="text-[#302b2c] block font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="text-[#302b2c] block font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <div className="w-full text-right mb-4">
              <Link href="#" className="text-[#e94560] text-sm font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>
            <button type="submit" className="w-full bg-[#e94560] text-white py-3 rounded text-lg hover:bg-[#d62848]">
              Login
            </button>
            <p className="text-[#302b2c] mt-4 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#e94560] font-bold hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  
  );
}