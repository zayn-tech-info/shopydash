import { MessageCircle } from "lucide-react";
import Logo from "../assets/images/shopydash_logo.png";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-n-8 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img
                  src={Logo}
                  alt="Shopydash"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-xl font-bold font-sora">Shopydash</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              The #1 campus marketplace connecting students at LAUTECH. Buy,
              sell, and vibe securely.
            </p>
            <a
              href="https://chat.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/10 text-green-500 rounded-full hover:bg-green-600/20 transition-colors text-sm font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Join WhatsApp Community</span>
            </a>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg font-sora">Platform</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <a
                  href="#features"
                  className="hover:text-orange-500 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-orange-500 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#howitworks"
                  className="hover:text-orange-500 transition-colors"
                >
                  How it Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg font-sora">Company</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg font-sora">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Shopydash. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
