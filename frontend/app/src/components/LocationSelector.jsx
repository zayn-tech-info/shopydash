import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { api } from "../lib/axios";

export default function LocationSelector({
  schoolName,
  setSchoolName,
  selectedArea,
  setSelectedArea,
}) {
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true);
        const res = await api.get("/api/v1/locations/schools");
        if (res.data.success) {
          setSchools(res.data.schools);
        }
      } catch (error) {
        console.error("Failed to fetch schools", error);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchSchools();
  }, []);

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

  const handleAreaSelect = (val) => {
    setSelectedArea(val);
    setShowAreaDropdown(false);

    if (!areaSuggestions.includes(val)) {
      api
        .post("/api/v1/locations/areas", { schoolName, areaName: val })
        .catch((err) => console.error("Auto-add area failed", err));
    }
  };

  const schoolDropdownRef = useRef(null);
  const areaDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        areaDropdownRef.current &&
        !areaDropdownRef.current.contains(event.target)
      ) {
        setShowAreaDropdown(false);
      }
      if (
        schoolDropdownRef.current &&
        !schoolDropdownRef.current.contains(event.target)
      ) {
        setShowSchoolDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative mb-5" ref={schoolDropdownRef}>
        <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
          School Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={schoolName}
            onChange={(e) => {
              setSchoolName(e.target.value);
              setShowSchoolDropdown(true);
            }}
            onFocus={() => setShowSchoolDropdown(true)}
            placeholder="Select your university..."
            className={`w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-left flex items-center justify-between ${
              schoolName ? "text-n-8" : "text-n-4/50"
            } pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
            className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-n-4 hover:text-primary-3 transition-colors outline-none"
          >
            {loadingSchools ? (
              <div className="w-5 h-5 border-2 border-primary-3 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  showSchoolDropdown ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {showSchoolDropdown && !loadingSchools && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-n-3/10 max-h-60 overflow-y-auto py-2 animate-in fade-in zoom-in-95 duration-200">
              {schools
                .filter((s) =>
                  (s || "")
                    .toLowerCase()
                    .includes((schoolName || "").toLowerCase())
                )
                .map((school, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSchoolName(school);
                      setShowSchoolDropdown(false);
                      setSelectedArea("");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate pr-4">{school}</span>
                    {schoolName === school && (
                      <Check className="w-4 h-4 text-primary-3 flex-shrink-0" />
                    )}
                  </button>
                ))}
              {schools.filter((s) =>
                (s || "")
                  .toLowerCase()
                  .includes((schoolName || "").toLowerCase())
              ).length === 0 && (
                <div className="p-3 text-center text-sm text-n-4">
                  No matching schools.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
            onClick={() => setShowAreaDropdown(!showAreaDropdown)}
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
              {loadingAreas && (
                <div className="p-3 text-center text-sm text-n-4">
                  Loading suggestions...
                </div>
              )}

              {!loadingAreas && (
                <>
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
                  {/* Allow selecting what the user typed if it's not in suggestions */}
                  {selectedArea && !areaSuggestions.includes(selectedArea) && (
                    <button
                      type="button"
                      onClick={() => handleAreaSelect(selectedArea)}
                      className="w-full px-4 py-2.5 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between group border-t border-n-3/10"
                    >
                      <span className="truncate pr-4">
                        Use "{selectedArea}"
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        {!schoolName && (
          <p className="text-xs text-red-400 mt-1">
            Please select your school first.
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
