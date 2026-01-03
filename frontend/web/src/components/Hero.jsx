import { MessageCircle } from "lucide-react";
import HeroImg from "../assets/images/hero_sec.png";
import { Button } from "./Button";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/3" />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Your Campus Marketplace for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Buying & Selling
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              Shopydash connects student vendors and buyers in one premium
              social marketplace. Trade textbooks, gadgets, fashion, and more
              securely within your campus community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <a
                href="https://app.shopydash.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-orange-200 shadow-xl font-bold text-lg transition-all transform hover:-translate-y-1 text-center"
              >
                Start Selling
              </a>
              <a
                href="https://app.shopydash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 hover:border-orange-100 hover:bg-orange-50 rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md text-center"
              >
                Start Shopping
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start">
              <a
                href="https://chat.whatsapp.com/B8lvW4HByWuG45gZwdKtxZ?mode=wwt"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                <div className="p-2 bg-green-50 text-green-600 rounded-full group-hover:bg-green-100 transition-colors">
                  <MessageCircle size={20} />
                </div>
                <span>Join our WhatsApp Community</span>
              </a>
            </div>
          </div>

          {/* Right: Image & Decorations */}
          <div className="relative order-first lg:order-last flex justify-center">
            {/* Decorative Patterns */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[image:radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent -z-20 pointer-events-none" />

            {/* Animated Rings */}
            <div className="absolute inset-0 border border-orange-100 rounded-full scale-125 animate-[spin_20s_linear_infinite_reverse] -z-10 pointer-events-none" />
            <div className="absolute inset-0 border border-dashed border-orange-200 rounded-full scale-110 animate-[spin_15s_linear_infinite] -z-10 pointer-events-none" />

            {/* Floating Elements */}
            <div className="absolute -top-12 -right-4 w-20 h-20 bg-white rounded-2xl shadow-xl items-center justify-center animate-bounce z-20 hidden md:flex">
              <span className="text-3xl">🛍️</span>
            </div>
            <div className="absolute -bottom-8 -left-8 w-24 h-14 bg-white rounded-xl shadow-lg items-center justify-center animate-pulse z-20 hidden md:flex">
              <span className="font-bold text-orange-500 text-lg">New!</span>
            </div>

            <img
              src={HeroImg}
              alt="Shopydash App on iPhone"
              className="relative w-full max-w-[280px] md:max-w-[340px] h-auto object-contain z-10 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
