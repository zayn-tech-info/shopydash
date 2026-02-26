
import MacHeroSection from "./mac_hero_section";
import HeroImg from "../assets/images/hero_section_image.png";

function Hero() {
  // Use mac_hero_section on small screens, original on md and up
  return (
    <>
      <div className="block md:hidden">
        <MacHeroSection />
      </div>
      <div className="hidden md:block">
        {/* ...existing code for large screens... */}
        <div className="relative overflow-hidden bg-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-orange-400/70 via-amber-300/60 to-transparent blur-2xl motion-safe:animate-pulse z-0"
          />
          {/* Removed green gradient background */}
          <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 lg:pt-14 pb-12 md:pb-16 lg:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-12 lg:gap-20">
              <div className="text-center lg:text-left space-y-8 mt-14">
                <div className="space-y-5">
                  <h1 className="text-4xl md:text-5xl lg:text-[3.1rem] font-extrabold text-n-8 tracking-tight leading-tight font-sora">
                    The fastest way to{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                      turn your campus hustle into sales.
                    </span>
                  </h1>
                  <p className="text-base md:text-lg text-n-4 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Shopydash is the hyper-local campus marketplace to buy and sell
                    within your university. Start selling in minutes and turn your
                    campus hustle into real sales.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <a
                    href="https://app.shopydash.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 bg-n-8 hover:bg-orange-600 text-white rounded-full shadow-md font-semibold text-sm md:text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    Start Selling
                  </a>
                  <a
                    href="https://app.shopydash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-n-8 border border-gray-200 hover:border-orange-200 hover:bg-orange-50/60 rounded-full font-semibold text-sm md:text-base transition-all"
                  >
                    Explore Campus Deals
                  </a>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start justify-center text-xs md:text-sm text-n-4">
                  <div className="inline-flex items-center justify-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600 text-[11px]">
                      ✓
                    </span>
                    <span>
                      Trusted by{" "}
                      <span className="font-semibold text-n-8">2k+ students</span>{" "}
                      across Nigerian campuses.
                    </span>
                  </div>
                  <a
                    href="https://chat.whatsapp.com/B8lvW4HByWuG45gZwdKtxZ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Join our WhatsApp Community
                  </a>
                </div>
              </div>

              <div className="relative order-first lg:order-last flex justify-center lg:self-start">
                <div className="relative w-full max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
                  <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-orange-100/40 via-white to-transparent -z-10" />

                  <div className="rounded-[2.3rem] bg-white border-gray-100 px-4 py-4">
                    <img
                      src={HeroImg}
                      alt="ShopyDash mobile marketplace preview"
                      className="w-full h-auto object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 border border-gray-100 px-4 py-2 text-xs md:text-sm text-n-6">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-[11px]">
                      ✓
                    </span>
                    <span>Verified students. Safer trades. Faster sales.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

    </>
  );
}

export default Hero;
