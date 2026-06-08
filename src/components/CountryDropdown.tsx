import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Search } from 'lucide-react';
import { countries, type Country } from './countries';

interface CountryDropdownProps {
  selected: Country;
  onChange: (country: Country) => void;
}

export default function CountryDropdown({ selected, onChange }: CountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="country-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="country-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="input-icon">
          <Globe size={18} />
        </span>
        <span className="selected-country-info">
          <span className="selected-flag">{selected.flag}</span>
          <span className="selected-name">{selected.name}</span>
        </span>
        <span className="dropdown-caret">
          <ChevronDown size={16} className={`caret-icon ${isOpen ? 'open' : ''}`} />
        </span>
      </button>

      {isOpen && (
        <div className="country-dropdown-panel animate-fade-in-up">
          <div className="dropdown-search-wrapper">
            <Search size={14} className="search-icon-inside" />
            <input
              type="text"
              className="dropdown-search-input"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          
          <ul className="country-options-list" role="listbox">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <li
                  key={country.code}
                  className={`country-option-item ${selected.code === country.code ? 'active' : ''}`}
                  role="option"
                  aria-selected={selected.code === country.code}
                  onClick={() => {
                    onChange(country);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  <span className="option-flag">{country.flag}</span>
                  <span className="option-name">{country.name}</span>
                  <span className="option-code">{country.code}</span>
                </li>
              ))
            ) : (
              <li className="no-countries-found">No countries found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
