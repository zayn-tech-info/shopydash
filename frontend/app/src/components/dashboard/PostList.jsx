 import { PostCard } from "./PostCard";
import { ProductListSkeleton } from "../skeletons/ProductListSkeleton";

export function PostList({ posts, loading, onDelete }) {
  if (loading) {
    return <ProductListSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
          You haven't posted any products yet. Click the + button to create your
          first post.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDelete={onDelete} />
      ))}
    </div>
  );
}
