import { memo } from "react";
import { Calendar, Edit, Trash2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/productStore";

function IndividualProductCardComponent({ product, post, onDeletePost }) {
  const navigate = useNavigate();
  const { deletePost } = useProductStore();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = () => {
    navigate("/vendor/add", { state: { post } });
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deletePost(post._id);
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              product.stock > 0
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Sold Out"}
          </span>
        </div>

        {/* Action Buttons - Visible on hover */}
        <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            className="p-1.5 bg-white/90 hover:bg-white text-gray-600 hover:text-primary-3 rounded-lg shadow-sm transition-colors"
            title="Edit"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-lg shadow-sm transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-1 flex-1">
            {product.title}
          </h3>
          <span className="font-bold text-primary-3 text-sm whitespace-nowrap">
            ₦{Number(product.price).toLocaleString()}
          </span>
        </div>

        {/* Category and Condition */}
        <p className="text-xs text-gray-500">
          {product.category} • {product.condition}
        </p>

        {/* Date and Location */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Calendar size={10} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.location && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <MapPin size={10} />
              <span className="truncate max-w-[80px]">{post.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const IndividualProductCard = memo(IndividualProductCardComponent);
