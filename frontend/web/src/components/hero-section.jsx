"use client";
import Logo from "../assets/vendora_logo.png";

import {
  Store,
  Users,
  ShoppingBag,
  TrendingUp,
  Shield,
  Zap,
  MessageCircle,
} from "lucide-react";

import { Features } from "./Features";
import { Howitworks } from "./Howitworks";
import { Footer } from "./Footer";

export function Herosection() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img className="w-28 h-16" src={Logo} alt="" />
            {/* <span className="text-2xl font-bold text-gray-900">Vendora</span> */}
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600">
              How It Works
            </a>
            <a href="#waitlist" className="text-gray-600">
              Join Waitlist
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-gray-900">Sign In</button>
            <button className="px-6 py-2 bg-orange-500 text-white rounded-lg">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
          Your Campus Marketplace for Buying and Selling
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
          Vendora connects student vendors and buyers in one social marketplace.
          Buy and sell textbooks, gadgets, food, fashion, and more—all within
          your campus community. Already helping students at LAUTECH and
          expanding to more universities.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-orange-500 text-white rounded-lg text-lg font-medium">
            Start Selling
          </button>
          <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-lg text-lg font-medium">
            Start Shopping
          </button>
        </div>
        <div className="mt-8">
          <a
            href="https://whatsapp.com/channel/your-channel-link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-orange-500 text-orange-500 rounded-lg font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            Join Our WhatsApp Channel
          </a>
        </div>
      </section>

      <Features />
      <Howitworks />

      <Footer />
    </div>
  );
}
