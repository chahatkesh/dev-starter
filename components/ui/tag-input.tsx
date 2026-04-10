"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Input } from "./input";

interface Tag {
  id: string;
  name: string;
}

interface TagInputProps {
  tags: Tag[];
  suggestions?: Tag[];
  onAdd: (tag: Tag) => void;
  onRemove: (tagId: string) => void;
  placeholder?: string;
  className?: string;
  onInputChange?: (value: string) => void;
}

export function TagInput({
  tags,
  suggestions = [],
  onAdd,
  onRemove,
  placeholder = "Type to add...",
  className,
  onInputChange,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (s) => !tags.find((t) => t.id === s.id),
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    setShowSuggestions(value.length > 0);
    onInputChange?.(value);
  };

  const handleAdd = (tag: Tag) => {
    onAdd(tag);
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && filteredSuggestions.length > 0) {
      e.preventDefault();
      handleAdd(filteredSuggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => input && setShowSuggestions(true)}
            placeholder={placeholder}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-[100] w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleAdd(suggestion)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors",
                    index === selectedIndex && "bg-accent",
                  )}
                >
                  <div className="font-medium">{suggestion.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="gap-1">
                {tag.name}
                <button
                  type="button"
                  onClick={() => onRemove(tag.id)}
                  className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
