'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Address, ShippingAddress } from '@/types';

const addressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'Enter a valid phone number').max(15, 'Enter a valid phone number'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(5, 'Enter a valid PIN code').max(10, 'Enter a valid PIN code'),
  country: z.string().min(1, 'Country is required'),
});

interface AddressFormProps {
  onSubmit: (data: ShippingAddress) => void;
  initialData?: Address;
  loading?: boolean;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
];

const COUNTRIES = ['India'];

export default function AddressForm({ onSubmit, initialData, loading = false }: AddressFormProps) {
  const [form, setForm] = useState({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'India',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addressSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    onSubmit(result.data as ShippingAddress);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Country/Region */}
      <div className="flex flex-col gap-1">
        <label className="text-[13px] font-bold text-amzn-text-primary">Country/Region</label>
        <select
          value={form.country}
          onChange={(e) => handleChange('country', e.target.value)}
          className="h-[34px] w-full rounded-amzn-sm border border-amzn-input-border px-3 text-[14px] text-amzn-text-primary outline-none focus:border-amzn-input-focus focus:shadow-amzn-form-focus bg-white"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.country && <span className="text-[12px] text-amzn-error">{errors.country}</span>}
      </div>

      {/* Full Name */}
      <Input
        label="Full Name"
        value={form.fullName}
        onChange={(e) => handleChange('fullName', e.target.value)}
        error={errors.fullName}
        placeholder="First and last name"
      />

      {/* Phone Number */}
      <Input
        label="Phone Number"
        value={form.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={errors.phone}
        placeholder="Mobile number"
        type="tel"
      />

      {/* Address Line 1 */}
      <Input
        label="Address"
        value={form.addressLine1}
        onChange={(e) => handleChange('addressLine1', e.target.value)}
        error={errors.addressLine1}
        placeholder="Street address, P.O. box"
      />

      {/* Address Line 2 */}
      <Input
        label="Apartment, suite, etc. (optional)"
        value={form.addressLine2}
        onChange={(e) => handleChange('addressLine2', e.target.value)}
        error={errors.addressLine2}
        placeholder="Apt, suite, unit, building, floor, etc."
      />

      {/* City + State */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="City"
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            error={errors.city}
            placeholder="City"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold text-amzn-text-primary">State</label>
            <select
              value={form.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="h-[34px] w-full rounded-amzn-sm border border-amzn-input-border px-3 text-[14px] text-amzn-text-primary outline-none focus:border-amzn-input-focus focus:shadow-amzn-form-focus bg-white"
            >
              <option value="">Select a state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.state && <span className="text-[12px] text-amzn-error">{errors.state}</span>}
          </div>
        </div>
      </div>

      {/* PIN Code */}
      <div className="w-1/4">
        <Input
          label="PIN Code"
          value={form.postalCode}
          onChange={(e) => handleChange('postalCode', e.target.value)}
          error={errors.postalCode}
          placeholder="PIN code"
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button type="submit" fullWidth size="sm" className="h-10" loading={loading}>
          Deliver to this address
        </Button>
      </div>
    </form>
  );
}
