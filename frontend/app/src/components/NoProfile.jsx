import { useState } from "react";

import { ShoppingCart } from "lucide-react";

import { useAuthStore } from "../store/authStore";

export function NoProfile() {
  const { authUser, checkAuth } = useAuthStore();
  return (
    <div>
      <div className="py-20">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mx-auto mb-4">
            <ShoppingCart />
          </div>

          <h2 className="text-2xl font-semibold mb-2">
            Hi @{authUser && authUser.username}
          </h2>
          <p className="text-sm text-n-7 mb-4">
            You don't have a store profile yet. Create one to start selling and
            let customers find you.
          </p>

          <div className="flex items-center justify-center gap-3">
            <a
              href="/vendor/create"
              title="Create profile"
              className="px-4 py-2 border-n-3 border-2  text-n-8 rounded-md text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors"
            >
              Create profile
            </a>
            <a
              href="/"
              className="px-4 bg-primary-3 text-n-1 py-2 transition-colors duration-500 text-sm rounded-md border border-gray-200 hover:bg-primary-2"
            >
              Browse stores
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
