import { Store, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <div>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-6 h-6 text-orange-500" />
                <span className="text-xl font-bold">Shopydash</span>
              </div>
              <p className="text-gray-400">
                The campus marketplace connecting students. Starting at LAUTECH.
              </p>
              <a
                href="https://chat.whatsapp.com/B8lvW4HByWuG45gZwdKtxZ?mode=wwt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-orange-500"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Channel</span>
              </a>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#careers">Careers</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#help">Help Center</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <a href="#terms">Terms</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Shopydash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
