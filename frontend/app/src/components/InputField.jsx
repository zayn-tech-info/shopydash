export function InputField({ value, onChange, label, placeholder }) {
  return (
    <div>
      <div>
        <label className="block text-sm font-medium">{label}</label>
        <input
          value={value}
          onChange={onChange}
          className="w-full mt-1 border rounded px-3 py-2"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
