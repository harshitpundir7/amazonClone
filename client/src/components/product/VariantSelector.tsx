'use client';

import React, { useMemo } from 'react';
import type { ProductVariant, VariantAttribute } from '@/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

interface AttributeGroup {
  attributeName: string;
  options: { value: string; variant: ProductVariant }[];
  selectedValue: string | null;
}

function groupAttributes(variants: ProductVariant[], selectedVariant: ProductVariant | null): AttributeGroup[] {
  const groupMap = new Map<string, Map<string, ProductVariant>>();

  for (const variant of variants) {
    if (!variant.isActive || !variant.attributes) continue;
    for (const attr of variant.attributes) {
      if (!groupMap.has(attr.attributeName)) {
        groupMap.set(attr.attributeName, new Map());
      }
      groupMap.get(attr.attributeName)!.set(attr.attributeValue, variant);
    }
  }

  const groups: AttributeGroup[] = [];
  for (const [name, valueMap] of groupMap) {
    const options: { value: string; variant: ProductVariant }[] = [];
    let selectedValue: string | null = null;

    for (const [value, variant] of valueMap) {
      options.push({ value, variant });
      if (selectedVariant?.id === variant.id) {
        // Find the matching attribute value for the selected variant
        const matchAttr = variant.attributes?.find(
          (a: VariantAttribute) => a.attributeName === name
        );
        if (matchAttr) {
          selectedValue = matchAttr.attributeValue;
        }
      }
    }

    groups.push({ attributeName: name, options, selectedValue });
  }

  return groups;
}

function isColorAttribute(name: string): boolean {
  const lower = name.toLowerCase();
  return lower === 'color' || lower === 'colour';
}

function shouldUseDropdown(optionCount: number, attrName: string): boolean {
  return optionCount > 6 || attrName.toLowerCase() === 'storage';
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  const groups = useMemo(
    () => groupAttributes(variants, selectedVariant),
    [variants, selectedVariant]
  );

  if (groups.length === 0) return null;

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isColor = isColorAttribute(group.attributeName);

        return (
          <div key={group.attributeName}>
            {/* Label */}
            <div className="text-[14px] font-bold text-amzn-text-primary mb-1.5">
              {group.attributeName}:
              {group.selectedValue && (
                <span className="font-normal ml-1">{group.selectedValue}</span>
              )}
            </div>

            {/* Color swatches */}
            {isColor && (
              <div className="flex flex-wrap gap-2">
                {group.options.map(({ value, variant }) => {
                  const isSelected = group.selectedValue === value;
                  return (
                    <button
                      key={value}
                      onClick={() => onSelect(variant)}
                      title={value}
                      className={`
                        w-[40px] h-[40px] rounded-full border-2 transition-all
                        ${isSelected
                          ? 'border-amzn-teal ring-2 ring-amzn-teal/30'
                          : 'border-transparent hover:border-amzn-teal-hover'
                        }
                      `}
                      style={{ backgroundColor: value.toLowerCase() }}
                    >
                      <span className="sr-only">{value}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Dropdown for many options / storage */}
            {!isColor && shouldUseDropdown(group.options.length, group.attributeName) && (
              <select
                value={group.selectedValue || ''}
                onChange={(e) => {
                  const opt = group.options.find((o) => o.value === e.target.value);
                  if (opt) onSelect(opt.variant);
                }}
                className="h-8 rounded-amzn-lg border border-amzn-input-border bg-amzn-input-bg px-3 text-[14px] text-amzn-text-primary outline-none cursor-pointer focus:border-amzn-input-focus focus:shadow-amzn-form-focus min-w-[200px]"
              >
                <option value="" disabled>
                  Select {group.attributeName}
                </option>
                {group.options.map(({ value }) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            )}

            {/* Size pills */}
            {!isColor && !shouldUseDropdown(group.options.length, group.attributeName) && (
              <div className="flex flex-wrap gap-2">
                {group.options.map(({ value, variant }) => {
                  const isSelected = group.selectedValue === value;
                  return (
                    <button
                      key={value}
                      onClick={() => onSelect(variant)}
                      className={`
                        min-w-[48px] h-8 px-3 rounded-amzn-lg text-[14px] text-amzn-text-primary transition-colors cursor-pointer
                        ${isSelected
                          ? 'border-2 border-amzn-teal bg-amzn-input-bg font-medium'
                          : 'border border-amzn-input-border bg-white hover:border-amzn-cart-btn-border'
                        }
                      `}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
