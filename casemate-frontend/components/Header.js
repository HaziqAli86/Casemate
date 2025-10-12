// components/Header.js
"use client";
import Image from "next/image";
import Link from "next/link";
// useState is not used in your final version, so it can be removed
// import { useState } from "react"; 
import AuthButton from "./AuthButton"; // We will create this next

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 md:px-12 py-4 bg-[#1a1a2e] text-white h-[80px]">
      <div className="logo">
        <Link href="/">
          <Image src="/logo.png" alt="CaseMate Logo" width={150} height={150} />
        </Link>
      </div>
      <nav className="relative">
        <ul className="flex items-center space-x-6">
          <li><Link href="/chatbot" className="hover:text-[#e94560]">AI Chatbot</Link></li>
          <li>
            <a
              href="https://9791855cf9223fa732.gradio.live"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e94560]"
            >
              Document Analyzer
            </a>
          </li>
          <li><Link href="/doc-template" className="hover:text-[#e94560]">Document Templates</Link></li>
          <li><Link href="/about" className="hover:text-[#e94560]">About</Link></li>
          <li><Link href="/contact" className="hover:text-[#e94560]">Contact</Link></li>
          <li><AuthButton /></li>
        </ul>
      </nav>
    </header>
  );
}