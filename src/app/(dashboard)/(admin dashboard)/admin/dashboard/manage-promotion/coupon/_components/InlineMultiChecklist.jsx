"use client";

import * as React from "react";
import clsx from "clsx";

/**
 * Simple, rock-solid multi checklist:
 * - fixed height with overflow-y to avoid overlap
 * - native input checkboxes to avoid update-depth issues
 */
export default function InlineMultiChecklist({
  idPrefix,
  options = [], // [{ value, label }]
  selected = [], // array of string ids
  onChange, // (next: string[]) => void
  disabled = false,
  loading = false,
  heightClass = "h-56", // Tailwind height; ex: h-56 (~224px)
  className,
}) {
  const toggle = (val) => {
    if (!onChange || disabled) return;
    const key = String(val);
    const set = new Set(selected.map(String));
    if (set.has(key)) set.delete(key);
    else set.add(key);
    onChange(Array.from(set));
  };

  return (
    <div
      className={clsx(
        "rounded-lg border bg-background",
        disabled && "opacity-60 pointer-events-none",
        className
      )}
    >
      <div className={clsx("w-full overflow-y-auto p-3", heightClass)}>
        {loading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">
            Loading…
          </div>
        ) : options.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">
            No items.
          </div>
        ) : (
          <ul className="space-y-2">
            {options.map((opt) => {
              const value = String(opt.value);
              const id = `${idPrefix}-${value}`;
              const checked = selected.includes(value);
              return (
                <li key={value} className="flex items-center gap-2">
                  <input
                    id={id}
                    type="checkbox"
                    className="h-4 w-4 accent-yellow-500"
                    checked={checked}
                    onChange={() => toggle(value)}
                  />
                  <label
                    htmlFor={id}
                    className="text-sm cursor-pointer select-none truncate"
                  >
                    {opt.label ?? value}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
