import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amzn: {
          'dark-nav': '#131921',
          'sub-nav': '#232f3e',
          gold: '#febd69',
          'gold-hover': '#f3a847',
          orange: '#e47911',
          teal: '#007185',
          'teal-hover': '#c7511f',
          red: '#b12704',
          'cart-btn': '#ffd814',
          'cart-btn-hover': '#f7ca00',
          'cart-btn-border': '#a88734',
          'buy-btn': '#ffa41c',
          'buy-btn-hover': '#fa8900',
          'buy-btn-border': '#97762e',
          'bg-primary': '#ffffff',
          'bg-secondary': '#eaeded',
          'bg-tertiary': '#f5f5f5',
          'text-primary': '#0f1111',
          'text-secondary': '#565959',
          'text-tertiary': '#767676',
          'border-primary': '#dddddd',
          'border-secondary': '#e7e7e7',
          prime: '#00a8e1',
          success: '#007600',
          warning: '#c45500',
          star: '#de7921',
          'star-empty': '#dddddd',
          'back-to-top': '#37475a',
          'input-focus': '#e77600',
          'input-border': '#a6a6a6',
          'input-bg': '#f0f2f2',
          'error': '#c40000',
        },
      },
      fontFamily: {
        amzn: ['"Amazon Ember"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        'amzn-container': '1500px',
      },
      borderRadius: {
        'amzn-xs': '2px',
        'amzn-sm': '3px',
        'amzn-md': '4px',
        'amzn-lg': '8px',
      },
      boxShadow: {
        'amzn-sm': '0 1px 3px rgba(0,0,0,0.08)',
        'amzn-md': '0 2px 8px rgba(0,0,0,0.15)',
        'amzn-lg': '0 10px 40px rgba(0,0,0,0.2)',
        'amzn-input-focus': '0 0 0 3px #f3a847 inset',
        'amzn-form-focus': '0 0 3px rgba(228,121,17,0.15)',
      },
      spacing: {
        'nav-height': '60px',
        'subnav-height': '40px',
        'nav-total': '100px',
      },
    },
  },
  plugins: [],
};

export default config;
