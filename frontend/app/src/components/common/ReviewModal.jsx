import { useState } from "react";
import { Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewModal({ isOpen, onClose, order, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        orderId: order._id,
        vendorId: order.vendor._id,
        rating,
        comment,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden z-10"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Rate your experience
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 mb-8">
            <p className="text-sm text-gray-500">How was your order from</p>
            <p className="font-bold text-lg text-gray-900 text-center">
              {order.vendor?.userId?.businessName ||
                order.vendor?.userId?.username ||
                "the vendor"}
            </p>

            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95 focus:outline-none p-1"
                >
                  <Star
                    size={40}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-transparent text-gray-200"
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-yellow-600 h-5 mt-1">
              {hoverRating > 0
                ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                    hoverRating - 1
                  ]
                : rating > 0
                ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1]
                : ""}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Add a written review (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked (or didn't like)..."
              className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-3 focus:border-transparent resize-none bg-gray-50 text-gray-900 placeholder:text-gray-400 text-sm"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full py-3.5 bg-primary-3 text-white rounded-xl font-bold shadow-lg shadow-primary-3/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all flex justify-center items-center gap-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
