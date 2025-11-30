import { useState } from "react";
import { useProductStore } from "../store/productStore";
import { Plus, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PostDetails } from "../components/vendor/PostDetails";
import { ProductItem } from "../components/vendor/ProductItem";
import toast from "react-hot-toast";

const VendorProductUpload = () => {
  const navigate = useNavigate();
  const { createPost, uploadImages, isCreatingPost, isUploading } =
    useProductStore();

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "",
      price: "",
      description: "",
      category: "",
      condition: "New",
      stock: 1,
      imageFile: null,
      previewUrl: null,
    },
  ]);

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now(),
        title: "",
        price: "",
        description: "",
        category: "",
        condition: "New",
        stock: 1,
        imageFile: null,
        previewUrl: null,
      },
    ]);
  };

  const removeProduct = (id) => {
    if (products.length <= 1) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (products.length < 4) {
      toast.error("You must upload at least 4 products per post.");
      return;
    }

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const index = i + 1;

      if (!p.title) {
        toast.error(`Product #${index}: Title is required`);
        return;
      }
      if (!p.price) {
        toast.error(`Product #${index}: Price is required`);
        return;
      }
      if (!p.category) {
        toast.error(`Product #${index}: Category is required`);
        return;
      }
      if (!p.description) {
        toast.error(`Product #${index}: Description is required`);
        return;
      }
      if (!p.imageFile) {
        toast.error(`Product #${index}: Image is required`);
        return;
      }
    }

    try {
      const processedProducts = await Promise.all(
        products.map(async (p) => {
          const imageUrls = await uploadImages([p.imageFile]);
          return {
            title: p.title,
            price: Number(p.price),
            description: p.description,
            category: p.category,
            condition: p.condition,
            stock: Number(p.stock),
            image: imageUrls[0],
          };
        })
      );

      await createPost({
        caption,
        location,
        products: processedProducts,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Post</h1>
          <p className="mt-2 text-gray-600">
            Share your latest products with the community. You must add at least
            4 products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <PostDetails
            caption={caption}
            setCaption={setCaption}
            location={location}
            setLocation={setLocation}
          />

          <div className="space-y-6">
            {products.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                index={index}
                totalProducts={products.length}
                updateProduct={updateProduct}
                removeProduct={removeProduct}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors font-medium"
            >
              <Plus size={20} />
              Add Another Product
            </button>

            <button
              type="submit"
              disabled={isCreatingPost || isUploading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
            >
              {isCreatingPost || isUploading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                "Post Products"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorProductUpload;
