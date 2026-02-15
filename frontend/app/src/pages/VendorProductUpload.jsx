import { useState, useEffect } from "react";
import { useProductStore } from "../store/productStore";
import { useAuthStore } from "../store/authStore";
import { Plus, Loader, CreditCard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { PostDetails } from "../components/vendor/PostDetails";
import { ProductItem } from "../components/vendor/ProductItem";
import toast from "react-hot-toast";

const VendorProductUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingPost = location.state?.post;
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser && !authUser.hasProfile) {
      toast.error("Please complete your vendor profile first");
      navigate("/create-vendor-profile");
    }
  }, [authUser, navigate]);

  const { createPost, updatePost, uploadImages, isCreatingPost, isUploading } =
    useProductStore();

  const getInitialState = (key, defaultValue) => {
    if (editingPost) return defaultValue;
    const saved = localStorage.getItem("vendor_post_draft_" + key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [schoolName, setSchoolName] = useState(() =>
    getInitialState("school", editingPost?.school || ""),
  );
  const [selectedArea, setSelectedArea] = useState(() =>
    getInitialState("area", editingPost?.area || ""),
  );

  const [products, setProducts] = useState(() => {
    if (editingPost) {
      return (
        editingPost?.products.map((p) => ({
          id: p._id || Date.now() + Math.random(),
          title: p.title,
          price: p.price,
          description: p.description,
          category: p.category,
          condition: p.condition,
          stock: p.stock,
          imageFile: null,
          previewUrl: p.image,
        })) || []
      );
    }
    const savedProducts = localStorage.getItem("vendor_post_draft_products");
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
    return [
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
    ];
  });

  
  useEffect(() => {
    if (!editingPost) {
      localStorage.setItem(
        "vendor_post_draft_school",
        JSON.stringify(schoolName),
      );
      localStorage.setItem(
        "vendor_post_draft_area",
        JSON.stringify(selectedArea),
      );

      
      const sanitizedProducts = products.map((p) => ({
        ...p,
        imageFile: null,
        previewUrl: null, 
      }));
      localStorage.setItem(
        "vendor_post_draft_products",
        JSON.stringify(sanitizedProducts),
      );
    }
  }, [schoolName, selectedArea, products, editingPost]);

  const clearDraft = () => {
    localStorage.removeItem("vendor_post_draft_school");
    localStorage.removeItem("vendor_post_draft_area");
    localStorage.removeItem("vendor_post_draft_products");
  };

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
      prevProducts.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (products.length === 0) {
      toast.error("You must upload at least 1 product.");
      return;
    }
    if (products.length > 4) {
      toast.error("You can upload a maximum of 4 products per post.");
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
      if (!p.imageFile && !p.previewUrl) {
        toast.error(`Product #${index}: Image is required`);
        return;
      }
    }

    try {
      const processedProducts = await Promise.all(
        products.map(async (p) => {
          let imageUrl = p.previewUrl;
          if (p.imageFile) {
            const imageUrls = await uploadImages([p.imageFile]);
            imageUrl = imageUrls[0];
          }
          return {
            title: p.title,
            price: Number(p.price),
            description: p.description,
            category: p.category,
            condition: p.condition,
            stock: Number(p.stock),
            image: imageUrl,
          };
        }),
      );

      const postData = {
        location: selectedArea,
        school: schoolName,
        area: selectedArea,
        products: processedProducts,
      };

      if (editingPost) {
        await updatePost(editingPost._id, postData);
      } else {
        await createPost(postData);
        clearDraft();
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Submission failed", error);
      toast.error("Failed to submit post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {editingPost ? "Edit Post" : "New Post"}
          </h1>
          <p className="mt-2 text-gray-600">
            {editingPost
              ? "Update your post details."
              : "Share your latest products with the community."}{" "}
            You can add up to 4 products. Products are automatically deleted
            after 7 days.
          </p>

          {!authUser?.vendorProfile?.bankDetails?.subaccountCode && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900">
                  Bank Details Required
                </h3>
                <p className="text-sm text-red-700 mt-1 mb-3">
                  You need to set up your payout details before you can upload
                  products. This ensures you get paid for your sales.
                </p>
                <button
                  onClick={() => navigate("/settings?tab=payout")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                >
                  Set Account Details
                </button>
              </div>
            </div>
          )}
        </div>

        {authUser?.vendorProfile?.bankDetails?.subaccountCode ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <PostDetails
              schoolName={schoolName}
              setSchoolName={setSchoolName}
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
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
                disabled={products.length >= 4}
                className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl transition-colors font-medium ${
                  products.length >= 4
                    ? "opacity-50 cursor-not-allowed text-gray-400 bg-gray-50"
                    : "text-gray-600 hover:border-orange-500 hover:text-orange-600"
                }`}
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
                ) : editingPost ? (
                  "Update Post"
                ) : (
                  "Post Products"
                )}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default VendorProductUpload;
