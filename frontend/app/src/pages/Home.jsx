import { BottomNav } from "../components/BottomNav";
import { Fragment, useEffect } from "react";
import { HomeContent } from "../components/HomeContent";
import { NewArrival } from "../components/NewArrival";
import { Trending } from "../components/Trending";
import { NearByVendors } from "../components/NearByVendors";
import { FeaturedVendor } from "../components/FeaturedVendor";
import { ShopByDepartemnt } from "../components/ShopByDepartemnt";
import { Testimonial } from "../components/Testimonial";
import { useProductStore } from "../store/productStore";

export function Home() {
  const { getFeedPosts, feedPosts } = useProductStore();

  useEffect(() => {
    getFeedPosts();
  }, [getFeedPosts]);

  return (
    <Fragment>
      <div className="bg-n-1 min-h-screen pb-20 md:pb-0">
        <HomeContent />
        <div className="space-y-12 md:space-y-16 pb-12">
          <NewArrival />
          <Trending />
          <NearByVendors posts={feedPosts} />
          <FeaturedVendor />
          <ShopByDepartemnt />
          <Testimonial />
        </div>
      </div>
      <BottomNav />
    </Fragment>
  );
}
