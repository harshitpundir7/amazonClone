'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { num: 1, label: 'Shipping' },
  { num: 2, label: 'Payment' },
  { num: 3, label: 'Review' },
];

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center gap-0 py-4">
      {STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.num;
        const isActive = currentStep === step.num;

        return (
          <React.Fragment key={step.num}>
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-colors ${
                  isCompleted
                    ? 'bg-amzn-success border-amzn-success text-white'
                    : isActive
                      ? 'border-amzn-input-focus text-amzn-input-focus'
                      : 'border-amzn-border-primary text-amzn-text-tertiary'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.num}
              </div>
              <span
                className={`text-[14px] ${
                  isActive
                    ? 'font-bold text-amzn-input-focus'
                    : isCompleted
                      ? 'font-bold text-amzn-success'
                      : 'text-amzn-text-tertiary'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 rounded transition-colors ${
                  isCompleted ? 'bg-amzn-success' : 'bg-amzn-border-primary'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
