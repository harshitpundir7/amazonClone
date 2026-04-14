'use client';

import React from 'react';
import { SORT_OPTIONS } from '@/lib/constants';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] text-amzn-text-primary font-bold">Sort by:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-amzn-lg bg-amzn-input-bg border border-amzn-input-border text-xs text-amzn-text-primary px-2 outline-none cursor-pointer focus:border-amzn-input-focus focus:shadow-amzn-form-focus"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
