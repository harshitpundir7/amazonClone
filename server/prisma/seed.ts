import { PrismaClient, OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

const prisma = new PrismaClient();

const PASSWORD_HASH = "$2b$10$dummyHashForDevelopmentPurposesOnly";

async function main() {
  await prisma.$transaction(
    async (tx) => {
      // ─── DELETE existing data in reverse dependency order ──────────────
      await tx.orderItem.deleteMany();
      await tx.order.deleteMany();
      await tx.cartItem.deleteMany();
      await tx.wishlistItem.deleteMany();
      await tx.productReview.deleteMany();
      await tx.productCategory.deleteMany();
      await tx.variantAttribute.deleteMany();
      await tx.productImage.deleteMany();
      await tx.productSpecification.deleteMany();
      await tx.productVariant.deleteMany();
      await tx.product.deleteMany();
      await tx.brand.deleteMany();
      await tx.category.deleteMany();
      await tx.address.deleteMany();
      await tx.user.deleteMany();

      // ─── USERS ──────────────────────────────────────────────────────────
      await tx.user.createMany({
        data: [
          {
            id: 1,
            name: "Default User",
            email: "default@example.com",
            passwordHash: PASSWORD_HASH,
            phone: "9876543210",
          },
          {
            id: 2,
            name: "Jane Doe",
            email: "jane@example.com",
            passwordHash: PASSWORD_HASH,
            phone: "9123456789",
          },
        ],
      });

      // ─── ADDRESSES ──────────────────────────────────────────────────────
      await tx.address.createMany({
        data: [
          {
            id: 1,
            userId: 1,
            fullName: "Default User",
            phone: "9876543210",
            addressLine1: "42, MG Road",
            addressLine2: "Koramangala",
            city: "Bengaluru",
            state: "Karnataka",
            postalCode: "560034",
            isDefault: true,
          },
          {
            id: 2,
            userId: 1,
            fullName: "Default User",
            phone: "9876543210",
            addressLine1: "15, Sector 18",
            addressLine2: "Atta Market",
            city: "Noida",
            state: "Uttar Pradesh",
            postalCode: "201301",
            isDefault: false,
          },
        ],
      });

      // ─── CATEGORIES ─────────────────────────────────────────────────────
      await tx.category.createMany({
        data: [
          // Level 1: Top-level
          { id: 1, name: "Electronics", slug: "electronics", parentId: null, sortOrder: 1 },
          { id: 2, name: "Clothing", slug: "clothing", parentId: null, sortOrder: 2 },
          { id: 3, name: "Home & Kitchen", slug: "home-kitchen", parentId: null, sortOrder: 3 },
          { id: 4, name: "Books", slug: "books", parentId: null, sortOrder: 4 },
          // Level 2: Under Electronics
          { id: 5, name: "Smartphones", slug: "smartphones", parentId: 1, sortOrder: 1 },
          { id: 6, name: "Laptops", slug: "laptops", parentId: 1, sortOrder: 2 },
          { id: 7, name: "Headphones", slug: "headphones", parentId: 1, sortOrder: 3 },
          { id: 8, name: "Televisions", slug: "televisions", parentId: 1, sortOrder: 4 },
          // Level 2: Under Clothing
          { id: 9, name: "Men", slug: "mens-clothing", parentId: 2, sortOrder: 1 },
          { id: 10, name: "Women", slug: "womens-clothing", parentId: 2, sortOrder: 2 },
          // Level 3: Under Men
          { id: 11, name: "T-Shirts", slug: "mens-tshirts", parentId: 9, sortOrder: 1 },
          { id: 12, name: "Jeans", slug: "mens-jeans", parentId: 9, sortOrder: 2 },
        ],
      });

      // ─── BRANDS ──────────────────────────────────────────────────────────
      await tx.brand.createMany({
        data: [
          { id: 1, name: "Samsung", slug: "samsung" },
          { id: 2, name: "Apple", slug: "apple" },
          { id: 3, name: "Sony", slug: "sony" },
          { id: 4, name: "HP", slug: "hp" },
          { id: 5, name: "Levi's", slug: "levis" },
          { id: 6, name: "Nike", slug: "nike" },
          { id: 7, name: "LG", slug: "lg" },
          { id: 8, name: "OnePlus", slug: "oneplus" },
          { id: 9, name: "boAt", slug: "boat" },
          { id: 10, name: "Prestige", slug: "prestige" },
        ],
      });

      // ─── PRODUCTS ────────────────────────────────────────────────────────
      // Using nested create for products that have variants/images/specs
      // and createMany for simple products, then add relations separately.

      // Create all 30 products first
      await tx.product.createMany({
        data: [
          // Smartphones (category 5)
          {
            id: 1,
            name: "Samsung Galaxy S24 Ultra",
            slug: "samsung-galaxy-s24-ultra",
            brandId: 1,
            categoryId: 5,
            shortDesc: '6.8" Dynamic AMOLED, 200MP Camera, S Pen',
            longDesc: "<p>The Samsung Galaxy S24 Ultra features a stunning 6.8-inch Dynamic AMOLED display, a powerful 200MP camera system with 100x Space Zoom, and the iconic S Pen for productivity.</p>",
            basePrice: 129999.0,
            mrp: 144999.0,
            avgRating: 4.5,
            reviewCount: 120,
            totalSold: 500,
            isFeatured: true,
          },
          {
            id: 2,
            name: "Apple iPhone 15 Pro Max",
            slug: "apple-iphone-15-pro-max",
            brandId: 2,
            categoryId: 5,
            shortDesc: '6.7" Super Retina XDR, A17 Pro Chip, Titanium Design',
            longDesc: "<p>iPhone 15 Pro Max features a strong and light titanium design with the A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.</p>",
            basePrice: 159900.0,
            mrp: 169900.0,
            avgRating: 4.7,
            reviewCount: 200,
            totalSold: 800,
            isFeatured: true,
          },
          {
            id: 3,
            name: "OnePlus 12",
            slug: "oneplus-12",
            brandId: 8,
            categoryId: 5,
            shortDesc: '6.82" 2K LTPO Display, Snapdragon 8 Gen 3, 100W Charging',
            longDesc: "<p>The OnePlus 12 delivers flagship performance with Snapdragon 8 Gen 3, Hasselblad camera system, and ultra-fast 100W SUPERVOOC charging.</p>",
            basePrice: 64999.0,
            mrp: 69999.0,
            avgRating: 4.3,
            reviewCount: 85,
            totalSold: 350,
          },
          // Laptops (category 6)
          {
            id: 4,
            name: "HP Pavilion 15",
            slug: "hp-pavilion-15-i5",
            brandId: 4,
            categoryId: 6,
            shortDesc: '15.6" FHD, Intel Core i5-1335U, 16GB RAM, 512GB SSD',
            longDesc: "<p>HP Pavilion 15 with 12th Gen Intel Core i5, 16GB DDR4 RAM, 512GB PCIe NVMe SSD, and Intel Iris Xe graphics. Perfect for everyday productivity and entertainment.</p>",
            basePrice: 54990.0,
            mrp: 71590.0,
            avgRating: 4.1,
            reviewCount: 64,
            totalSold: 200,
          },
          {
            id: 5,
            name: "Apple MacBook Air M2",
            slug: "apple-macbook-air-m2",
            brandId: 2,
            categoryId: 6,
            shortDesc: '13.6" Liquid Retina, Apple M2 Chip, 8GB RAM, 256GB SSD',
            longDesc: "<p>MacBook Air with M2 chip is strikingly thin and brings an 8-core CPU, 10-core GPU, up to 24GB unified memory, and up to 18 hours of battery life.</p>",
            basePrice: 114900.0,
            mrp: 119900.0,
            avgRating: 4.8,
            reviewCount: 150,
            totalSold: 600,
            isFeatured: true,
          },
          // Headphones (category 7)
          {
            id: 6,
            name: "Sony WH-1000XM5",
            slug: "sony-wh-1000xm5",
            brandId: 3,
            categoryId: 7,
            shortDesc: "Industry Leading Noise Cancelling, 30hr Battery, Multi-Point",
            longDesc: "<p>Industry-leading noise cancellation with Auto NC Optimizer, crystal clear hands-free calling with 4 beamforming mics, and up to 30 hours of battery life.</p>",
            basePrice: 29990.0,
            mrp: 34990.0,
            avgRating: 4.6,
            reviewCount: 95,
            totalSold: 400,
          },
          {
            id: 7,
            name: "boAt Rockerz 551ANC",
            slug: "boat-rockerz-551anc",
            brandId: 9,
            categoryId: 7,
            shortDesc: "Active Noise Cancellation, 40mm Drivers, 100hr Battery",
            longDesc: "<p>boAt Rockerz 551ANC with Hybrid ANC, 40mm dynamic drivers, ENx Technology, and an incredible 100 hours of playback time.</p>",
            basePrice: 2499.0,
            mrp: 4490.0,
            avgRating: 3.9,
            reviewCount: 45,
            totalSold: 1500,
          },
          // Televisions (category 8)
          {
            id: 8,
            name: 'Samsung Crystal 4K 43"',
            slug: "samsung-crystal-4k-43",
            brandId: 1,
            categoryId: 8,
            shortDesc: '43" 4K UHD Smart Tizen TV, Crystal Processor 4K',
            longDesc: "<p>Samsung Crystal 4K Smart TV with Crystal Processor 4K, PurColor technology, HDR10+, and Smart Tizen OS with built-in voice assistant.</p>",
            basePrice: 31990.0,
            mrp: 45900.0,
            avgRating: 4.2,
            reviewCount: 78,
            totalSold: 250,
          },
          {
            id: 9,
            name: "LG OLED55C1",
            slug: "lg-oled-55-c1",
            brandId: 7,
            categoryId: 8,
            shortDesc: '55" 4K OLED, a9 Gen4 AI Processor, Dolby Vision & Atmos',
            longDesc: "<p>LG OLED evo C1 with self-lit OLED pixels, a9 Gen4 AI Processor 4K, Dolby Vision IQ, Dolby Atmos, and webOS smart platform.</p>",
            basePrice: 119990.0,
            mrp: 149990.0,
            avgRating: 4.7,
            reviewCount: 55,
            totalSold: 120,
            isFeatured: true,
          },
          // T-Shirts (category 11)
          {
            id: 10,
            name: "Nike Dri-FIT Running T-Shirt",
            slug: "nike-dri-fit-running-tshirt",
            brandId: 6,
            categoryId: 11,
            shortDesc: "Dri-FIT Technology, Quick-Dry, Regular Fit",
            longDesc: "<p>Nike Dri-FIT running t-shirt with moisture-wicking fabric, mesh panels for breathability, and reflective elements for visibility in low light.</p>",
            basePrice: 1295.0,
            mrp: 2495.0,
            avgRating: 4.1,
            reviewCount: 30,
            totalSold: 800,
          },
          {
            id: 11,
            name: "Levi's Original Crew T-Shirt",
            slug: "levis-original-crew-tshirt",
            brandId: 5,
            categoryId: 11,
            shortDesc: "100% Cotton, Classic Fit, Crew Neck",
            longDesc: "<p>Levi's classic crew neck t-shirt made from premium 100% cotton jersey for all-day comfort. Machine washable.</p>",
            basePrice: 799.0,
            mrp: 1499.0,
            avgRating: 3.8,
            reviewCount: 22,
            totalSold: 500,
          },
          // Jeans (category 12)
          {
            id: 12,
            name: "Levi's 511 Slim Fit Jeans",
            slug: "levis-511-slim-fit",
            brandId: 5,
            categoryId: 12,
            shortDesc: "Slim Fit, Stretch Denim, Mid Rise",
            longDesc: "<p>Levi's 511 Slim Fit jeans with stretch denim for comfort and movement. Classic mid-rise waist, slim through the hip and thigh.</p>",
            basePrice: 2799.0,
            mrp: 4599.0,
            avgRating: 4.3,
            reviewCount: 40,
            totalSold: 300,
          },
          {
            id: 13,
            name: "Nike Dri-FIT Flex Joggers",
            slug: "nike-dri-fit-flex-joggers",
            brandId: 6,
            categoryId: 12,
            shortDesc: "Dri-FIT Flex Fabric, Tapered Fit, Elastic Waistband",
            longDesc: "<p>Nike Dri-FIT Flex joggers with flexible waistband, tapered leg, and zip pockets. Perfect for training or casual wear.</p>",
            basePrice: 3495.0,
            mrp: 5495.0,
            avgRating: 4.0,
            reviewCount: 18,
            totalSold: 200,
          },
          // Home & Kitchen (category 3)
          {
            id: 14,
            name: "Prestige Popular Plus Induction Base Pressure Cooker 5L",
            slug: "prestige-popular-plus-pressure-cooker-5l",
            brandId: 10,
            categoryId: 3,
            shortDesc: "5 Litre, Induction Base, ISI Certified",
            longDesc: "<p>Prestige Popular Plus pressure cooker with induction base, safety valve, metallic safety plug, and ISI certification. Suitable for gas and induction cooktops.</p>",
            basePrice: 1699.0,
            mrp: 2655.0,
            avgRating: 4.4,
            reviewCount: 110,
            totalSold: 2000,
          },
          {
            id: 15,
            name: "Samsung 253L Frost Free Refrigerator",
            slug: "samsung-253l-frost-free-fridge",
            brandId: 1,
            categoryId: 3,
            shortDesc: "253L, Frost Free, Digital Inverter Compressor, 2 Star",
            longDesc: "<p>Samsung 253L frost free double door refrigerator with Digital Inverter Compressor, Coolpack, and All-Around Cooling for even temperature distribution.</p>",
            basePrice: 23490.0,
            mrp: 31490.0,
            avgRating: 4.1,
            reviewCount: 65,
            totalSold: 350,
          },
          // Books (category 4)
          {
            id: 16,
            name: "The Great Indian Novel",
            slug: "great-indian-novel-shashi-tharoor",
            brandId: null,
            categoryId: 4,
            shortDesc: "by Shashi Tharoor - A satirical masterpiece",
            longDesc: "<p>Shashi Tharoor's masterful satire reimagines the Mahabharata as the story of the Indian independence movement and its aftermath.</p>",
            basePrice: 399.0,
            mrp: 599.0,
            avgRating: 4.2,
            reviewCount: 35,
            totalSold: 1000,
          },
          {
            id: 17,
            name: "Sapiens: A Brief History of Humankind",
            slug: "sapiens-brief-history-yuval-noah-harari",
            brandId: null,
            categoryId: 4,
            shortDesc: "by Yuval Noah Harari - #1 International Bestseller",
            longDesc: "<p>Yuval Noah Harari explores how Homo sapiens came to dominate the world, from the cognitive revolution 70,000 years ago to the present.</p>",
            basePrice: 349.0,
            mrp: 499.0,
            avgRating: 4.6,
            reviewCount: 280,
            totalSold: 5000,
            isFeatured: true,
          },
          // More Smartphones
          {
            id: 18,
            name: "Samsung Galaxy A54 5G",
            slug: "samsung-galaxy-a54-5g",
            brandId: 1,
            categoryId: 5,
            shortDesc: '6.4" Super AMOLED, 50MP OIS Camera, 5000mAh',
            longDesc: "<p>Samsung Galaxy A54 5G with Super AMOLED display, OIS camera, and long-lasting 5000mAh battery with 25W super fast charging.</p>",
            basePrice: 38999.0,
            mrp: 44999.0,
            avgRating: 4.0,
            reviewCount: 55,
            totalSold: 280,
          },
          {
            id: 19,
            name: "OnePlus Nord CE 3 Lite 5G",
            slug: "oneplus-nord-ce3-lite-5g",
            brandId: 8,
            categoryId: 5,
            shortDesc: '6.72" 120Hz Display, 108MP Camera, 5000mAh',
            longDesc: "<p>OnePlus Nord CE 3 Lite with 108MP main camera, 120Hz display, and 67W SUPERVOOC fast charging.</p>",
            basePrice: 19999.0,
            mrp: 24999.0,
            avgRating: 4.1,
            reviewCount: 42,
            totalSold: 600,
          },
          // More Laptops
          {
            id: 20,
            name: "HP 15s Ryzen 5",
            slug: "hp-15s-ryzen5-5500u",
            brandId: 4,
            categoryId: 6,
            shortDesc: '15.6" FHD, AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD',
            longDesc: "<p>HP 15s laptop with AMD Ryzen 5 5500U processor, 8GB DDR4 RAM, 512GB PCIe SSD, and AMD Radeon graphics.</p>",
            basePrice: 42990.0,
            mrp: 58321.0,
            avgRating: 3.9,
            reviewCount: 38,
            totalSold: 150,
          },
          // More Clothing (Men category 9)
          {
            id: 21,
            name: "Nike Air Max 270",
            slug: "nike-air-max-270",
            brandId: 6,
            categoryId: 9,
            shortDesc: "Air Max Cushioning, Mesh Upper, Rubber Outsole",
            longDesc: "<p>Nike Air Max 270 with the largest Max Air unit yet for unrivaled comfort, breathable mesh upper, and durable rubber outsole.</p>",
            basePrice: 11995.0,
            mrp: 14995.0,
            avgRating: 4.4,
            reviewCount: 60,
            totalSold: 400,
          },
          // More Home & Kitchen
          {
            id: 22,
            name: "Prestige PIC 16.0+ 1900W Induction Cooktop",
            slug: "prestige-induction-cooktop-pic16",
            brandId: 10,
            categoryId: 3,
            shortDesc: "1900W, Automatic Voltage Regulator, Anti-Magnetic Wall",
            longDesc: "<p>Prestige PIC 16.0+ induction cooktop with push-button controls, automatic voltage regulator, and Indian menu options.</p>",
            basePrice: 2199.0,
            mrp: 3645.0,
            avgRating: 4.0,
            reviewCount: 50,
            totalSold: 1200,
          },
          // More Headphones
          {
            id: 23,
            name: "Sony WF-1000XM5 Truly Wireless Earbuds",
            slug: "sony-wf-1000xm5-earbuds",
            brandId: 3,
            categoryId: 7,
            shortDesc: "Best-in-class ANC, 8hr Battery, Hi-Res Audio Wireless",
            longDesc: "<p>Sony WF-1000XM5 with industry-leading noise cancellation, V2 Integrated Processor, Hi-Res Audio Wireless, and 24hr total battery life.</p>",
            basePrice: 24990.0,
            mrp: 29990.0,
            avgRating: 4.5,
            reviewCount: 40,
            totalSold: 250,
          },
          // More Televisions
          {
            id: 24,
            name: 'Samsung 65" QLED 4K Smart TV',
            slug: "samsung-qled-65-q80c",
            brandId: 1,
            categoryId: 8,
            shortDesc: '65" QLED 4K, Quantum Processor 4K, Object Tracking Sound',
            longDesc: "<p>Samsung Q80C QLED TV with Direct Full Array, Quantum Processor 4K, Object Tracking Sound+, and Smart Hub powered by Tizen.</p>",
            basePrice: 104990.0,
            mrp: 149900.0,
            avgRating: 4.5,
            reviewCount: 30,
            totalSold: 80,
          },
          // Apple Watch (Smartphones category 5)
          {
            id: 25,
            name: "Apple Watch Series 9",
            slug: "apple-watch-series-9-gps-41mm",
            brandId: 2,
            categoryId: 5,
            shortDesc: "41mm GPS, S9 Chip, Always-On Retina Display",
            longDesc: "<p>Apple Watch Series 9 with S9 SiP, Double Tap gesture, brighter Always-On Retina display, and advanced health features.</p>",
            basePrice: 41900.0,
            mrp: 44900.0,
            avgRating: 4.6,
            reviewCount: 70,
            totalSold: 300,
          },
          // More Books
          {
            id: 26,
            name: "Atomic Habits",
            slug: "atomic-habits-james-clear",
            brandId: null,
            categoryId: 4,
            shortDesc: "by James Clear - An Easy & Proven Way to Build Good Habits",
            longDesc: "<p>James Clear reveals practical strategies that teach you how to form good habits, break bad ones, and master tiny behaviors that lead to remarkable results.</p>",
            basePrice: 399.0,
            mrp: 599.0,
            avgRating: 4.8,
            reviewCount: 400,
            totalSold: 8000,
            isFeatured: true,
          },
          {
            id: 27,
            name: "The Psychology of Money",
            slug: "psychology-of-money-morgan-housel",
            brandId: null,
            categoryId: 4,
            shortDesc: "by Morgan Housel - Timeless Lessons on Wealth, Greed, and Happiness",
            longDesc: "<p>Morgan Housel explores the strange ways people think about money and teaches you to make better financial decisions.</p>",
            basePrice: 299.0,
            mrp: 499.0,
            avgRating: 4.5,
            reviewCount: 180,
            totalSold: 4000,
          },
          // More Jeans
          {
            id: 28,
            name: "Levi's 501 Original Fit Jeans",
            slug: "levis-501-original-fit",
            brandId: 5,
            categoryId: 12,
            shortDesc: "Original Fit, Button Fly, 100% Cotton",
            longDesc: "<p>The iconic Levi's 501 Original Fit jeans. The style that started it all since 1873. Button fly, straight leg, sits at the waist.</p>",
            basePrice: 3499.0,
            mrp: 5599.0,
            avgRating: 4.5,
            reviewCount: 55,
            totalSold: 250,
          },
          // More Men (category 9)
          {
            id: 29,
            name: "Nike Revolution 6 Running Shoes",
            slug: "nike-revolution-6-running-shoes",
            brandId: 6,
            categoryId: 9,
            shortDesc: "Lightweight Mesh, Soft Foam Midsole, Rubber Outsole",
            longDesc: "<p>Nike Revolution 6 with breathable mesh upper, soft foam midsole for cushioning, and durable rubber outsole for traction.</p>",
            basePrice: 3595.0,
            mrp: 5795.0,
            avgRating: 4.0,
            reviewCount: 48,
            totalSold: 600,
          },
          // More Headphones
          {
            id: 30,
            name: "Samsung Galaxy Buds FE",
            slug: "samsung-galaxy-buds-fe",
            brandId: 1,
            categoryId: 7,
            shortDesc: "Active Noise Cancelling, 360 Audio, 30hr Battery",
            longDesc: "<p>Samsung Galaxy Buds FE with ANC, 360 Audio, 3-mic system, and 30 hours of total battery life with the charging case.</p>",
            basePrice: 4999.0,
            mrp: 7999.0,
            avgRating: 4.0,
            reviewCount: 35,
            totalSold: 450,
          },
        ],
      });

      // ─── PRODUCT VARIANTS ────────────────────────────────────────────────
      await tx.productVariant.createMany({
        data: [
          // Samsung Galaxy S24 Ultra - color/storage variants
          { id: 1, productId: 1, sku: "SAM-S24U-TB-256", variantName: "Titanium Black / 256GB", stock: 50 },
          { id: 2, productId: 1, sku: "SAM-S24U-TV-256", variantName: "Titanium Violet / 256GB", stock: 30 },
          { id: 3, productId: 1, sku: "SAM-S24U-TG-512", variantName: "Titanium Gray / 512GB", priceOverride: 139999.0, mrpOverride: 154999.0, stock: 20 },
          // iPhone 15 Pro Max - color/storage variants
          { id: 4, productId: 2, sku: "APL-IP15PM-NB-256", variantName: "Natural Titanium / 256GB", stock: 60 },
          { id: 5, productId: 2, sku: "APL-IP15PM-BT-256", variantName: "Blue Titanium / 256GB", stock: 40 },
          { id: 6, productId: 2, sku: "APL-IP15PM-WT-512", variantName: "White Titanium / 512GB", priceOverride: 174900.0, mrpOverride: 189900.0, stock: 25 },
          // OnePlus 12 - color/storage
          { id: 7, productId: 3, sku: "OP-12-SV-256", variantName: "Silky Valley / 256GB", stock: 45 },
          { id: 8, productId: 3, sku: "OP-12-FL-256", variantName: "Flowy Emerald / 256GB", stock: 35 },
          // HP Pavilion - config variants
          { id: 9, productId: 4, sku: "HP-PV15-I5-16-512", variantName: "i5/16GB/512GB", stock: 30 },
          { id: 10, productId: 4, sku: "HP-PV15-I7-16-512", variantName: "i7/16GB/512GB", priceOverride: 64990.0, mrpOverride: 82490.0, stock: 15 },
          // MacBook Air M2
          { id: 11, productId: 5, sku: "APL-MBA-M2-8-256", variantName: "8GB/256GB / Starlight", stock: 40 },
          { id: 12, productId: 5, sku: "APL-MBA-M2-8-512", variantName: "8GB/512GB / Midnight", priceOverride: 144900.0, mrpOverride: 149900.0, stock: 25 },
          // Nike T-Shirt sizes
          { id: 13, productId: 10, sku: "NK-DRIFT-S", variantName: "Small", stock: 100 },
          { id: 14, productId: 10, sku: "NK-DRIFT-M", variantName: "Medium", stock: 150 },
          { id: 15, productId: 10, sku: "NK-DRIFT-L", variantName: "Large", stock: 120 },
          { id: 16, productId: 10, sku: "NK-DRIFT-XL", variantName: "Extra Large", stock: 80 },
          // Levi's T-Shirt sizes
          { id: 17, productId: 11, sku: "LEV-CREW-S", variantName: "Small", stock: 80 },
          { id: 18, productId: 11, sku: "LEV-CREW-M", variantName: "Medium", stock: 120 },
          { id: 19, productId: 11, sku: "LEV-CREW-L", variantName: "Large", stock: 100 },
          { id: 20, productId: 11, sku: "LEV-CREW-XL", variantName: "Extra Large", stock: 60 },
          // Levi's 511 Jeans sizes
          { id: 21, productId: 12, sku: "LEV-511-30", variantName: "Waist 30", stock: 50 },
          { id: 22, productId: 12, sku: "LEV-511-32", variantName: "Waist 32", stock: 60 },
          { id: 23, productId: 12, sku: "LEV-511-34", variantName: "Waist 34", stock: 40 },
          // Levi's 501 sizes
          { id: 24, productId: 28, sku: "LEV-501-30", variantName: "Waist 30", stock: 40 },
          { id: 25, productId: 28, sku: "LEV-501-32", variantName: "Waist 32", stock: 50 },
          { id: 26, productId: 28, sku: "LEV-501-34", variantName: "Waist 34", stock: 35 },
          // Samsung Galaxy A54 colors
          { id: 27, productId: 18, sku: "SAM-A54-GR-128", variantName: "Graphite / 128GB", stock: 60 },
          { id: 28, productId: 18, sku: "SAM-A54-LV-128", variantName: "Lavender / 128GB", stock: 40 },
          // OnePlus Nord CE 3 Lite colors
          { id: 29, productId: 19, sku: "OP-CE3L-PM-128", variantName: "Pastel Lime / 128GB", stock: 70 },
          { id: 30, productId: 19, sku: "OP-CE3L-CB-128", variantName: "Chromatic Gray / 128GB", stock: 55 },
          // Nike Air Max 270 sizes
          { id: 31, productId: 21, sku: "NK-AM270-7", variantName: "UK 7", stock: 30 },
          { id: 32, productId: 21, sku: "NK-AM270-8", variantName: "UK 8", stock: 40 },
          { id: 33, productId: 21, sku: "NK-AM270-9", variantName: "UK 9", stock: 35 },
          { id: 34, productId: 21, sku: "NK-AM270-10", variantName: "UK 10", stock: 25 },
          // Samsung Galaxy Buds FE colors
          { id: 35, productId: 30, sku: "SAM-BUDSFE-GR", variantName: "Graphite", stock: 80 },
          { id: 36, productId: 30, sku: "SAM-BUDSFE-WT", variantName: "White", stock: 60 },
        ],
      });

      // ─── VARIANT ATTRIBUTES ──────────────────────────────────────────────
      await tx.variantAttribute.createMany({
        data: [
          // Samsung S24 Ultra variants
          { variantId: 1, attributeName: "Color", attributeValue: "Titanium Black" },
          { variantId: 1, attributeName: "Storage", attributeValue: "256GB" },
          { variantId: 2, attributeName: "Color", attributeValue: "Titanium Violet" },
          { variantId: 2, attributeName: "Storage", attributeValue: "256GB" },
          { variantId: 3, attributeName: "Color", attributeValue: "Titanium Gray" },
          { variantId: 3, attributeName: "Storage", attributeValue: "512GB" },
          // iPhone 15 Pro Max
          { variantId: 4, attributeName: "Color", attributeValue: "Natural Titanium" },
          { variantId: 4, attributeName: "Storage", attributeValue: "256GB" },
          { variantId: 5, attributeName: "Color", attributeValue: "Blue Titanium" },
          { variantId: 5, attributeName: "Storage", attributeValue: "256GB" },
          { variantId: 6, attributeName: "Color", attributeValue: "White Titanium" },
          { variantId: 6, attributeName: "Storage", attributeValue: "512GB" },
          // OnePlus 12
          { variantId: 7, attributeName: "Color", attributeValue: "Silky Valley" },
          { variantId: 7, attributeName: "Storage", attributeValue: "256GB" },
          { variantId: 8, attributeName: "Color", attributeValue: "Flowy Emerald" },
          { variantId: 8, attributeName: "Storage", attributeValue: "256GB" },
          // HP Pavilion
          { variantId: 9, attributeName: "Processor", attributeValue: "Intel Core i5-1335U" },
          { variantId: 9, attributeName: "RAM", attributeValue: "16GB" },
          { variantId: 9, attributeName: "Storage", attributeValue: "512GB SSD" },
          { variantId: 10, attributeName: "Processor", attributeValue: "Intel Core i7-1355U" },
          { variantId: 10, attributeName: "RAM", attributeValue: "16GB" },
          { variantId: 10, attributeName: "Storage", attributeValue: "512GB SSD" },
          // MacBook Air
          { variantId: 11, attributeName: "Memory", attributeValue: "8GB" },
          { variantId: 11, attributeName: "Storage", attributeValue: "256GB SSD" },
          { variantId: 11, attributeName: "Color", attributeValue: "Starlight" },
          { variantId: 12, attributeName: "Memory", attributeValue: "8GB" },
          { variantId: 12, attributeName: "Storage", attributeValue: "512GB SSD" },
          { variantId: 12, attributeName: "Color", attributeValue: "Midnight" },
          // Nike T-Shirt sizes
          { variantId: 13, attributeName: "Size", attributeValue: "S" },
          { variantId: 14, attributeName: "Size", attributeValue: "M" },
          { variantId: 15, attributeName: "Size", attributeValue: "L" },
          { variantId: 16, attributeName: "Size", attributeValue: "XL" },
          // Levi's T-Shirt sizes
          { variantId: 17, attributeName: "Size", attributeValue: "S" },
          { variantId: 18, attributeName: "Size", attributeValue: "M" },
          { variantId: 19, attributeName: "Size", attributeValue: "L" },
          { variantId: 20, attributeName: "Size", attributeValue: "XL" },
          // Jeans waist sizes
          { variantId: 21, attributeName: "Waist", attributeValue: "30" },
          { variantId: 22, attributeName: "Waist", attributeValue: "32" },
          { variantId: 23, attributeName: "Waist", attributeValue: "34" },
          { variantId: 24, attributeName: "Waist", attributeValue: "30" },
          { variantId: 25, attributeName: "Waist", attributeValue: "32" },
          { variantId: 26, attributeName: "Waist", attributeValue: "34" },
          // Samsung A54
          { variantId: 27, attributeName: "Color", attributeValue: "Graphite" },
          { variantId: 27, attributeName: "Storage", attributeValue: "128GB" },
          { variantId: 28, attributeName: "Color", attributeValue: "Lavender" },
          { variantId: 28, attributeName: "Storage", attributeValue: "128GB" },
          // OnePlus Nord CE 3 Lite
          { variantId: 29, attributeName: "Color", attributeValue: "Pastel Lime" },
          { variantId: 29, attributeName: "Storage", attributeValue: "128GB" },
          { variantId: 30, attributeName: "Color", attributeValue: "Chromatic Gray" },
          { variantId: 30, attributeName: "Storage", attributeValue: "128GB" },
          // Nike Air Max sizes
          { variantId: 31, attributeName: "UK Size", attributeValue: "7" },
          { variantId: 32, attributeName: "UK Size", attributeValue: "8" },
          { variantId: 33, attributeName: "UK Size", attributeValue: "9" },
          { variantId: 34, attributeName: "UK Size", attributeValue: "10" },
          // Samsung Galaxy Buds FE
          { variantId: 35, attributeName: "Color", attributeValue: "Graphite" },
          { variantId: 36, attributeName: "Color", attributeValue: "White" },
        ],
      });

      // ─── PRODUCT IMAGES ──────────────────────────────────────────────────
      await tx.productImage.createMany({
        data: [
          // Samsung Galaxy S24 Ultra
          { productId: 1, variantId: null, imageUrl: "https://picsum.photos/seed/product1a/500/500", altText: "S24 Ultra Front", sortOrder: 0, isPrimary: true },
          { productId: 1, variantId: null, imageUrl: "https://picsum.photos/seed/product1b/500/500", altText: "S24 Ultra Back", sortOrder: 1, isPrimary: false },
          { productId: 1, variantId: 1, imageUrl: "https://picsum.photos/seed/product1c/500/500", altText: "S24 Ultra Titanium Black", sortOrder: 2, isPrimary: false },
          // iPhone 15 Pro Max
          { productId: 2, variantId: null, imageUrl: "https://picsum.photos/seed/product2a/500/500", altText: "iPhone 15 Pro Max Front", sortOrder: 0, isPrimary: true },
          { productId: 2, variantId: null, imageUrl: "https://picsum.photos/seed/product2b/500/500", altText: "iPhone 15 Pro Max Back", sortOrder: 1, isPrimary: false },
          { productId: 2, variantId: 4, imageUrl: "https://picsum.photos/seed/product2c/500/500", altText: "iPhone 15 Pro Max Natural", sortOrder: 2, isPrimary: false },
          // OnePlus 12
          { productId: 3, variantId: null, imageUrl: "https://picsum.photos/seed/product3a/500/500", altText: "OnePlus 12 Front", sortOrder: 0, isPrimary: true },
          { productId: 3, variantId: null, imageUrl: "https://picsum.photos/seed/product3b/500/500", altText: "OnePlus 12 Back", sortOrder: 1, isPrimary: false },
          // HP Pavilion
          { productId: 4, variantId: null, imageUrl: "https://picsum.photos/seed/product4a/500/500", altText: "HP Pavilion Front", sortOrder: 0, isPrimary: true },
          { productId: 4, variantId: null, imageUrl: "https://picsum.photos/seed/product4b/500/500", altText: "HP Pavilion Open", sortOrder: 1, isPrimary: false },
          // MacBook Air M2
          { productId: 5, variantId: null, imageUrl: "https://picsum.photos/seed/product5a/500/500", altText: "MacBook Air M2 Top", sortOrder: 0, isPrimary: true },
          { productId: 5, variantId: null, imageUrl: "https://picsum.photos/seed/product5b/500/500", altText: "MacBook Air M2 Open", sortOrder: 1, isPrimary: false },
          { productId: 5, variantId: 12, imageUrl: "https://picsum.photos/seed/product5c/500/500", altText: "MacBook Air M2 Midnight", sortOrder: 2, isPrimary: false },
          // Sony WH-1000XM5
          { productId: 6, variantId: null, imageUrl: "https://picsum.photos/seed/product6a/500/500", altText: "Sony XM5 Front", sortOrder: 0, isPrimary: true },
          { productId: 6, variantId: null, imageUrl: "https://picsum.photos/seed/product6b/500/500", altText: "Sony XM5 Side", sortOrder: 1, isPrimary: false },
          // boAt Rockerz 551ANC
          { productId: 7, variantId: null, imageUrl: "https://picsum.photos/seed/product7a/500/500", altText: "boAt 551ANC", sortOrder: 0, isPrimary: true },
          // Samsung TV 43"
          { productId: 8, variantId: null, imageUrl: "https://picsum.photos/seed/product8a/500/500", altText: 'Samsung 43" TV', sortOrder: 0, isPrimary: true },
          // LG OLED 55"
          { productId: 9, variantId: null, imageUrl: "https://picsum.photos/seed/product9a/500/500", altText: "LG OLED Front", sortOrder: 0, isPrimary: true },
          { productId: 9, variantId: null, imageUrl: "https://picsum.photos/seed/product9b/500/500", altText: "LG OLED Side", sortOrder: 1, isPrimary: false },
          // Nike Dri-FIT T-Shirt
          { productId: 10, variantId: null, imageUrl: "https://picsum.photos/seed/product10a/500/500", altText: "Nike Dri-FIT T-Shirt", sortOrder: 0, isPrimary: true },
          { productId: 10, variantId: 15, imageUrl: "https://picsum.photos/seed/product10b/500/500", altText: "Nike Dri-FIT Size L", sortOrder: 1, isPrimary: false },
          // Levi's T-Shirt
          { productId: 11, variantId: null, imageUrl: "https://picsum.photos/seed/product11a/500/500", altText: "Levis Crew T-Shirt", sortOrder: 0, isPrimary: true },
          // Levi's 511 Jeans
          { productId: 12, variantId: null, imageUrl: "https://picsum.photos/seed/product12a/500/500", altText: "Levis 511 Front", sortOrder: 0, isPrimary: true },
          { productId: 12, variantId: null, imageUrl: "https://picsum.photos/seed/product12b/500/500", altText: "Levis 511 Side", sortOrder: 1, isPrimary: false },
          // Nike Joggers
          { productId: 13, variantId: null, imageUrl: "https://picsum.photos/seed/product13a/500/500", altText: "Nike Joggers", sortOrder: 0, isPrimary: true },
          // Prestige Pressure Cooker
          { productId: 14, variantId: null, imageUrl: "https://picsum.photos/seed/product14a/500/500", altText: "Prestige Pressure Cooker", sortOrder: 0, isPrimary: true },
          // Samsung Refrigerator
          { productId: 15, variantId: null, imageUrl: "https://picsum.photos/seed/product15a/500/500", altText: "Samsung Fridge", sortOrder: 0, isPrimary: true },
          // Books
          { productId: 16, variantId: null, imageUrl: "https://picsum.photos/seed/product16a/500/500", altText: "Great Indian Novel", sortOrder: 0, isPrimary: true },
          { productId: 17, variantId: null, imageUrl: "https://picsum.photos/seed/product17a/500/500", altText: "Sapiens", sortOrder: 0, isPrimary: true },
          { productId: 26, variantId: null, imageUrl: "https://picsum.photos/seed/product26a/500/500", altText: "Atomic Habits", sortOrder: 0, isPrimary: true },
          { productId: 27, variantId: null, imageUrl: "https://picsum.photos/seed/product27a/500/500", altText: "Psychology of Money", sortOrder: 0, isPrimary: true },
          // Samsung Galaxy A54
          { productId: 18, variantId: null, imageUrl: "https://picsum.photos/seed/product18a/500/500", altText: "A54 Front", sortOrder: 0, isPrimary: true },
          { productId: 18, variantId: 27, imageUrl: "https://picsum.photos/seed/product18b/500/500", altText: "A54 Graphite", sortOrder: 1, isPrimary: false },
          // OnePlus Nord CE 3 Lite
          { productId: 19, variantId: null, imageUrl: "https://picsum.photos/seed/product19a/500/500", altText: "Nord CE 3 Lite", sortOrder: 0, isPrimary: true },
          // HP 15s Ryzen
          { productId: 20, variantId: null, imageUrl: "https://picsum.photos/seed/product20a/500/500", altText: "HP 15s Ryzen", sortOrder: 0, isPrimary: true },
          // Nike Air Max 270
          { productId: 21, variantId: null, imageUrl: "https://picsum.photos/seed/product21a/500/500", altText: "Air Max 270", sortOrder: 0, isPrimary: true },
          { productId: 21, variantId: 32, imageUrl: "https://picsum.photos/seed/product21b/500/500", altText: "Air Max 270 UK 8", sortOrder: 1, isPrimary: false },
          // Prestige Induction
          { productId: 22, variantId: null, imageUrl: "https://picsum.photos/seed/product22a/500/500", altText: "Prestige Induction", sortOrder: 0, isPrimary: true },
          // Sony WF-1000XM5
          { productId: 23, variantId: null, imageUrl: "https://picsum.photos/seed/product23a/500/500", altText: "WF-1000XM5", sortOrder: 0, isPrimary: true },
          { productId: 23, variantId: null, imageUrl: "https://picsum.photos/seed/product23b/500/500", altText: "WF-1000XM5 Case", sortOrder: 1, isPrimary: false },
          // Samsung QLED 65"
          { productId: 24, variantId: null, imageUrl: "https://picsum.photos/seed/product24a/500/500", altText: "Samsung QLED 65", sortOrder: 0, isPrimary: true },
          // Apple Watch
          { productId: 25, variantId: null, imageUrl: "https://picsum.photos/seed/product25a/500/500", altText: "Watch Series 9", sortOrder: 0, isPrimary: true },
          { productId: 25, variantId: null, imageUrl: "https://picsum.photos/seed/product25b/500/500", altText: "Watch Series 9 Wrist", sortOrder: 1, isPrimary: false },
          // Levi's 501
          { productId: 28, variantId: null, imageUrl: "https://picsum.photos/seed/product28a/500/500", altText: "Levis 501", sortOrder: 0, isPrimary: true },
          // Nike Revolution 6
          { productId: 29, variantId: null, imageUrl: "https://picsum.photos/seed/product29a/500/500", altText: "Nike Revolution 6", sortOrder: 0, isPrimary: true },
          // Samsung Galaxy Buds FE
          { productId: 30, variantId: null, imageUrl: "https://picsum.photos/seed/product30a/500/500", altText: "Galaxy Buds FE", sortOrder: 0, isPrimary: true },
        ],
      });

      // ─── PRODUCT SPECIFICATIONS ──────────────────────────────────────────
      await tx.productSpecification.createMany({
        data: [
          // Samsung Galaxy S24 Ultra
          { productId: 1, groupName: "Display", specKey: "Screen Size", specValue: "6.8 inches", sortOrder: 1 },
          { productId: 1, groupName: "Display", specKey: "Resolution", specValue: "3120 x 1440", sortOrder: 2 },
          { productId: 1, groupName: "Display", specKey: "Display Type", specValue: "Dynamic AMOLED 2X", sortOrder: 3 },
          { productId: 1, groupName: "Performance", specKey: "Processor", specValue: "Snapdragon 8 Gen 3", sortOrder: 4 },
          { productId: 1, groupName: "Performance", specKey: "RAM", specValue: "12 GB", sortOrder: 5 },
          { productId: 1, groupName: "Camera", specKey: "Rear Camera", specValue: "200MP + 12MP + 50MP + 10MP", sortOrder: 6 },
          { productId: 1, groupName: "Camera", specKey: "Front Camera", specValue: "12MP", sortOrder: 7 },
          { productId: 1, groupName: "Battery", specKey: "Capacity", specValue: "5000 mAh", sortOrder: 8 },
          { productId: 1, groupName: "General", specKey: "OS", specValue: "Android 14 + One UI 6.1", sortOrder: 9 },
          { productId: 1, groupName: "General", specKey: "Weight", specValue: "232 g", sortOrder: 10 },
          // iPhone 15 Pro Max
          { productId: 2, groupName: "Display", specKey: "Screen Size", specValue: "6.7 inches", sortOrder: 1 },
          { productId: 2, groupName: "Display", specKey: "Resolution", specValue: "2796 x 1290", sortOrder: 2 },
          { productId: 2, groupName: "Display", specKey: "Display Type", specValue: "Super Retina XDR", sortOrder: 3 },
          { productId: 2, groupName: "Performance", specKey: "Processor", specValue: "Apple A17 Pro", sortOrder: 4 },
          { productId: 2, groupName: "Performance", specKey: "RAM", specValue: "8 GB", sortOrder: 5 },
          { productId: 2, groupName: "Camera", specKey: "Rear Camera", specValue: "48MP + 12MP + 12MP", sortOrder: 6 },
          { productId: 2, groupName: "Camera", specKey: "Front Camera", specValue: "12MP", sortOrder: 7 },
          { productId: 2, groupName: "Battery", specKey: "Capacity", specValue: "4441 mAh", sortOrder: 8 },
          { productId: 2, groupName: "General", specKey: "OS", specValue: "iOS 17", sortOrder: 9 },
          { productId: 2, groupName: "General", specKey: "Weight", specValue: "221 g", sortOrder: 10 },
          // OnePlus 12
          { productId: 3, groupName: "Display", specKey: "Screen Size", specValue: "6.82 inches", sortOrder: 1 },
          { productId: 3, groupName: "Display", specKey: "Resolution", specValue: "3168 x 1440", sortOrder: 2 },
          { productId: 3, groupName: "Performance", specKey: "Processor", specValue: "Snapdragon 8 Gen 3", sortOrder: 3 },
          { productId: 3, groupName: "Performance", specKey: "RAM", specValue: "12 GB", sortOrder: 4 },
          { productId: 3, groupName: "Camera", specKey: "Rear Camera", specValue: "50MP + 48MP + 64MP", sortOrder: 5 },
          { productId: 3, groupName: "Battery", specKey: "Capacity", specValue: "5400 mAh", sortOrder: 6 },
          { productId: 3, groupName: "General", specKey: "Charging", specValue: "100W SUPERVOOC", sortOrder: 7 },
          // HP Pavilion
          { productId: 4, groupName: "Display", specKey: "Screen Size", specValue: "15.6 inches", sortOrder: 1 },
          { productId: 4, groupName: "Display", specKey: "Resolution", specValue: "1920 x 1080", sortOrder: 2 },
          { productId: 4, groupName: "Performance", specKey: "Processor", specValue: "Intel Core i5-1335U", sortOrder: 3 },
          { productId: 4, groupName: "Performance", specKey: "RAM", specValue: "16 GB DDR4", sortOrder: 4 },
          { productId: 4, groupName: "Storage", specKey: "SSD", specValue: "512 GB PCIe NVMe", sortOrder: 5 },
          { productId: 4, groupName: "General", specKey: "OS", specValue: "Windows 11 Home", sortOrder: 6 },
          { productId: 4, groupName: "General", specKey: "Weight", specValue: "1.75 kg", sortOrder: 7 },
          // MacBook Air M2
          { productId: 5, groupName: "Display", specKey: "Screen Size", specValue: "13.6 inches", sortOrder: 1 },
          { productId: 5, groupName: "Display", specKey: "Resolution", specValue: "2560 x 1664", sortOrder: 2 },
          { productId: 5, groupName: "Display", specKey: "Display Type", specValue: "Liquid Retina", sortOrder: 3 },
          { productId: 5, groupName: "Performance", specKey: "Processor", specValue: "Apple M2", sortOrder: 4 },
          { productId: 5, groupName: "Performance", specKey: "Unified Memory", specValue: "8 GB", sortOrder: 5 },
          { productId: 5, groupName: "Storage", specKey: "SSD", specValue: "256 GB", sortOrder: 6 },
          { productId: 5, groupName: "Battery", specKey: "Life", specValue: "Up to 18 hours", sortOrder: 7 },
          { productId: 5, groupName: "General", specKey: "Weight", specValue: "1.24 kg", sortOrder: 8 },
          // Sony WH-1000XM5
          { productId: 6, groupName: "Audio", specKey: "Driver", specValue: "30mm", sortOrder: 1 },
          { productId: 6, groupName: "Audio", specKey: "Frequency", specValue: "4Hz-40,000Hz", sortOrder: 2 },
          { productId: 6, groupName: "Features", specKey: "Noise Cancelling", specValue: "Yes (Auto NC)", sortOrder: 3 },
          { productId: 6, groupName: "Battery", specKey: "Playtime", specValue: "30 hours", sortOrder: 4 },
          { productId: 6, groupName: "General", specKey: "Weight", specValue: "250 g", sortOrder: 5 },
          { productId: 6, groupName: "Connectivity", specKey: "Bluetooth", specValue: "5.2", sortOrder: 6 },
          // boAt 551ANC
          { productId: 7, groupName: "Audio", specKey: "Driver", specValue: "40mm", sortOrder: 1 },
          { productId: 7, groupName: "Features", specKey: "Noise Cancelling", specValue: "Yes (Hybrid ANC)", sortOrder: 2 },
          { productId: 7, groupName: "Battery", specKey: "Playtime", specValue: "100 hours", sortOrder: 3 },
          { productId: 7, groupName: "Connectivity", specKey: "Bluetooth", specValue: "5.3", sortOrder: 4 },
          // Samsung TV 43"
          { productId: 8, groupName: "Display", specKey: "Screen Size", specValue: "43 inches", sortOrder: 1 },
          { productId: 8, groupName: "Display", specKey: "Resolution", specValue: "3840 x 2160 (4K)", sortOrder: 2 },
          { productId: 8, groupName: "Display", specKey: "Panel Type", specValue: "Crystal UHD", sortOrder: 3 },
          { productId: 8, groupName: "Smart TV", specKey: "OS", specValue: "Tizen", sortOrder: 4 },
          { productId: 8, groupName: "Audio", specKey: "Output", specValue: "20W", sortOrder: 5 },
          { productId: 8, groupName: "General", specKey: "Weight", specValue: "8.8 kg", sortOrder: 6 },
          // LG OLED 55"
          { productId: 9, groupName: "Display", specKey: "Screen Size", specValue: "55 inches", sortOrder: 1 },
          { productId: 9, groupName: "Display", specKey: "Resolution", specValue: "3840 x 2160 (4K)", sortOrder: 2 },
          { productId: 9, groupName: "Display", specKey: "Panel Type", specValue: "OLED evo", sortOrder: 3 },
          { productId: 9, groupName: "Smart TV", specKey: "OS", specValue: "webOS", sortOrder: 4 },
          { productId: 9, groupName: "Audio", specKey: "Output", specValue: "40W (2.2ch)", sortOrder: 5 },
          { productId: 9, groupName: "General", specKey: "Processor", specValue: "a9 Gen4 AI", sortOrder: 6 },
          // Nike Dri-FIT T-Shirt
          { productId: 10, groupName: "General", specKey: "Material", specValue: "100% Polyester (Dri-FIT)", sortOrder: 1 },
          { productId: 10, groupName: "General", specKey: "Fit", specValue: "Regular", sortOrder: 2 },
          { productId: 10, groupName: "General", specKey: "Neck Type", specValue: "Crew Neck", sortOrder: 3 },
          { productId: 10, groupName: "Care", specKey: "Machine Wash", specValue: "Yes", sortOrder: 4 },
          // Levi's T-Shirt
          { productId: 11, groupName: "General", specKey: "Material", specValue: "100% Cotton", sortOrder: 1 },
          { productId: 11, groupName: "General", specKey: "Fit", specValue: "Classic", sortOrder: 2 },
          { productId: 11, groupName: "General", specKey: "Neck Type", specValue: "Crew Neck", sortOrder: 3 },
          { productId: 11, groupName: "Care", specKey: "Machine Wash", specValue: "Yes", sortOrder: 4 },
          // Levi's 511
          { productId: 12, groupName: "General", specKey: "Material", specValue: "98% Cotton, 2% Elastane", sortOrder: 1 },
          { productId: 12, groupName: "General", specKey: "Fit", specValue: "Slim", sortOrder: 2 },
          { productId: 12, groupName: "General", specKey: "Rise", specValue: "Mid Rise", sortOrder: 3 },
          { productId: 12, groupName: "General", specKey: "Closure", specValue: "Zip Fly + Button", sortOrder: 4 },
          // Prestige Pressure Cooker
          { productId: 14, groupName: "General", specKey: "Capacity", specValue: "5 Litres", sortOrder: 1 },
          { productId: 14, groupName: "General", specKey: "Material", specValue: "Aluminium", sortOrder: 2 },
          { productId: 14, groupName: "General", specKey: "Base Type", specValue: "Induction Base", sortOrder: 3 },
          { productId: 14, groupName: "Safety", specKey: "ISI Certified", specValue: "Yes", sortOrder: 4 },
          // Samsung Fridge
          { productId: 15, groupName: "General", specKey: "Capacity", specValue: "253 Litres", sortOrder: 1 },
          { productId: 15, groupName: "General", specKey: "Type", specValue: "Frost Free Double Door", sortOrder: 2 },
          { productId: 15, groupName: "General", specKey: "Compressor", specValue: "Digital Inverter", sortOrder: 3 },
          { productId: 15, groupName: "Energy", specKey: "Rating", specValue: "2 Star", sortOrder: 4 },
          // Sapiens
          { productId: 17, groupName: "General", specKey: "Author", specValue: "Yuval Noah Harari", sortOrder: 1 },
          { productId: 17, groupName: "General", specKey: "Publisher", specValue: "Harper", sortOrder: 2 },
          { productId: 17, groupName: "General", specKey: "Pages", specValue: "464", sortOrder: 3 },
          { productId: 17, groupName: "General", specKey: "Language", specValue: "English", sortOrder: 4 },
          // Atomic Habits
          { productId: 26, groupName: "General", specKey: "Author", specValue: "James Clear", sortOrder: 1 },
          { productId: 26, groupName: "General", specKey: "Publisher", specValue: "Avery", sortOrder: 2 },
          { productId: 26, groupName: "General", specKey: "Pages", specValue: "320", sortOrder: 3 },
          { productId: 26, groupName: "General", specKey: "Language", specValue: "English", sortOrder: 4 },
          // Psychology of Money
          { productId: 27, groupName: "General", specKey: "Author", specValue: "Morgan Housel", sortOrder: 1 },
          { productId: 27, groupName: "General", specKey: "Publisher", specValue: "Harriman House", sortOrder: 2 },
          { productId: 27, groupName: "General", specKey: "Pages", specValue: "256", sortOrder: 3 },
          { productId: 27, groupName: "General", specKey: "Language", specValue: "English", sortOrder: 4 },
          // Samsung A54
          { productId: 18, groupName: "Display", specKey: "Screen Size", specValue: "6.4 inches", sortOrder: 1 },
          { productId: 18, groupName: "Performance", specKey: "Processor", specValue: "Exynos 1380", sortOrder: 2 },
          { productId: 18, groupName: "Camera", specKey: "Rear Camera", specValue: "50MP + 12MP + 5MP", sortOrder: 3 },
          { productId: 18, groupName: "Battery", specKey: "Capacity", specValue: "5000 mAh", sortOrder: 4 },
          // OnePlus Nord CE 3 Lite
          { productId: 19, groupName: "Display", specKey: "Screen Size", specValue: "6.72 inches", sortOrder: 1 },
          { productId: 19, groupName: "Performance", specKey: "Processor", specValue: "Snapdragon 695", sortOrder: 2 },
          { productId: 19, groupName: "Camera", specKey: "Rear Camera", specValue: "108MP + 2MP + 2MP", sortOrder: 3 },
          { productId: 19, groupName: "Battery", specKey: "Capacity", specValue: "5000 mAh", sortOrder: 4 },
          // HP 15s Ryzen
          { productId: 20, groupName: "Performance", specKey: "Processor", specValue: "AMD Ryzen 5 5500U", sortOrder: 1 },
          { productId: 20, groupName: "Performance", specKey: "RAM", specValue: "8 GB DDR4", sortOrder: 2 },
          { productId: 20, groupName: "Storage", specKey: "SSD", specValue: "512 GB PCIe", sortOrder: 3 },
          { productId: 20, groupName: "General", specKey: "OS", specValue: "Windows 11 Home", sortOrder: 4 },
          // Nike Air Max 270
          { productId: 21, groupName: "General", specKey: "Upper", specValue: "Mesh + Synthetic", sortOrder: 1 },
          { productId: 21, groupName: "General", specKey: "Sole", specValue: "Rubber", sortOrder: 2 },
          { productId: 21, groupName: "Cushion", specKey: "Technology", specValue: "Air Max 270", sortOrder: 3 },
          // Prestige Induction
          { productId: 22, groupName: "General", specKey: "Power", specValue: "1900W", sortOrder: 1 },
          { productId: 22, groupName: "General", specKey: "Controls", specValue: "Push Button", sortOrder: 2 },
          { productId: 22, groupName: "Safety", specKey: "Auto Off", specValue: "Yes", sortOrder: 3 },
          // Sony WF-1000XM5
          { productId: 23, groupName: "Audio", specKey: "Driver", specValue: "8.4mm", sortOrder: 1 },
          { productId: 23, groupName: "Features", specKey: "ANC", specValue: "Yes (V2)", sortOrder: 2 },
          { productId: 23, groupName: "Battery", specKey: "Buds", specValue: "8 hours", sortOrder: 3 },
          { productId: 23, groupName: "Battery", specKey: "With Case", specValue: "24 hours", sortOrder: 4 },
          // Samsung QLED 65"
          { productId: 24, groupName: "Display", specKey: "Screen Size", specValue: "65 inches", sortOrder: 1 },
          { productId: 24, groupName: "Display", specKey: "Panel Type", specValue: "QLED", sortOrder: 2 },
          { productId: 24, groupName: "Smart TV", specKey: "OS", specValue: "Tizen", sortOrder: 3 },
          // Apple Watch S9
          { productId: 25, groupName: "General", specKey: "Case Size", specValue: "41mm", sortOrder: 1 },
          { productId: 25, groupName: "General", specKey: "Chip", specValue: "S9 SiP", sortOrder: 2 },
          { productId: 25, groupName: "Display", specKey: "Type", specValue: "Always-On Retina", sortOrder: 3 },
          { productId: 25, groupName: "Connectivity", specKey: "GPS", specValue: "Yes", sortOrder: 4 },
          // Levi's 501
          { productId: 28, groupName: "General", specKey: "Material", specValue: "100% Cotton", sortOrder: 1 },
          { productId: 28, groupName: "General", specKey: "Fit", specValue: "Original", sortOrder: 2 },
          { productId: 28, groupName: "General", specKey: "Closure", specValue: "Button Fly", sortOrder: 3 },
          // Nike Revolution 6
          { productId: 29, groupName: "General", specKey: "Upper", specValue: "Mesh", sortOrder: 1 },
          { productId: 29, groupName: "Cushion", specKey: "Midsole", specValue: "Soft Foam", sortOrder: 2 },
          { productId: 29, groupName: "General", specKey: "Outsole", specValue: "Rubber", sortOrder: 3 },
          // Samsung Galaxy Buds FE
          { productId: 30, groupName: "Audio", specKey: "Driver", specValue: "1-way speaker", sortOrder: 1 },
          { productId: 30, groupName: "Features", specKey: "ANC", specValue: "Yes", sortOrder: 2 },
          { productId: 30, groupName: "Battery", specKey: "With Case", specValue: "30 hours", sortOrder: 3 },
        ],
      });

      // ─── PRODUCT-CATEGORY MAPPINGS (secondary) ─────────────────────────
      await tx.productCategory.createMany({
        data: [
          { productId: 25, categoryId: 5, isPrimary: false }, // Apple Watch also in Smartphones
          { productId: 21, categoryId: 9, isPrimary: false }, // Nike Air Max also in Men
          { productId: 29, categoryId: 9, isPrimary: false }, // Nike Revolution 6 also in Men
          { productId: 30, categoryId: 7, isPrimary: false }, // Galaxy Buds FE also in Headphones
          { productId: 7, categoryId: 3, isPrimary: false },  // boAt 551ANC also in Home & Kitchen
        ],
      });

      // ─── REVIEWS ─────────────────────────────────────────────────────────
      await tx.productReview.createMany({
        data: [
          { productId: 1, userId: 1, rating: 5, title: "Best phone I have ever used", body: "The S24 Ultra is incredible. The camera is out of this world and the S Pen is super useful for notes.", isVerified: true },
          { productId: 1, userId: 2, rating: 4, title: "Great but expensive", body: "Amazing phone but the price is steep. Camera performance is top-notch.", isVerified: true },
          { productId: 2, userId: 1, rating: 5, title: "Perfect in every way", body: "The iPhone 15 Pro Max is a masterpiece. Titanium build feels premium.", isVerified: true },
          { productId: 2, userId: 2, rating: 4, title: "Excellent camera system", body: "Camera is the best on any smartphone. Battery could be better.", isVerified: true },
          { productId: 3, userId: 1, rating: 4, title: "Flagship killer returns", body: "OnePlus 12 is incredible value. Snapdragon 8 Gen 3 is blazing fast.", isVerified: true },
          { productId: 4, userId: 1, rating: 4, title: "Good for the price", body: "Solid laptop for everyday use. Build quality is decent.", isVerified: true },
          { productId: 4, userId: 2, rating: 3, title: "Average display", body: "The screen could be brighter. Performance is adequate for office work.", isVerified: true },
          { productId: 5, userId: 1, rating: 5, title: "M2 chip is a beast", body: "MacBook Air with M2 is insanely fast and the battery lasts forever.", isVerified: true },
          { productId: 6, userId: 1, rating: 5, title: "Best noise cancelling headphones", body: "Sony XM5 ANC is unreal. Comfortable for long sessions.", isVerified: true },
          { productId: 6, userId: 2, rating: 4, title: "Great but pricey", body: "Sound quality is excellent. Wish they folded like the XM4.", isVerified: true },
          { productId: 7, userId: 1, rating: 4, title: "Great value for money", body: "For the price, the ANC and battery life are hard to beat.", isVerified: true },
          { productId: 8, userId: 1, rating: 4, title: "Good budget 4K TV", body: "Samsung Crystal 4K delivers good picture quality for the price.", isVerified: true },
          { productId: 9, userId: 1, rating: 5, title: "OLED is worth every penny", body: "The picture quality on this LG OLED is absolutely stunning.", isVerified: true },
          { productId: 10, userId: 1, rating: 4, title: "Comfortable running shirt", body: "Dri-FIT material keeps you dry. Good fit and feel.", isVerified: true },
          { productId: 11, userId: 1, rating: 3, title: "Decent basic tee", body: "Quality is okay. Shrank a bit after first wash.", isVerified: true },
          { productId: 12, userId: 1, rating: 4, title: "Classic fit, great stretch", body: "Levi's 511 is my go-to. The stretch denim is comfortable all day.", isVerified: true },
          { productId: 14, userId: 1, rating: 5, title: "Induction compatible, works great", body: "Best pressure cooker for induction. Fast and safe.", isVerified: true },
          { productId: 14, userId: 2, rating: 4, title: "Good build quality", body: "Solid construction. The handle could be more ergonomic.", isVerified: true },
          { productId: 15, userId: 1, rating: 4, title: "Spacious and quiet", body: "Digital Inverter is indeed very quiet. Good storage space.", isVerified: true },
          { productId: 17, userId: 1, rating: 5, title: "Life-changing read", body: "Sapiens changed my perspective on human history. A must-read.", isVerified: true },
          { productId: 17, userId: 2, rating: 4, title: "Thought-provoking", body: "Harari makes complex ideas accessible. Some claims are debatable.", isVerified: true },
          { productId: 26, userId: 1, rating: 5, title: "Best book on habits", body: "Atomic Habits is practical and backed by science. Changed my daily routine.", isVerified: true },
          { productId: 26, userId: 2, rating: 5, title: "Simple yet powerful", body: "The 1% improvement concept is game-changing.", isVerified: true },
          { productId: 27, userId: 1, rating: 4, title: "Great financial wisdom", body: "Short chapters packed with insights about money psychology.", isVerified: true },
          { productId: 18, userId: 1, rating: 4, title: "Solid mid-range phone", body: "A54 is great for the price. Display is excellent.", isVerified: true },
          { productId: 19, userId: 1, rating: 4, title: "Best budget 5G phone", body: "Nord CE 3 Lite offers incredible value. 108MP camera is surprisingly good.", isVerified: true },
          { productId: 23, userId: 1, rating: 5, title: "Best wireless earbuds", body: "Sony WF-1000XM5 ANC is class-leading. Sound quality is superb.", isVerified: true },
          { productId: 25, userId: 1, rating: 4, title: "Great smartwatch", body: "Double Tap gesture is cool. Health tracking is comprehensive.", isVerified: true },
          { productId: 30, userId: 1, rating: 4, title: "Good Samsung earbuds", body: "ANC works well for the price. Fit is comfortable.", isVerified: true },
          { productId: 28, userId: 1, rating: 4, title: "Timeless classic", body: "501 is the original. Fit is timeless and comfortable.", isVerified: true },
        ],
      });

      // ─── CART ITEMS ─────────────────────────────────────────────────────
      await tx.cartItem.createMany({
        data: [
          { userId: 1, productId: 1, variantId: 1, quantity: 1 },  // Samsung S24 Ultra Titanium Black 256GB
          { userId: 1, productId: 6, variantId: null, quantity: 1 },  // Sony WH-1000XM5
          { userId: 1, productId: 17, variantId: null, quantity: 2 }, // Sapiens x2
        ],
      });

      // ─── WISHLIST ITEMS ─────────────────────────────────────────────────
      await tx.wishlistItem.createMany({
        data: [
          { userId: 1, productId: 2 },  // iPhone 15 Pro Max
          { userId: 1, productId: 5 },  // MacBook Air M2
          { userId: 1, productId: 9 },  // LG OLED
          { userId: 1, productId: 12 }, // Levi's 511
          { userId: 1, productId: 26 }, // Atomic Habits
        ],
      });

      // ─── ORDERS ─────────────────────────────────────────────────────────
      await tx.order.createMany({
        data: [
          {
            id: 1,
            userId: 1,
            orderNumber: "ORD-20260410-A1B2",
            status: OrderStatus.delivered,
            subtotal: 33489.0,
            discount: 0.0,
            shippingCost: 0.0,
            tax: 6027.86,
            totalAmount: 39516.86,
            paymentMethod: PaymentMethod.credit_card,
            paymentStatus: PaymentStatus.completed,
            shipFullName: "Default User",
            shipPhone: "9876543210",
            shipLine1: "42, MG Road",
            shipLine2: "Koramangala",
            shipCity: "Bengaluru",
            shipState: "Karnataka",
            shipPostal: "560034",
            shipCountry: "India",
          },
          {
            id: 2,
            userId: 1,
            orderNumber: "ORD-20260413-C3D4",
            status: OrderStatus.shipped,
            subtotal: 6499.0,
            discount: 500.0,
            shippingCost: 99.0,
            tax: 1079.82,
            totalAmount: 7177.82,
            paymentMethod: PaymentMethod.upi,
            paymentStatus: PaymentStatus.completed,
            shipFullName: "Default User",
            shipPhone: "9876543210",
            shipLine1: "15, Sector 18",
            shipLine2: "Atta Market",
            shipCity: "Noida",
            shipState: "Uttar Pradesh",
            shipPostal: "201301",
            shipCountry: "India",
          },
        ],
      });

      // ─── ORDER ITEMS ────────────────────────────────────────────────────
      await tx.orderItem.createMany({
        data: [
          // Order 1: S24 Ultra + Sapiens + Atomic Habits
          {
            orderId: 1,
            productId: 1,
            variantId: 1,
            productName: "Samsung Galaxy S24 Ultra",
            variantName: "Titanium Black / 256GB",
            sku: "SAM-S24U-TB-256",
            quantity: 1,
            unitPrice: 129999.0,
            totalPrice: 129999.0,
            imageUrl: "https://picsum.photos/seed/product1a/500/500",
          },
          {
            orderId: 1,
            productId: 17,
            variantId: null,
            productName: "Sapiens: A Brief History of Humankind",
            variantName: null,
            sku: "BOOK-SAPIENS",
            quantity: 1,
            unitPrice: 349.0,
            totalPrice: 349.0,
            imageUrl: "https://picsum.photos/seed/product17a/500/500",
          },
          {
            orderId: 1,
            productId: 26,
            variantId: null,
            productName: "Atomic Habits",
            variantName: null,
            sku: "BOOK-ATOMIC-HABITS",
            quantity: 2,
            unitPrice: 399.0,
            totalPrice: 798.0,
            imageUrl: "https://picsum.photos/seed/product26a/500/500",
          },
          // Order 2: Nike T-Shirt + Levi's Jeans + boAt
          {
            orderId: 2,
            productId: 10,
            variantId: 15,
            productName: "Nike Dri-FIT Running T-Shirt",
            variantName: "Large",
            sku: "NK-DRIFT-L",
            quantity: 1,
            unitPrice: 1295.0,
            totalPrice: 1295.0,
            imageUrl: "https://picsum.photos/seed/product10a/500/500",
          },
          {
            orderId: 2,
            productId: 12,
            variantId: 22,
            productName: "Levi's 511 Slim Fit Jeans",
            variantName: "Waist 32",
            sku: "LEV-511-32",
            quantity: 1,
            unitPrice: 2799.0,
            totalPrice: 2799.0,
            imageUrl: "https://picsum.photos/seed/product12a/500/500",
          },
          {
            orderId: 2,
            productId: 7,
            variantId: null,
            productName: "boAt Rockerz 551ANC",
            variantName: null,
            sku: "BOAT-551ANC",
            quantity: 1,
            unitPrice: 2499.0,
            totalPrice: 2499.0,
            imageUrl: "https://picsum.photos/seed/product7a/500/500",
          },
        ],
      });
    },
    { timeout: 60000 }
  );
}

main()
  .then(() => {
    console.log("Seed completed successfully.");
  })
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
