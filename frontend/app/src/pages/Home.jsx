import { AsideBar } from "../components/AsideBar";
import { BottonNav } from "../components/BottonNav";
import { Fragment, useState } from "react";
import { HomeContent } from "../components/HomeContent";
import { NearByVendors } from "../components/NearByVendors";

export function Home() {
  return (
    <Fragment className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-8">
      <BottonNav />
      <HomeContent />
      <NearByVendors />
      {/*<div">
        <AsideBar isMenuOpened={isMenuOpened} handleClick={handleClick} />
      </div> */}
    </Fragment>
  );
}
