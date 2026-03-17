import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { preferredCategories } from "../../constants";

export function AddProductModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [condition, setCondition] = useState("new");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [visibility, setVisibility] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setCategory("");
      setPrice(0);
      setCondition("new");
      setQuantity(1);
      setLocation("");
      setImages([]);
      setVisibility(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleFiles(files) {
    const list = Array.from(files).slice(0, 5);
    const accepted = list.filter(
      (f) => /image\/(jpeg|png)/.test(f.type) && f.size <= 3 * 1024 * 1024
    );
    if (accepted.length < list.length) {
      toast.error("Some files were rejected (only jpeg/png <= 3MB)");
    }
    setImages((prev) => [...prev, ...accepted]);
  }

  function handleRemoveImage(idx) {
    setImages((p) => p.filter((_, i) => i !== idx));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!category) return toast.error("Category is required");
    if (price <= 0) return toast.error("Price must be greater than zero");
    if (!location) return toast.error("Location is required");
 
    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("category", category);
    fd.append("price", price);
    fd.append("condition", condition);
    fd.append("quantity", quantity);
    fd.append("location", location);
    fd.append("visibility", visibility);
    images.forEach((file, idx) => fd.append("images", file));

    await onAdd(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-lg w-full max-w-3xl shadow-lg overflow-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Add New Product</h3>
          <button onClick={onClose} aria-label="Close" className="p-2">
            <X />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium">Images</label>
            <div className="mt-2 border-dashed border-2 border-gray-200 rounded-md p-3">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="mt-2 grid grid-cols-3 gap-2">
                {images.map((f, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Product name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              maxLength={120}
            />

            <label className="block text-sm font-medium mt-3">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              maxLength={1000}
              rows={4}
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                >
                  <option value="">Select category</option>
                  {preferredCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Price (NGN)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-1 w-full rounded border px-3 py-2"
                  min={0}
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1 w-full rounded border px-3 py-2"
                  min={1}
                />
              </div>
            </div>

            <label className="block text-sm font-medium mt-3">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />

            <div className="mt-3 flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={visibility}
                  onChange={(e) => setVisibility(e.target.checked)}
                />
                <span className="text-sm">Visible</span>
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#F97316] text-white"
              >
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
