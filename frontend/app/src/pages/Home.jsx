import { BottomNav } from "../components/BottomNav";
import { Fragment, useEffect } from "react";
import { HomeContent } from "../components/HomeContent";
import { NewArrival } from "../components/NewArrival";
import { Trending } from "../components/Trending";
import { NearByVendors } from "../components/NearByVendors";
import { TopSellers } from "../components/TopSellers";

import { useProductStore } from "../store/productStore";

export function Home() {
  const feedPosts = useProductStore((state) => state.feedPosts);
  const getFeedPosts = useProductStore((state) => state.getFeedPosts);
  const isFetchingFeedPosts = useProductStore((state) => state.isFetchingFeedPosts);
  const featuredProducts = useProductStore((state) => state.featuredProducts);
  const getFeaturedProducts = useProductStore((state) => state.getFeaturedProducts);
  const isFetchingFeaturedProducts = useProductStore((state) => state.isFetchingFeaturedProducts);

  useEffect(() => {
    getFeedPosts();
    getFeaturedProducts();
  }, []);

  return (
    <Fragment>
      <div className="bg-n-1 min-h-screen pb-5 md:pb-0">
        <HomeContent />
        <div className="pb-12">
          <NewArrival />
          <TopSellers />
          <Trending />
          <NearByVendors products={featuredProducts} loading={isFetchingFeaturedProducts} />
        </div>
      </div>
      <BottomNav />
    </Fragment>
  );
}
