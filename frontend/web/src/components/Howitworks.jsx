export function Howitworks() {
  return (
    <div>
      <section id="howitworks" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 gap-16">
            {/* For Vendors */}
            <div>
              <h3 className="text-2xl font-bold text-orange-500 mb-8">
                For Student Vendors
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Sign Up with Student Email
                    </h4>
                    <p className="text-gray-600">
                      Create your vendor account using your university student
                      email address.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      List Your Products
                    </h4>
                    <p className="text-gray-600">
                      Add items you want to sell textbooks, gadgets, food,
                      fashion, or services.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Reach Campus Students
                    </h4>
                    <p className="text-gray-600">
                      Students discover your profile, browse your products, and
                      make purchases directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Customers */}
            <div>
              <h3 className="text-2xl font-bold text-orange-500 mb-8">
                For Students Shopping
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Explore Campus Vendors
                    </h4>
                    <p className="text-gray-600">
                      Browse profiles of fellow students selling everything you
                      need on campus.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Follow Your Favorites
                    </h4>
                    <p className="text-gray-600">
                      Follow vendors you trust and get notified when they add
                      new products.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Buy Safely</h4>
                    <p className="text-gray-600">
                      Add to cart, checkout securely, and get your items from
                      verified student vendors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
