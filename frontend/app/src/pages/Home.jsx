import { AsideBar } from "../components/AsideBar";
import { BottonNav } from "../components/BottonNav";
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
      <div >
        <NewArrival />
        <Trending />
        <NearByVendors />
        <FeaturedVendor />
        <ShopByDepartemnt />
        <Testimonial />
      </div>
      <BottonNav />
    </Fragment>
  );
}
