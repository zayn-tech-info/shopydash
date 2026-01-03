export function Howitworks() {
  return (
    <section id="howitworks" className="py-24 bg-gray-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold font-sora text-n-8 mb-4">
            How it works
          </h2>
          <p className="text-xl text-n-4 max-w-2xl mx-auto">
            Get started in minutes. Whether you are buying or selling, we've
            made it simple.
          </p>
        </div>

        {/* Vendors Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="text-orange-600 font-bold bg-orange-100 px-4 py-1 rounded-full text-sm uppercase tracking-wide">
              For Sellers
            </span>
            <h3 className="text-3xl font-bold mt-4 font-sora text-n-8">
              Start your campus business
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-dashed border-t-2 border-gray-200 -z-10" />

            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-n-8 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg mb-6 transform rotate-3 transition-transform hover:rotate-6">
                1
              </div>
              <h4 className="text-xl font-bold mb-3 font-sora text-n-8">
                Sign Up
              </h4>
              <p className="text-n-4 leading-relaxed">
                Create your verified student vendor account using your
                university email.
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-white border-2 border-n-8 text-n-8 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg mb-6 transform -rotate-3 transition-transform hover:-rotate-6">
                2
              </div>
              <h4 className="text-xl font-bold mb-3 font-sora text-n-8">
                List Products
              </h4>
              <p className="text-n-4 leading-relaxed">
                Upload photos, set prices, and describe your items (textbooks,
                gadgets, services).
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-orange-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg mb-6 transform rotate-3 transition-transform hover:rotate-6">
                3
              </div>
              <h4 className="text-xl font-bold mb-3 font-sora text-n-8">
                Earn Cash
              </h4>
              <p className="text-n-4 leading-relaxed">
                Connect with buyers on campus, meet up safely, and get paid
                instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Shoppers Section */}
        <div>
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold bg-blue-100 px-4 py-1 rounded-full text-sm uppercase tracking-wide">
              For Shoppers
            </span>
            <h3 className="text-3xl font-bold mt-4 font-sora text-n-8">
              Find what you need
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-dashed border-t-2 border-gray-200 -z-10" />

            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-n-8 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6">
                1
              </div>
              <h4 className="text-xl font-bold mb-3 font-sora text-n-8">
                Browse
              </h4>
              <p className="text-n-4 leading-relaxed">
                Search through thousands of products listed by students on your
                campus.
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-white border-2 border-n-8 text-n-8 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6">
                2
              </div>
              <h4 className="text-xl font-bold mb-3 font-sora text-n-8">
                Connect
              </h4>
              <p className="text-n-4 leading-relaxed">
                Chat with vendors directly to ask questions or negotiate prices.
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6">
                3
              </div>
              <h4 className="text-xl font-bold mb-3 font-sora text-n-8">Buy</h4>
              <p className="text-n-4 leading-relaxed">
                Meet up or arrange delivery, and enjoy your new purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
