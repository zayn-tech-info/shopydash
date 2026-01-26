import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

export default function SearchableDropdown({
  label,
  value,
  onChange,
  options = [],
  loading = false,
  placeholder = "Select option...",
  disabled = false,
  displayKey = "label",
  valueKey = "value",
  icon: Icon,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  
  const selectedOption = options.find((opt) => opt[valueKey] === value);

  useEffect(() => {
    
    if (selectedOption) {
      setSearchTerm(selectedOption[displayKey]);
    } else {
      setSearchTerm("");
    }
  }, [value, selectedOption, displayKey]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        
        if (selectedOption) {
          setSearchTerm(selectedOption[displayKey]);
        } else {
          setSearchTerm("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption, displayKey]);

  const filteredOptions = options.filter((option) =>
    (option[displayKey] || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    
    if (e.target.value === "") {
      onChange(""); 
    }
  };

  const handleSelect = (option) => {
    onChange(option[valueKey]);
    setSearchTerm(option[displayKey]);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            
            
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-left flex items-center justify-between ${
            value ? "text-n-8" : "text-n-4/50"
          } pr-12`}
        />

        <button
          type="button"
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen && inputRef.current) {
                inputRef.current.focus();
              }
            }
          }}
          disabled={disabled}
          className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-n-4 hover:text-primary-3 transition-colors outline-none disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-3 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {Icon && !loading && (
          <Icon
            className="absolute right-12 top-1/2 -translate-y-1/2 text-n-4 pointer-events-none"
            size={18}
          />
        )}

        {isOpen && !loading && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-n-3/10 max-h-60 overflow-y-auto py-2 animate-in fade-in zoom-in-95 duration-200">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-2.5 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate pr-4">{option[displayKey]}</span>
                  {value === option[valueKey] && (
                    <Check className="w-4 h-4 text-primary-3 flex-shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-sm text-n-4">
                No results found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
