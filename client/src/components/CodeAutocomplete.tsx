import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MedicalCode } from "@/data/cpt-codes";

interface CodeAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  codes: MedicalCode[];
  placeholder?: string;
  id?: string;
}

export default function CodeAutocomplete({
  value,
  onChange,
  codes,
  placeholder,
  id,
}: CodeAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal query when value changes externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const matches = query.length >= 2
    ? codes.filter((c) => {
        const q = query.toLowerCase();
        return c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      }).slice(0, 8)
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  const handleSelect = (code: MedicalCode) => {
    const full = `${code.code}`;
    setQuery(full);
    onChange(full);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        value={query}
        onChange={handleInputChange}
        onFocus={() => matches.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && matches.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-md overflow-hidden">
          {matches.map((code) => (
            <button
              key={code.code}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleSelect(code); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-baseline gap-2"
            >
              <span className="font-mono text-xs text-muted-foreground shrink-0">{code.code}</span>
              <span className="text-foreground truncate">{code.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
