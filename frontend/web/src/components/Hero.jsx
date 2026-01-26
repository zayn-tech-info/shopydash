import { MessageCircle } from "lucide-react";
import HeroImg from "../assets/images/hero_sec.png";
import { Button } from "./Button";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {}
      <div className="absolute inset-0 overflow-hidden -z-10 bg-white">
        {}
        <div
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-50/40 rounded-full translate-x-1/3 -translate-y-1/4"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(249, 115, 22, 0.05) 10px, rgba(249, 115, 22, 0.05) 20px)",
          }}
        />

        {}
        <div
          className="absolute top-20 left-10 w-64 h-64 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#f97316 2px, transparent 2px)",
            backgroundSize: "24px 24px",
          }}
        />

        {}
        <svg
          className="absolute bottom-0 left-0 w-full md:w-2/3 h-[500px] text-orange-50 -z-20 transform translate-y-1/3"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <path
            d="M0,1000 L0,0 C200,800 800,800 1000,1000 Z"
            fill="currentColor"
          />
        </svg>

        {}
        <div className="absolute top-1/4 left-0 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-1/4 right-0 w-32 h-32 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
          {}
          <div className="text-center lg:text-left z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-n-8 tracking-tight leading-tight mb-4 font-sora">
              Your Campus Marketplace for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Buying & Selling
              </span>
            </h1>

            <p className="text-lg md:text-xl text-n-4 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              Shopydash connects student vendors and buyers in one premium
              social marketplace. Trade textbooks, gadgets, fashion, and more
              securely within your campus community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <a
                href="https:
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-orange-200 shadow-xl font-bold text-lg transition-all transform hover:-translate-y-1 text-center"
              >
                Start Selling
              </a>
              <a
                href="https:
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 hover:border-orange-100 hover:bg-orange-50 rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md text-center"
              >
                Start Shopping
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start">
              <a
                href="https:
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

          {}
          <div className="relative order-first lg:order-last flex justify-center perspective-1000">
            {}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[image:radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100/30 via-transparent to-transparent -z-20 pointer-events-none" />

            {}
            <div className="absolute inset-0 border border-orange-100 rounded-full scale-[1.2] animate-[spin_20s_linear_infinite_reverse] -z-10 pointer-events-none border-dashed opacity-60" />
            <div className="absolute inset-0 border border-orange-200/50 rounded-full scale-110 animate-[spin_15s_linear_infinite] -z-10 pointer-events-none" />

            {}

            {}
            <div
              className="absolute top-0 right-0 w-20 h-20 border-4 border-orange-200 rounded-full opacity-40 animate-[bounce_6s_infinite]"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-10 -left-10 w-16 h-16 bg-yellow-100/80 rounded-lg transform -rotate-12 shadow-inner animate-[spin_10s_linear_infinite]"
              style={{ animationDuration: "20s" }}
            ></div>

            {}
            <svg
              className="absolute top-1/2 -right-12 w-32 h-32 text-orange-100/60 -z-10"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" />
            </svg>

            {}
            <div className="absolute -top-8 -right-4 md:-right-8 w-20 h-20 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl flex items-center justify-center animate-bounce z-20 hidden md:flex transform hover:scale-110 transition-transform">
              <span className="text-3xl filter drop-shadow-sm">🛍️</span>
            </div>

            <div className="absolute -bottom-8 -left-8 md:-left-12 px-6 py-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg flex items-center justify-center animate-pulse z-20 hidden md:flex gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="font-bold text-gray-800 text-sm tracking-wide">
                Live Trade
              </span>
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
