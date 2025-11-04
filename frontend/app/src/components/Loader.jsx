import { Loader as Load } from "lucide-react";
export function Loader({ children }) {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <button
          type="button"
          className="flex items-center gap-3 bg-primary-3 text-white px-4 py-2 rounded"
          disabled
        >
          <svg
            className="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <Load />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          {children}
        </button>
      </div>
    </div>
  );
}
