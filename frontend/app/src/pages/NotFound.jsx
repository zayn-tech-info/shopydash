import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="py-12">
      <div className="max-w-3xl mx-auto text-center p-8 bg-white rounded-md shadow-sm border">
        <h1 className="text-4xl font-bold text-n-9 mb-4">Page not found</h1>
        <p className="text-n-7 mb-6">
          We couldn't find the page you're looking for.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="px-5 py-3 bg-primary-3 text-white rounded-md">
            Go to home
          </Link>
          <Link to="/" className="px-4 py-3 border rounded-md text-n-7">
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}
