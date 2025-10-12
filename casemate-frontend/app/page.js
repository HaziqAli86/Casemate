// app/page.js
"use client";
import Image from "next/image";
import Link from "next/link";
// useState is not used, so we can remove it for now
// import { useState } from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[Poppins] overflow-x-hidden">
      {/* We will move the Header and Footer to a shared layout file */}

      {/* Hero Section */}
      <section
        className="flex flex-1 justify-center items-center text-center bg-cover bg-center px-4 min-h-[calc(100vh-80px)]" // Ensure it takes up vertical space
        style={{ backgroundImage: "url('/casemate-frontend/justice.jpg')" }}
      >
        <div className="bg-black bg-opacity-60 p-8 rounded-lg text-white max-w-xl">
          <h1 className="text-4xl font-semibold mb-4">Your AI-Powered Legal Assistant</h1>
          <p className="text-lg mb-6">Get instant legal insights and document analysis with AI.</p>
          <Link href="/chatbot" className="bg-[#e94560] px-6 py-3 rounded hover:bg-[#d6324b]">
            Ask a Legal Query
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="text-center py-12 bg-white">
        <h2 className="text-3xl font-semibold mb-10 text-[#1a1a2e]">Key Features</h2>
        <div className="flex flex-col md:flex-row justify-around items-center gap-6 px-4 md:px-12">
        
         {/* AI Chatbot */}
          <div className="w-full md:w-1/3">
            <Link href="/chatbot">
              <div className="bg-[#1a1a2e] text-white p-6 rounded-lg shadow-lg hover:bg-[#2c2c54] transition cursor-pointer h-full min-h-[150px]">
                <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
                <p>Ask legal questions and get AI-powered responses.</p>
              </div>
            </Link>
          </div>

          {/* Document Analyzer */}
          <div className="w-full md:w-1/3">
            <Link href="/doc-analyzer">
              <div className="bg-[#1a1a2e] text-white p-6 rounded-lg shadow-lg hover:bg-[#2c2c54] transition cursor-pointer h-full min-h-[150px]">
                <h3 className="text-xl font-semibold mb-2">Document Analyzer</h3>
                <p>Upload legal documents for quick analysis.</p>
              </div>
            </Link>
          </div>

          {/* Templates */}
          <div className="w-full md:w-1/3">
            <Link href="/doc-template">
              <div className="bg-[#1a1a2e] text-white p-6 rounded-lg shadow-lg hover:bg-[#2c2c54] transition cursor-pointer h-full min-h-[150px]">
                <h3 className="text-xl font-semibold mb-2">Templates</h3>
                <p>Access pre-built legal document templates.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}