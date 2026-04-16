"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

interface Language {
  code: string;
  nativeName: string;
  englishName: string;
}

const languages: Language[] = [
  { code: "en", nativeName: "English", englishName: "English" },
  { code: "hi", nativeName: "\u0939\u093f\u0928\u094d\u0926\u0940", englishName: "Hindi" },
  { code: "bn", nativeName: "\u09ac\u09be\u0982\u09b2\u09be", englishName: "Bengali" },
  { code: "te", nativeName: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41", englishName: "Telugu" },
  { code: "mr", nativeName: "\u092e\u0930\u093e\u0920\u0940", englishName: "Marathi" },
  { code: "ta", nativeName: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", englishName: "Tamil" },
  { code: "ur", nativeName: "\u0627\u0631\u062f\u0648", englishName: "Urdu" },
  { code: "gu", nativeName: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0", englishName: "Gujarati" },
];

interface LanguageSelectorProps {}

export default function LanguageSelector(_props: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [open, setOpen] = useState(false);

  const handleSelect = (lang: Language) => {
    setSelectedLanguage(lang.code);
    toast(`Language changed to ${lang.englishName}`);
    setOpen(false);
  };

  const selectedLang = languages.find((l) => l.code === selectedLanguage);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 border border-transparent hover:border-white rounded-sm px-2 py-1.5 cursor-pointer transition-colors bg-transparent">
        {/* Simple flag SVG */}
        <svg
          width="20"
          height="14"
          viewBox="0 0 20 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Indian flag: saffron, white with blue chakra, green */}
          <rect x="0" y="0" width="20" height="4.67" fill="#FF9933" />
          <rect x="0" y="4.67" width="20" height="4.67" fill="#FFFFFF" />
          <rect x="0" y="9.33" width="20" height="4.67" fill="#138808" />
          {/* Ashoka Chakra simplified */}
          <circle cx="10" cy="7" r="1.8" stroke="#000080" strokeWidth="0.5" fill="none" />
        </svg>

        <span className="text-[14px] font-bold text-white">
          {selectedLang?.code.toUpperCase() || "EN"}
        </span>

        {/* Chevron down */}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path d="M0 0l5 6 5-6H0z" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1 w-[260px] rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 cursor-pointer bg-transparent border-none"
              >
                {/* Radio circle */}
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    selectedLanguage === lang.code
                      ? "border-amzn-orange"
                      : "border-gray-400"
                  }`}
                >
                  {selectedLanguage === lang.code && (
                    <span className="block h-2 w-2 rounded-full bg-amzn-orange" />
                  )}
                </span>

                {/* Language name in native script */}
                <span
                  className={`text-[14px] ${
                    selectedLanguage === lang.code
                      ? "font-bold text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  {lang.nativeName}
                </span>

                {/* Language name in English */}
                <span
                  className={`text-[12px] ${
                    selectedLanguage === lang.code
                      ? "text-gray-600"
                      : "text-gray-500"
                  }`}
                >
                  {lang.englishName}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
