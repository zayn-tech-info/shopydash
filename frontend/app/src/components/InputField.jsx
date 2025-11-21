export function InputField({
  value,
  onChange,
  label,
  placeholder,
  className = "",
  type = "text",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full h-12 px-4 bg-white border border-n-3 rounded-xl text-n-8 placeholder:text-n-4 focus:outline-none focus:border-primary-3 focus:ring-2 focus:ring-primary-3/20 transition-all duration-200"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
