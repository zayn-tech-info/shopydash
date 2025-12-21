import { BottomNav } from "../components/BottomNav";
import { Fragment, useEffect } from "react";
import { HomeContent } from "../components/HomeContent";
import { NewArrival } from "../components/NewArrival";
import { Trending } from "../components/Trending";
import { NearByVendors } from "../components/NearByVendors";
import { FeaturedVendor } from "../components/FeaturedVendor";
import { Testimonial } from "../components/Testimonial";
import { useProductStore } from "../store/productStore";

export function Home() {
  const feedPosts = useProductStore((state) => state.feedPosts);
  const getFeedPosts = useProductStore((state) => state.getFeedPosts);

  useEffect(() => {
    getFeedPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <div className="bg-n-1 min-h-screen pb-20 md:pb-0">
        <HomeContent />
        <div className="space-y-12 md:space-y-16 pb-12">
          <NewArrival />
          <Trending />
          <NearByVendors posts={feedPosts} />
          <FeaturedVendor />
          <Testimonial />
        </div>
      </div>
      <BottomNav />
    </Fragment>
  );
}
