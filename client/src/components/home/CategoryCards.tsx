'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryCardsProps {
  categories: Category[];
  loading?: boolean;
}

/* ───── Hard-coded card data (Amazon-style content rows) ───── */

interface QuadItem {
  img: string;
  label: string;
  href: string;
}

interface CardData {
  type: 'quad' | 'single-thumbs';
  title: string;
  link: string;
  linkHref: string;
  items?: QuadItem[];
  mainImg?: string;
  thumbs?: string[];
  price?: string;
  ogPrice?: string;
}

const ROW_1_CARDS: CardData[] = [
  {
    type: 'quad',
    title: 'Appliances for your home | Up to 55% off',
    link: 'See more',
    linkHref: '/category/electronics',
    items: [
      { img: 'https://images.unsplash.com/photo-1570222020676-d0dfbd6060ff?w=300', label: 'Air conditioners', href: '/category/electronics' },
      { img: 'https://images.unsplash.com/photo-1571175432247-ca63895e7992?w=300', label: 'Refrigerators', href: '/category/electronics' },
      { img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300', label: 'Microwaves', href: '/category/electronics' },
      { img: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=300', label: 'Washing machines', href: '/category/electronics' },
    ],
  },
  {
    type: 'quad',
    title: 'Revamp your home in style',
    link: 'Explore all',
    linkHref: '/category/home-kitchen',
    items: [
      { img: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=300', label: 'Cushion covers & bedsheets', href: '/category/home-kitchen' },
      { img: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=300', label: 'Figurines, vases & more', href: '/category/home-kitchen' },
      { img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300', label: 'Home storage', href: '/category/home-kitchen' },
      { img: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab793?w=300', label: 'Lighting solutions', href: '/category/home-kitchen' },
    ],
  },
  {
    type: 'quad',
    title: 'Up to 45% off | Laptops, monitors & more',
    link: 'See more',
    linkHref: '/category/electronics',
    items: [
      { img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300', label: 'Up to 45% off | Laptops', href: '/category/electronics' },
      { img: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=300', label: 'Up to 60% off | Kitchen', href: '/category/home-kitchen' },
      { img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300', label: 'Min. 50% off | Office', href: '/category/electronics' },
      { img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300', label: 'Smart devices', href: '/category/electronics' },
    ],
  },
  {
    type: 'quad',
    title: 'Starting ₹49 | Deals on home essentials',
    link: 'Explore all',
    linkHref: '/category/home-kitchen',
    items: [
      { img: 'https://images.unsplash.com/photo-1528740561666-dc2479da08ad?w=300', label: 'Cleaning supplies', href: '/category/home-kitchen' },
      { img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300', label: 'Bathroom accessories', href: '/category/home-kitchen' },
      { img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300', label: 'Home tools', href: '/category/home-kitchen' },
      { img: 'https://images.unsplash.com/photo-1514811501132-28a644405531?w=300', label: 'Wallpapers & decor', href: '/category/home-kitchen' },
    ],
  },
];

const ROW_2_CARDS: CardData[] = [
  {
    type: 'quad',
    title: "Customers' Most-Loved Fashion for you",
    link: 'Explore more',
    linkHref: '/category/clothing',
    items: [
      { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300', label: 'Women Fashion', href: '/category/clothing' },
      { img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300', label: 'Men Fashion', href: '/category/clothing' },
      { img: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=300', label: 'Kids Fashion', href: '/category/clothing' },
      { img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=300', label: 'Accessories', href: '/category/clothing' },
    ],
  },
  {
    type: 'single-thumbs',
    title: 'Up to 60% off | Cool comfort at every corner',
    link: 'See all offers',
    linkHref: '/category/home-kitchen',
    price: '3,492',
    ogPrice: '8,000',
    mainImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500',
    thumbs: [
      'https://images.unsplash.com/photo-1618221735421-4f99581a62d4?w=400',
      'https://images.unsplash.com/photo-1586023494544-7f41508db83e?w=400',
      'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=400',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400',
    ],
  },
  {
    type: 'single-thumbs',
    title: 'Up to 50% off | Deals on home decor',
    link: 'Shop now',
    linkHref: '/category/home-kitchen',
    price: '2,499',
    ogPrice: '6,000',
    mainImg: 'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=500',
    thumbs: [
      'https://images.unsplash.com/photo-1516516628854-d30555f30894?w=400',
      'https://images.unsplash.com/photo-1594895666320-96f7e44a03ee?w=400',
      'https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=400',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400',
    ],
  },
  {
    type: 'single-thumbs',
    title: 'Up to 60% off | Best offers on kitchen products',
    link: 'See all offers',
    linkHref: '/category/home-kitchen',
    price: '1,299',
    ogPrice: '3,500',
    mainImg: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500',
    thumbs: [
      'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=400',
      'https://images.unsplash.com/photo-1556912998-c57cc6b71821?w=400',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400',
    ],
  },
];

const ROW_3_CARDS: CardData[] = [
  {
    type: 'single-thumbs',
    title: 'Starting ₹299 | Trending kitchen essentials',
    link: 'Shop now',
    linkHref: '/category/home-kitchen',
    price: '4,499',
    ogPrice: '12,000',
    mainImg: 'https://images.unsplash.com/photo-1556910602-3884ee9ad327?w=500',
    thumbs: [
      'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=400',
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400',
      'https://images.unsplash.com/photo-1547471080-7cc20320ee1e?w=400',
      'https://images.unsplash.com/photo-1563177404-9b2dca91fa6c?w=400',
    ],
  },
  {
    type: 'quad',
    title: 'Best Sellers in Beauty',
    link: 'See more',
    linkHref: '/category/electronics',
    items: [
      { img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300', label: 'Lipsticks', href: '/category/electronics' },
      { img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300', label: 'Face Wash', href: '/category/electronics' },
      { img: 'https://images.unsplash.com/photo-1571781564287-321153a5cce4?w=300', label: 'Skincare', href: '/category/electronics' },
      { img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300', label: 'Serums', href: '/category/electronics' },
    ],
  },
  {
    type: 'single-thumbs',
    title: 'Min. 25% off | Trending & small decor',
    link: 'See all offers',
    linkHref: '/category/home-kitchen',
    price: '899',
    ogPrice: '2,500',
    mainImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    thumbs: [
      'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=400',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400',
      'https://images.unsplash.com/photo-1594913366159-1832cdcbe0c1?w=400',
    ],
  },
  {
    type: 'single-thumbs',
    title: 'Min. 50% off | Top deals from Small Businesses',
    link: 'See all deals',
    linkHref: '/category/electronics',
    price: '450',
    ogPrice: '1,200',
    mainImg: 'https://images.unsplash.com/photo-1490212000085-f2603837e226?w=500',
    thumbs: [
      'https://images.unsplash.com/photo-1490212000085-f2603837e226?w=400',
      'https://images.unsplash.com/photo-1459749411177-042180ec75c0?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1524168204150-6226fd722bac?w=400',
    ],
  },
];

/* ───── Sub-components ───── */

function QuadCard({ card }: { card: CardData }) {
  return (
    <div className="bg-white p-5 flex flex-col min-h-[420px] max-h-[420px] shadow-sm z-30 relative overflow-hidden">
      <h2 className="text-[21px] font-extrabold text-amzn-text-primary mb-2.5 leading-[1.2] min-h-[50px]">
        {card.title}
      </h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1 mb-4">
        {card.items?.map((item, i) => (
          <Link key={i} href={item.href} className="flex flex-col group/sub">
            <img
              src={item.img}
              alt={item.label}
              className="w-full h-[110px] object-cover mb-1 bg-[#f3f4f6] group-hover/sub:opacity-80 transition-opacity"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200';
              }}
            />
            <span className="text-[12px] text-amzn-text-primary no-underline line-clamp-1 group-hover/sub:underline">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href={card.linkHref}
        className="text-[13px] text-amzn-teal no-underline hover:text-amzn-teal-hover hover:underline mt-auto"
      >
        {card.link}
      </Link>
    </div>
  );
}

function SingleThumbsCard({ card }: { card: CardData }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="bg-white p-5 flex flex-col min-h-[420px] max-h-[420px] shadow-sm z-30 relative overflow-hidden">
      <h2 className="text-[21px] font-extrabold text-amzn-text-primary mb-2.5 leading-[1.2] min-h-[50px]">
        {card.title}
      </h2>

      <div className="flex-1 mb-4 flex flex-col justify-between">
        <Link href={card.linkHref} className="flex-1 flex flex-col bg-white mb-2 overflow-hidden no-underline">
          <img
            src={card.thumbs ? card.thumbs[selectedIdx] : card.mainImg}
            alt={card.title}
            className="max-h-[180px] w-full object-contain mb-2 transition-opacity duration-200"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400';
            }}
          />
          {card.price ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="bg-[#cc0c39] text-white text-[12px] px-1.5 py-0.5 rounded-[2px] font-bold">
                  ₹{card.price}
                </span>
                <span className="text-[#cc0c39] text-[12px] font-bold">Deal of the Day</span>
              </div>
              <div className="text-[12px] text-amzn-text-secondary mt-0.5">
                M.R.P:{' '}
                <span className="line-through text-amzn-text-secondary">₹{card.ogPrice}</span>
              </div>
            </div>
          ) : (
            <div className="text-[14px] text-amzn-text-primary line-clamp-2">
              Premium quality selection curated just for you.
            </div>
          )}
        </Link>

        {card.thumbs && (
          <div className="grid grid-cols-4 gap-2 h-[60px] mt-2">
            {card.thumbs.map((thumb, i) => (
              <div
                key={i}
                onMouseEnter={() => setSelectedIdx(i)}
                className={`p-0.5 border rounded-[2px] cursor-pointer transition-all ${
                  i === selectedIdx
                    ? 'border-[#007185] shadow-[0_0_2px_#007185]'
                    : 'border-amzn-border-primary hover:border-[#888]'
                }`}
              >
                <img
                  src={thumb}
                  alt=""
                  className="w-full h-full object-cover rounded-[1px]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=80';
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        href={card.linkHref}
        className="text-[13px] text-amzn-teal no-underline hover:text-amzn-teal-hover hover:underline mt-auto"
      >
        {card.link}
      </Link>
    </div>
  );
}

function GridCard({ card }: { card: CardData }) {
  if (card.type === 'single-thumbs') return <SingleThumbsCard card={card} />;
  return <QuadCard card={card} />;
}

function CardGridRow({ cards, isFirstRow }: { cards: CardData[]; isFirstRow?: boolean }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 max-w-amzn-container mx-auto px-4 z-30 relative ${
        isFirstRow ? '-mt-8 md:-mt-16 lg:-mt-24' : ''
      }`}
    >
      {cards.map((card, idx) => (
        <GridCard key={idx} card={card} />
      ))}
    </div>
  );
}

/* ───── Loading skeleton ───── */

function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      {[0, 1].map((row) => (
        <div
          key={row}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 max-w-amzn-container mx-auto px-4 -mt-8 relative z-10"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-5 min-h-[420px] max-h-[420px] flex flex-col animate-pulse">
              <div className="h-7 w-3/4 bg-amzn-border-secondary rounded mb-4" />
              <div className="grid grid-cols-2 gap-4 flex-1">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex flex-col">
                    <div className="w-full h-[110px] bg-amzn-border-secondary rounded" />
                    <div className="h-3 w-16 bg-amzn-border-secondary rounded mt-2" />
                  </div>
                ))}
              </div>
              <div className="h-4 w-24 bg-amzn-border-secondary rounded mt-3" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ───── Main exported component ───── */

export default function CategoryCards({ categories, loading }: CategoryCardsProps) {
  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-5">
      <CardGridRow cards={ROW_1_CARDS} isFirstRow />
      <CardGridRow cards={ROW_2_CARDS} />
      <CardGridRow cards={ROW_3_CARDS} />
    </div>
  );
}
