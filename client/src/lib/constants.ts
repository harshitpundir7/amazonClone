// Amazon Clone Constants

export const DEFAULT_USER_ID = 1;

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'bestselling', label: 'Best Selling' },
] as const;

export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 & Above', min: 25000, max: undefined },
] as const;

export const CATEGORY_NAV_LINKS = [
  "Today's Deals",
  'Customer Service',
  'Registry',
  'Gift Cards',
  'Sell',
] as const;

export const FOOTER_COLUMNS = [
  {
    title: 'Get to Know Us',
    links: [
      { label: 'About Amazon', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press Releases', href: '#' },
      { label: 'Amazon Science', href: '#' },
    ],
  },
  {
    title: 'Connect with Us',
    links: [
      { label: 'Facebook', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'Instagram', href: '#' },
    ],
  },
  {
    title: 'Make Money with Us',
    links: [
      { label: 'Sell on Amazon', href: '#' },
      { label: 'Sell under Amazon Brand', href: '#' },
      { label: 'Become an Affiliate', href: '#' },
      { label: 'Advertise Your Products', href: '#' },
    ],
  },
  {
    title: 'Let Us Help You',
    links: [
      { label: 'Your Account', href: '/account' },
      { label: 'Your Orders', href: '/orders' },
      { label: 'Returns Centre', href: '/orders' },
      { label: 'Your Wishlist', href: '/wishlist' },
      { label: 'Customer Service', href: '#' },
      { label: 'Help', href: '#' },
    ],
  },
] as const;
