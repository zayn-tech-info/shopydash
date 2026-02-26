import HeroImg from "../assets/images/mac_hero_section.png";

export function ProductPreview() {
  return (
    <section className="bg-n-1 py-20 md:py-24" id="product">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-sora text-n-8 tracking-tight">
            Designed for how Nigerian students actually trade on campus
          </h2>
          <p className="text-base md:text-lg text-n-4 leading-relaxed max-w-xl">
            From exploring campus deals between classes to managing orders from
            your hostel room, ShopyDash is optimised for fast, simple, and safe
            trading on your phone.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-2xl bg-white shadow-sm border border-n-2/30 p-4">
              <p className="font-semibold text-n-8 mb-1">
                Campus‑only visibility
              </p>
              <p className="text-n-4">
                Your listings are surfaced to students inside your university,
                not random strangers on the internet.
              </p>
            </div>
            <div className="rounded-2xl bg-white shadow-sm border border-n-2/30 p-4">
              <p className="font-semibold text-n-8 mb-1">Simple listing flow</p>
              <p className="text-n-4">
                Snap a photo, set your price, and go live in under 60 seconds
                from your mobile device.
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative w-full max-w-[420px] md:max-w-[500px] lg:max-w-[560px]">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-tr from-orange-500/15 via-amber-400/10 to-sky-400/15 blur-2xl -z-20" />
            <div className="absolute -inset-3 rounded-[2.5rem] border border-white/70 bg-white/90 backdrop-blur-xl shadow-[0_28px_80px_rgba(15,23,42,0.2)] -z-10" />
            <img
              src={HeroImg}
              alt="ShopyDash mobile app interface"
              className="relative w-full h-auto object-contain drop-shadow-xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

