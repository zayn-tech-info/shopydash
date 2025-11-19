import { BottomNav } from "../components/BottomNav";
import { Fragment } from "react";
import { HomeContent } from "../components/HomeContent";
import { NewArrival } from "../components/NewArrival";
import { Trending } from "../components/Trending";
import { NearByVendors } from "../components/NearByVendors";
import { FeaturedVendor } from "../components/FeaturedVendor";
import { ShopByDepartemnt } from "../components/ShopByDepartemnt";
import { Testimonial } from "../components/Testimonial";

export function Home() {
  return (
    <Fragment>
      <div className="bg-n-1 min-h-screen pb-20 md:pb-0">
        <HomeContent />
        <div className="space-y-12 md:space-y-16 pb-12">
          <NewArrival />
          <Trending />
          <NearByVendors />
          <FeaturedVendor />
          <ShopByDepartemnt />
          <Testimonial />
        </div>
      </div>
      <BottomNav />
    </Fragment>
  );
}
