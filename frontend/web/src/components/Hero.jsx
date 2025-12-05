import { MessageCircle } from "lucide-react";
import HeroImg from "../assets/images/hero_sec";
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
              Vendora connects student vendors and buyers in one social
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
          <div className="order-first md:order-none">
            <img
              src={HeroImg}
              alt="Students buying and selling on Vendora"
              className="w-full h-auto max-w-[560px] mx-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
