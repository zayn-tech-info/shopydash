import {
  Store,
  Users,
  ShoppingBag,
  TrendingUp,
  Shield,
  Zap,
  MessageCircle,
  Search,
} from "lucide-react";

export function Features() {
  return (
    <div>
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Built for Students
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Everything you need to buy, sell, and connect with fellow students
            on your campus
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Student Vendor Profiles
              </h3>
              <p className="text-gray-600">
                Create your shop profile to showcase products, build your campus
                brand, and reach thousands of students at your university.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Smart Product Search
              </h3>
              <p className="text-gray-600">
                Easily find exactly what you need with our powerful search and
                filter tools. Browse by category, price, or location to discover
                items around campus.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Easy Campus Shopping
              </h3>
              <p className="text-gray-600">
                Buy textbooks, gadgets, food, fashion, and more from verified
                students with secure checkout options.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Seamless Payouts
              </h3>
              <p className="text-gray-600">
                Track your sales and withdraw your earnings directly to your
                bank account via our secure Paystack integration.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Safe Transactions
              </h3>
              <p className="text-gray-600">
                Verified student accounts and secure payments ensure safe buying
                and selling within your campus community.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Instant Messaging
              </h3>
              <p className="text-gray-600">
                Chat directly with vendors to ask questions, negotiate prices,
                and arrange safe meetups on campus.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
