import { BottomNav } from "../components/BottomNav";
import { Fragment, useEffect } from "react";
import { HomeContent } from "../components/HomeContent";
import { NewArrival } from "../components/NewArrival";
import { Trending } from "../components/Trending";
import { NearByVendors } from "../components/NearByVendors";
import { FeaturedVendor } from "../components/FeaturedVendor";

import { useProductStore } from "../store/productStore";

export function Home() {
  const feedPosts = useProductStore((state) => state.feedPosts);
  const getFeedPosts = useProductStore((state) => state.getFeedPosts);

  useEffect(() => {
    getFeedPosts();
    
  }, []);

  return (
    <Fragment>
      <div className="bg-n-1 min-h-screen pb-5 md:pb-0">
        <HomeContent />
        <div className="pb-12">
          <NewArrival />
          <Trending />
          <NearByVendors posts={feedPosts} />
          <FeaturedVendor />
        </div>
      </div>
      <BottomNav />
    </Fragment>
  );
}
