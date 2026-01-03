import { MessageCircle } from "lucide-react";
import HeroImg from "../assets/images/hero_sec.png";
import { Button } from "./Button";

export function Hero() {
  return (
    <div className="min-h-screen">
      <section className="container py-5 md:py-10 lg:py-9 bg-orange-50">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-14">
          <div className="text-center md:text-left">
            <h1 className="h1 text-black mb-4 text-balance">
              Your Campus Marketplace for Buying and Selling
            </h1>
            <p className="body-1 text-n-4 text-sm max-w-3xl md:max-w-none mx-auto md:mx-0 text-pretty mb-8">
              Shopydash connects student vendors and buyers in one social
              marketplace. Buy and sell textbooks, gadgets, food, fashion, and
              more, all within your campus community. Already helping students
              at LAUTECH and expanding to more universities.
            </p>
            <div className="flex flex-col sm:flex-row md:justify-start justify-center items-center gap-4">
              <Button className="px-8 py-4 bg-orange-500 text-white rounded-lg text-base md:text-lg font-medium">
                Start Selling
              </Button>
              <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-lg text-base md:text-lg font-medium">
                Start Shopping
              </button>
            </div>
            <div className="mt-8">
              <a
                href="https://chat.whatsapp.com/B8lvW4HByWuG45gZwdKtxZ?mode=wwt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary-3 text-primary-3 rounded-lg font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                Join Our WhatsApp Channel
              </a>
            </div>
          </div>

          {/* Right: Image */}
          <div className="order-first md:order-none relative z-10">
            {/* Decorative Patterns */}
            {/* Decorative Patterns */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[image:radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100/50 via-transparent to-transparent -z-20" />

            {/* Dot Pattern */}
            <div className="absolute -top-10 -right-10 w-32 h-32 opacity-20 bg-[radial-gradient(#f97316_2px,transparent_2px)] [background-size:16px_16px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 opacity-20 bg-[radial-gradient(#f97316_2px,transparent_2px)] [background-size:16px_16px] -z-10" />

            {/* Circles */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob -z-10" />
            <div className="absolute -bottom-8 left-20 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 -z-10" />

            {/* Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border-2 border-dashed border-orange-200 rounded-full -z-10 animate-[spin_10s_linear_infinite]" />

            <img
              src={HeroImg}
              alt="Students buying and selling on Shopydash"
              className="w-full h-auto max-w-[200px] md:max-w-[300px] mx-auto object-contain rounded-3xl relative z-10 drop-shadow-2xl"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
