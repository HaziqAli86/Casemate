// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // Import the Header
import Footer from "@/components/Footer"; // Import the Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CaseMate - AI Legal Assistant",
  description: "Your AI-powered legal assistant for instant legal insights and document analysis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}