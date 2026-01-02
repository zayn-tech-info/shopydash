import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 3000);
  };
  return (
    <div>
      <section id="waitlist" className="bg-orange-500 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Join the Shopydash Waitlist
            </h2>
            <p className="text-xl text-orange-50">
              Be among the first students to access the campus marketplace.
              Already launching at LAUTECH. Get early access and exclusive
              benefits at your university.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                You're on the list!
              </h3>
              <p className="text-gray-600">
                We'll notify you as soon as Shopydash launches at your campus.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.open("https://forms.gle/RD8YyGTCMjh6pkbw6", "_blank", "noopener,noreferrer");
              }}
              className="bg-white rounded-lg p-8"
            >
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  University Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="you@university.edu"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  I want to join as:
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-gray-300 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="vendor"
                      checked={role === "vendor"}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="font-medium text-gray-900">Vendor</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-gray-300 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={role === "customer"}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="font-medium text-gray-900">Customer</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-2 items-center text-white">
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-orange-500 text-white rounded-lg text-lg font-medium flex items-center justify-center gap-2"
                >
                  Join Waitlist
                  <ExternalLink size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
