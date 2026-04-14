# Amazon Clone - E-Commerce Platform

A fullstack Amazon-clone e-commerce application built with Next.js, Express.js, PostgreSQL, and Docker.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS with custom Amazon design tokens |
| State Management | Zustand with localStorage persistence |
| Backend | Express.js, TypeScript |
| ORM | Prisma |
| Database | PostgreSQL 16 |
| Validation | Zod (shared between frontend & backend) |
| Authentication | JWT (JSON Web Tokens) |
| Containerization | Docker + Docker Compose |

## Features

### Core Features (Must Have)
- **Product Listing Page** — Grid layout matching Amazon's design, search, category filtering, sort
- **Product Detail Page** — Image gallery with thumbnails, variant selectors (color/size/storage), specifications table, reviews
- **Shopping Cart** — Add/remove/update items, quantity management, cart summary with subtotal
- **Order Placement** — Multi-step checkout (address → payment → review), order confirmation

### Bonus Features
- Responsive design (mobile, tablet, desktop)
- User authentication (Login/Signup with JWT)
- Order history — view past orders with details
- Wishlist functionality
- Amazon-accurate UI/UX (colors, typography, spacing, hover states)

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git

### Run with Docker Compose

```bash
# Clone the repository
git clone <your-repo-url>
cd amazon-clone

# Start all services (PostgreSQL + Backend + Frontend)
docker compose up --build

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# Database: localhost:5432
```

The first run will:
1. Start PostgreSQL
2. Run Prisma migrations (create tables)
3. Seed the database with sample data
4. Start the Express.js backend
5. Start the Next.js frontend

### Run Locally (without Docker)

```bash
# Start PostgreSQL and create database
createdb amazon_clone

# Backend setup
cd server
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

# Frontend setup (in another terminal)
cd client
npm install
cp .env.example .env.local
npm run dev
```

## Database Schema

The application uses a 14-table PostgreSQL schema designed for e-commerce:

| Table | Purpose |
|-------|---------|
| `users` | Customer accounts with email/password |
| `addresses` | Multi-address per user with is_default flag |
| `categories` | Hierarchical product taxonomy (self-referencing FK) |
| `brands` | Product brands |
| `products` | Main catalog with denormalized ratings/sales |
| `product_variants` | SKU-level variants with price overrides & stock |
| `variant_attributes` | Flexible EAV for Color/Size/Storage |
| `product_images` | Multiple images per product with sort order |
| `product_specifications` | Grouped key-value spec pairs |
| `product_categories` | Multi-category mapping (primary + secondary) |
| `cart_items` | Shopping cart with unique constraint per user+product+variant |
| `orders` | Orders with address snapshot & payment info |
| `order_items` | Line items with price/name/image snapshots |
| `product_reviews` | 1-5 star ratings with verified purchase flag |
| `wishlist_items` | Saved-for-later products |

### Key Design Decisions
- **Address snapshots**: Orders store shipping address as flat columns (not FK) so historical data is preserved even if user edits their address
- **Price snapshots**: Order items store unit_price at time of purchase
- **Denormalized aggregates**: `avg_rating`, `review_count`, `total_sold` on products table for read performance
- **Variant price overrides**: Variants can override product base_price or use it as default
- **Proper ON DELETE behaviors**: RESTRICT on orders/products (audit trail), CASCADE on dependent data, SET NULL on nullable references

## API Endpoints

### Products
- `GET /api/products` — List products (paginated, filterable by category/price/sort)
- `GET /api/products/featured` — Featured products for homepage
- `GET /api/products/search?q=&category=&minPrice=&maxPrice=&sort=&page=&limit=` — Search with filters
- `GET /api/products/:id` — Full product detail with images, variants, specs, reviews

### Categories
- `GET /api/categories` — Category tree
- `GET /api/categories/:slug` — Category detail with product count

### Cart
- `GET /api/cart` — User's cart with product details
- `POST /api/cart/items` — Add item `{ productId, variantId?, quantity }`
- `PUT /api/cart/items/:id` — Update quantity `{ quantity }`
- `DELETE /api/cart/items/:id` — Remove item
- `DELETE /api/cart` — Clear cart

### Orders
- `POST /api/orders` — Place order `{ shippingAddress, paymentMethod }`
- `GET /api/orders` — User's order list
- `GET /api/orders/:id` — Order detail with items

### Reviews
- `GET /api/products/:productId/reviews` — Product reviews (paginated)
- `POST /api/products/:productId/reviews` — Create review (auth required)

### Wishlist
- `GET /api/wishlist` — User's wishlist
- `POST /api/wishlist/:productId` — Add to wishlist
- `DELETE /api/wishlist/:productId` — Remove from wishlist

### Auth
- `POST /api/auth/register` — Register `{ name, email, password }`
- `POST /api/auth/login` — Login `{ email, password }` → returns JWT
- `GET /api/auth/me` — Current user profile (auth required)

## Project Structure

```
amazon-clone/
├── client/                    # Next.js 14 frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components (ui/, layout/, product/, cart/, etc.)
│   │   ├── lib/               # API client, utilities, constants
│   │   ├── store/             # Zustand stores (cart, auth, wishlist)
│   │   └── types/             # TypeScript interfaces
│   └── tailwind.config.ts     # Custom Amazon design tokens
│
├── server/                    # Express.js backend
│   ├── src/
│   │   ├── config/            # Database, env config
│   │   ├── middleware/        # CORS, auth, validation, error handler
│   │   ├── modules/           # Feature modules (product, cart, order, etc.)
│   │   └── utils/             # API response, pagination helpers
│   └── prisma/
│       ├── schema.prisma      # Database schema
│       └── seed.ts            # Sample data (30 products, 12 categories)
│
└── docker-compose.yml         # PostgreSQL + Backend + Frontend
```

## Assumptions

1. **Default user**: The system assumes user ID 1 is logged in by default for the "no login required" flow. Cart and orders work without authentication using this default user.
2. **INR pricing**: All prices are in Indian Rupees (₹) with realistic Indian e-commerce pricing patterns.
3. **Product images**: Use placeholder images from picsum.photos during development. In production, these would be replaced with actual product images.
4. **Payment**: Only Cash on Delivery (COD) is fully simulated. Card/UPI options are presented but don't process real payments.
5. **Free shipping**: Orders over ₹499 get free shipping, otherwise ₹49 shipping fee is applied.
6. **Tax**: 18% GST is calculated on the order total.

## License

MIT
