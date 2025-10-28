import { AsideBar } from "../components/AsideBar";
import { BottonNav } from "../components/BottonNav";
import { Fragment, useState } from "react";
import { HomeContent } from "../components/HomeContent";
import { NearByVendors } from "../components/NearByVendors";
import { Trending } from "../components/Trending";
import { FeaturedVendor } from "../components/FeaturedVendor";

export function Home() {
  return (
    <Fragment className="relative max-w-7xl mx-auto px-2 sm:px-6 md:px-10 lg:px-8">
      <BottonNav />
      <HomeContent />
      <NearByVendors />
      <Trending />
      <FeaturedVendor />
      {/*<div">
        <AsideBar isMenuOpened={isMenuOpened} handleClick={handleClick} />
      </div> */}
    </Fragment>
  );
}
