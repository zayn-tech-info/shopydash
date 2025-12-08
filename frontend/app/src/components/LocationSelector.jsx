import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin, Check, Search } from "lucide-react";
import { nigeriaData } from "../constants/nigeriaData";
import { api } from "../lib/axios";

export default function LocationSelector({
  selectedState,
  setSelectedState,
  selectedArea,
  setSelectedArea,
  schoolName,
}) {
  const [states, setStates] = useState(nigeriaData.map((s) => s.state));
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!schoolName) return;
      try {
        setLoadingAreas(true);
        const res = await api.get(`/api/v1/locations/areas`, {
          params: {
            schoolName,
            search: selectedArea,
          },
        });
        setAreaSuggestions(res.data.areas);
      } catch (error) {
        console.error("Failed to fetch areas", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchAreas();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedArea, schoolName]);

  const handleStateChange = (val) => {
    setSelectedState(val);
  };

  const handleAreaSelect = (val) => {
    setSelectedArea(val);
    setShowAreaDropdown(false);
  };

  const areaDropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        areaDropdownRef.current &&
        !areaDropdownRef.current.contains(event.target)
      ) {
        setShowAreaDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      <CustomSelect
        label="State"
        value={selectedState}
        onChange={handleStateChange}
        options={states}
        placeholder="Select State"
        mapOption={(opt) => opt}
      />

      <div className="relative mb-5" ref={areaDropdownRef}>
        <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
          Town / Area
        </label>
        <div className="relative">
          <input
            type="text"
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              setShowAreaDropdown(true);
            }}
            onFocus={() => setShowAreaDropdown(true)}
            placeholder={
              schoolName
                ? `Type area around ${schoolName}...`
                : "Type your area..."
            }
            disabled={!schoolName}
            className={`w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-left flex items-center justify-between ${
              selectedArea ? "text-n-8" : "text-n-4/50"
            } ${!schoolName ? "opacity-50 cursor-not-allowed" : ""} pr-12`}
          />
          <button
            type="button"
            disabled={!schoolName}
            onClick={() => {
              if (!showAreaDropdown) {
                setShowAreaDropdown(true);
              } else {
                setShowAreaDropdown(false);
              }
            }}
            className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-n-4 hover:text-primary-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed outline-none"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                showAreaDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showAreaDropdown && schoolName && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-n-3/10 max-h-60 overflow-y-auto py-2 animate-in fade-in zoom-in-95 duration-200">
              {loadingAreas && areaSuggestions.length === 0 && (
                <div className="p-3 text-center text-sm text-n-4">
                  Loading suggestions...
                </div>
              )}

              {!loadingAreas && areaSuggestions.length === 0 && (
                <div className="p-3 text-center text-sm text-n-4">
                  {selectedArea ? (
                    <span>
                      No existing areas found. You can add "
                      <strong>{selectedArea}</strong>".
                    </span>
                  ) : (
                    <span>No saved areas yet. Type to add one.</span>
                  )}
                </div>
              )}

              {areaSuggestions.map((area, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAreaSelect(area)}
                  className="w-full px-4 py-2.5 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate pr-4">{area}</span>
                  {selectedArea === area && (
                    <Check className="w-4 h-4 text-primary-3 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        {!schoolName && (
          <p className="text-xs text-red-400 mt-1">
            Please select/enter your school first.
          </p>
        )}
      </div>
    </div>
  );
}

function CustomSelect({
  label,
  value,
  onChange,
  options,
  loading,
  placeholder,
  disabled,
  mapOption,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-5" ref={dropdownRef}>
      <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-left flex items-center justify-between ${
          value ? "text-n-8" : "text-n-4/50"
        } ${
          isOpen ? "bg-white border-primary-3 ring-4 ring-primary-3/10" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="flex items-center gap-2 truncate pr-4">
          <MapPin className="w-4 h-4 text-n-4" />
          <span className="truncate">{value || placeholder}</span>
        </div>
        {loading ? (
          <div className="w-5 h-5 border-2 border-primary-3 border-t-transparent rounded-full animate-spin" />
        ) : (
          <ChevronDown
            className={`w-5 h-5 text-n-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {isOpen && !loading && options.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-n-3/10 max-h-60 overflow-y-auto overflow-x-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
          {options.map((option, index) => {
            const labelStr = mapOption(option);
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(labelStr);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between group"
              >
                <span className="truncate pr-4">{labelStr}</span>
                {value === labelStr && (
                  <Check className="w-4 h-4 text-primary-3 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {isOpen && !loading && options.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-n-3/10 p-4 text-center text-n-4 text-sm animate-in fade-in zoom-in-95 duration-200">
          No options available
        </div>
      )}
    </div>
  );
}
