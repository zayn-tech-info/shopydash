export function Button({ children, className, px }) {
  return (
    <div>
      <button
        className={`${
          px ? px : "px-5"
        } py-2 bg-primary-3 text-white rounded-lg hover:bg-primary-2 ${className} transition-colors duration-300`}
      >
        {children}
      </button>
    </div>
  );
}
