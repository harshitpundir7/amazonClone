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
          { id: 1, name: "Electronics", slug: "electronics", parentId: null, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=300&fit=crop" },
          { id: 2, name: "Clothing", slug: "clothing", parentId: null, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop" },
          { id: 3, name: "Home & Kitchen", slug: "home-kitchen", parentId: null, sortOrder: 3, imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
          { id: 4, name: "Books", slug: "books", parentId: null, sortOrder: 4, imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop" },
          { id: 5, name: "Sports & Fitness", slug: "sports-fitness", parentId: null, sortOrder: 5, imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
          { id: 6, name: "Toys & Games", slug: "toys-games", parentId: null, sortOrder: 6, imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop" },
          { id: 7, name: "Beauty & Health", slug: "beauty-health", parentId: null, sortOrder: 7, imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop" },
          { id: 8, name: "Automotive", slug: "automotive", parentId: null, sortOrder: 8, imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop" },
          { id: 9, name: "Grocery", slug: "grocery", parentId: null, sortOrder: 9, imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop" },
          { id: 10, name: "Office Products", slug: "office-products", parentId: null, sortOrder: 10, imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop" },
          // Level 2: Under Electronics
          { id: 11, name: "Smartphones", slug: "smartphones", parentId: 1, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa7?w=400&h=300&fit=crop" },
          { id: 12, name: "Laptops", slug: "laptops", parentId: 1, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop" },
          { id: 13, name: "Headphones", slug: "headphones", parentId: 1, sortOrder: 3, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
          { id: 14, name: "Televisions", slug: "televisions", parentId: 1, sortOrder: 4, imageUrl: "https://images.unsplash.com/photo-1593359677879-a6e3233ad4e2?w=400&h=300&fit=crop" },
          // Level 2: Under Clothing
          { id: 15, name: "Men", slug: "mens-clothing", parentId: 2, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop" },
          { id: 16, name: "Women", slug: "womens-clothing", parentId: 2, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=300&fit=crop" },
          // Level 3: Under Men
          { id: 17, name: "T-Shirts", slug: "mens-tshirts", parentId: 15, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop" },
          { id: 18, name: "Jeans", slug: "mens-jeans", parentId: 15, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3832bf3d?w=400&h=300&fit=crop" },
          // Level 2: Under Home & Kitchen
          { id: 19, name: "Kitchen Appliances", slug: "kitchen-appliances", parentId: 3, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
          { id: 20, name: "Furniture", slug: "furniture", parentId: 3, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" },
          // Level 2: Under Books
          { id: 21, name: "Fiction", slug: "fiction", parentId: 4, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop" },
          { id: 22, name: "Non-Fiction", slug: "non-fiction", parentId: 4, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1544944744-04b3c1c9293e?w=400&h=300&fit=crop" },
          // Level 2: Under Sports & Fitness
          { id: 23, name: "Fitness Equipment", slug: "fitness-equipment", parentId: 5, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
          { id: 24, name: "Team Sports", slug: "team-sports", parentId: 5, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop" },
          // Level 2: Under Toys & Games
          { id: 25, name: "Building Toys", slug: "building-toys", parentId: 6, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop" },
          { id: 26, name: "Board Games", slug: "board-games", parentId: 6, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1566576912329-d591f6c2c2e8?w=400&h=300&fit=crop" },
          // Level 2: Under Beauty & Health
          { id: 27, name: "Skincare", slug: "skincare", parentId: 7, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop" },
          { id: 28, name: "Personal Care", slug: "personal-care", parentId: 7, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed1d3e2?w=400&h=300&fit=crop" },
          // Level 2: Under Automotive
          { id: 29, name: "Car Accessories", slug: "car-accessories", parentId: 8, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop" },
          { id: 30, name: "Car Care", slug: "car-care", parentId: 8, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1549317661-4d4bec51c1cf?w=400&h=300&fit=crop" },
          // Level 2: Under Grocery
          { id: 31, name: "Staples", slug: "staples", parentId: 9, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop" },
          { id: 32, name: "Snacks", slug: "snacks", parentId: 9, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1606787366850-de6337344089?w=400&h=300&fit=crop" },
          // Level 2: Under Office Products
          { id: 33, name: "Desk Accessories", slug: "desk-accessories", parentId: 10, sortOrder: 1, imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop" },
          { id: 34, name: "Stationery", slug: "stationery", parentId: 10, sortOrder: 2, imageUrl: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a2?w=400&h=300&fit=crop" },
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
          { id: 11, name: "FitGoal", slug: "fitgoal" },
          { id: 12, name: "PlayBox", slug: "playbox" },
          { id: 13, name: "GlowWell", slug: "glowwell" },
          { id: 14, name: "AutoPro", slug: "autopro" },
          { id: 15, name: "NaturePure", slug: "naturepure" },
          { id: 16, name: "OfficeEx", slug: "officeex" },
          { id: 17, name: "Bose", slug: "bose" },
          { id: 18, name: "JBL", slug: "jbl" },
          { id: 19, name: "ComfortHome", slug: "comforthome" },
          { id: 20, name: "ChefMaster", slug: "chefmaster" },
        ],
      });

      // ─── PRODUCTS ────────────────────────────────────────────────────────
      // Using nested create for products that have variants/images/specs
      // and createMany for simple products, then add relations separately.

      // Create all 30 products first
      await tx.product.createMany({
        data: [
          // Smartphones (category 11)
          {
            id: 1,
            name: "Samsung Galaxy S24 Ultra",
            slug: "samsung-galaxy-s24-ultra",
            brandId: 1,
            categoryId: 11,
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
            categoryId: 11,
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
            categoryId: 11,
            shortDesc: '6.82" 2K LTPO Display, Snapdragon 8 Gen 3, 100W Charging',
            longDesc: "<p>The OnePlus 12 delivers flagship performance with Snapdragon 8 Gen 3, Hasselblad camera system, and ultra-fast 100W SUPERVOOC charging.</p>",
            basePrice: 64999.0,
            mrp: 69999.0,
            avgRating: 4.3,
            reviewCount: 85,
            totalSold: 350,
          },
          // Laptops (category 12)
          {
            id: 4,
            name: "HP Pavilion 15",
            slug: "hp-pavilion-15-i5",
            brandId: 4,
            categoryId: 12,
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
            categoryId: 12,
            shortDesc: '13.6" Liquid Retina, Apple M2 Chip, 8GB RAM, 256GB SSD',
            longDesc: "<p>MacBook Air with M2 chip is strikingly thin and brings an 8-core CPU, 10-core GPU, up to 24GB unified memory, and up to 18 hours of battery life.</p>",
            basePrice: 114900.0,
            mrp: 119900.0,
            avgRating: 4.8,
            reviewCount: 150,
            totalSold: 600,
            isFeatured: true,
          },
          // Headphones (category 13)
          {
            id: 6,
            name: "Sony WH-1000XM5",
            slug: "sony-wh-1000xm5",
            brandId: 3,
            categoryId: 13,
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
            categoryId: 13,
            shortDesc: "Active Noise Cancellation, 40mm Drivers, 100hr Battery",
            longDesc: "<p>boAt Rockerz 551ANC with Hybrid ANC, 40mm dynamic drivers, ENx Technology, and an incredible 100 hours of playback time.</p>",
            basePrice: 2499.0,
            mrp: 4490.0,
            avgRating: 3.9,
            reviewCount: 45,
            totalSold: 1500,
          },
          // Televisions (category 14)
          {
            id: 8,
            name: 'Samsung Crystal 4K 43"',
            slug: "samsung-crystal-4k-43",
            brandId: 1,
            categoryId: 14,
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
            categoryId: 14,
            shortDesc: '55" 4K OLED, a9 Gen4 AI Processor, Dolby Vision & Atmos',
            longDesc: "<p>LG OLED evo C1 with self-lit OLED pixels, a9 Gen4 AI Processor 4K, Dolby Vision IQ, Dolby Atmos, and webOS smart platform.</p>",
            basePrice: 119990.0,
            mrp: 149990.0,
            avgRating: 4.7,
            reviewCount: 55,
            totalSold: 120,
            isFeatured: true,
          },
          // T-Shirts (category 17)
          {
            id: 10,
            name: "Nike Dri-FIT Running T-Shirt",
            slug: "nike-dri-fit-running-tshirt",
            brandId: 6,
            categoryId: 17,
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
            categoryId: 17,
            shortDesc: "100% Cotton, Classic Fit, Crew Neck",
            longDesc: "<p>Levi's classic crew neck t-shirt made from premium 100% cotton jersey for all-day comfort. Machine washable.</p>",
            basePrice: 799.0,
            mrp: 1499.0,
            avgRating: 3.8,
            reviewCount: 22,
            totalSold: 500,
          },
          // Jeans (category 18)
          {
            id: 12,
            name: "Levi's 511 Slim Fit Jeans",
            slug: "levis-511-slim-fit",
            brandId: 5,
            categoryId: 18,
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
            categoryId: 18,
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
            categoryId: 11,
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
            categoryId: 11,
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
            categoryId: 12,
            shortDesc: '15.6" FHD, AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD',
            longDesc: "<p>HP 15s laptop with AMD Ryzen 5 5500U processor, 8GB DDR4 RAM, 512GB PCIe SSD, and AMD Radeon graphics.</p>",
            basePrice: 42990.0,
            mrp: 58321.0,
            avgRating: 3.9,
            reviewCount: 38,
            totalSold: 150,
          },
          // More Clothing (Men category 15)
          {
            id: 21,
            name: "Nike Air Max 270",
            slug: "nike-air-max-270",
            brandId: 6,
            categoryId: 15,
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
            categoryId: 13,
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
            categoryId: 14,
            shortDesc: '65" QLED 4K, Quantum Processor 4K, Object Tracking Sound',
            longDesc: "<p>Samsung Q80C QLED TV with Direct Full Array, Quantum Processor 4K, Object Tracking Sound+, and Smart Hub powered by Tizen.</p>",
            basePrice: 104990.0,
            mrp: 149900.0,
            avgRating: 4.5,
            reviewCount: 30,
            totalSold: 80,
          },
          // Apple Watch (Smartphones category 11)
          {
            id: 25,
            name: "Apple Watch Series 9",
            slug: "apple-watch-series-9-gps-41mm",
            brandId: 2,
            categoryId: 11,
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
            categoryId: 18,
            shortDesc: "Original Fit, Button Fly, 100% Cotton",
            longDesc: "<p>The iconic Levi's 501 Original Fit jeans. The style that started it all since 1873. Button fly, straight leg, sits at the waist.</p>",
            basePrice: 3499.0,
            mrp: 5599.0,
            avgRating: 4.5,
            reviewCount: 55,
            totalSold: 250,
          },
          // More Men (category 15)
          {
            id: 29,
            name: "Nike Revolution 6 Running Shoes",
            slug: "nike-revolution-6-running-shoes",
            brandId: 6,
            categoryId: 15,
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
            categoryId: 13,
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
          { productId: 1, variantId: null, imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e2378842?w=500&h=500&fit=crop", altText: "S24 Ultra Front", sortOrder: 0, isPrimary: true },
          { productId: 1, variantId: null, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa7?w=500&h=500&fit=crop", altText: "S24 Ultra Back", sortOrder: 1, isPrimary: false },
          { productId: 1, variantId: 1, imageUrl: "https://images.unsplash.com/photo-1598327105666-5b24d092b8d5?w=500&h=500&fit=crop", altText: "S24 Ultra Titanium Black", sortOrder: 2, isPrimary: false },
          // iPhone 15 Pro Max
          { productId: 2, variantId: null, imageUrl: "https://images.unsplash.com/photo-1695048133142-b3181d2b7f40?w=500&h=500&fit=crop", altText: "iPhone 15 Pro Max Front", sortOrder: 0, isPrimary: true },
          { productId: 2, variantId: null, imageUrl: "https://images.unsplash.com/photo-1592750427025-9e0c4777e265?w=500&h=500&fit=crop", altText: "iPhone 15 Pro Max Back", sortOrder: 1, isPrimary: false },
          { productId: 2, variantId: 4, imageUrl: "https://images.unsplash.com/photo-1695048133142-b3181d2b7f40?w=500&h=500&fit=crop", altText: "iPhone 15 Pro Max Natural", sortOrder: 2, isPrimary: false },
          // OnePlus 12
          { productId: 3, variantId: null, imageUrl: "https://images.unsplash.com/photo-1598327105666-5b24d092b8d5?w=500&h=500&fit=crop", altText: "OnePlus 12 Front", sortOrder: 0, isPrimary: true },
          { productId: 3, variantId: null, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa7?w=500&h=500&fit=crop", altText: "OnePlus 12 Back", sortOrder: 1, isPrimary: false },
          // HP Pavilion
          { productId: 4, variantId: null, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop", altText: "HP Pavilion Front", sortOrder: 0, isPrimary: true },
          { productId: 4, variantId: null, imageUrl: "https://images.unsplash.com/photo-1525547716367-8cf61758d052?w=500&h=500&fit=crop", altText: "HP Pavilion Open", sortOrder: 1, isPrimary: false },
          // MacBook Air M2
          { productId: 5, variantId: null, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1cc8?w=500&h=500&fit=crop", altText: "MacBook Air M2 Top", sortOrder: 0, isPrimary: true },
          { productId: 5, variantId: null, imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e9f74?w=500&h=500&fit=crop", altText: "MacBook Air M2 Open", sortOrder: 1, isPrimary: false },
          { productId: 5, variantId: 12, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1cc8?w=500&h=500&fit=crop", altText: "MacBook Air M2 Midnight", sortOrder: 2, isPrimary: false },
          // Sony WH-1000XM5
          { productId: 6, variantId: null, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", altText: "Sony XM5 Front", sortOrder: 0, isPrimary: true },
          { productId: 6, variantId: null, imageUrl: "https://images.unsplash.com/photo-1583394838223-9fc2ba066c23?w=500&h=500&fit=crop", altText: "Sony XM5 Side", sortOrder: 1, isPrimary: false },
          // boAt Rockerz 551ANC
          { productId: 7, variantId: null, imageUrl: "https://images.unsplash.com/photo-1484709838915-9b395913d6b2?w=500&h=500&fit=crop", altText: "boAt 551ANC", sortOrder: 0, isPrimary: true },
          // Samsung TV 43"
          { productId: 8, variantId: null, imageUrl: "https://images.unsplash.com/photo-1593359677879-a6e3233ad4e2?w=500&h=500&fit=crop", altText: 'Samsung 43" TV', sortOrder: 0, isPrimary: true },
          // LG OLED 55"
          { productId: 9, variantId: null, imageUrl: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500&h=500&fit=crop", altText: "LG OLED Front", sortOrder: 0, isPrimary: true },
          { productId: 9, variantId: null, imageUrl: "https://images.unsplash.com/photo-1593359677879-a6e3233ad4e2?w=500&h=500&fit=crop", altText: "LG OLED Side", sortOrder: 1, isPrimary: false },
          // Nike Dri-FIT T-Shirt
          { productId: 10, variantId: null, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop", altText: "Nike Dri-FIT T-Shirt", sortOrder: 0, isPrimary: true },
          { productId: 10, variantId: 15, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop", altText: "Nike Dri-FIT Size L", sortOrder: 1, isPrimary: false },
          // Levi's T-Shirt
          { productId: 11, variantId: null, imageUrl: "https://images.unsplash.com/photo-1583743814966-893ee34daf8d?w=500&h=500&fit=crop", altText: "Levis Crew T-Shirt", sortOrder: 0, isPrimary: true },
          // Levi's 511 Jeans
          { productId: 12, variantId: null, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3832bf3d?w=500&h=500&fit=crop", altText: "Levis 511 Front", sortOrder: 0, isPrimary: true },
          { productId: 12, variantId: null, imageUrl: "https://images.unsplash.com/photo-1541097970445-274f6f0072f2?w=500&h=500&fit=crop", altText: "Levis 511 Side", sortOrder: 1, isPrimary: false },
          // Nike Joggers
          { productId: 13, variantId: null, imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", altText: "Nike Joggers", sortOrder: 0, isPrimary: true },
          // Prestige Pressure Cooker
          { productId: 14, variantId: null, imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", altText: "Prestige Pressure Cooker", sortOrder: 0, isPrimary: true },
          // Samsung Refrigerator
          { productId: 15, variantId: null, imageUrl: "https://images.unsplash.com/photo-1571175432247-ca63895e7992?w=500&h=500&fit=crop", altText: "Samsung Fridge", sortOrder: 0, isPrimary: true },
          // Books
          { productId: 16, variantId: null, imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop", altText: "Great Indian Novel", sortOrder: 0, isPrimary: true },
          { productId: 17, variantId: null, imageUrl: "https://images.unsplash.com/photo-1544944744-04b3c1c9293e?w=500&h=500&fit=crop", altText: "Sapiens", sortOrder: 0, isPrimary: true },
          { productId: 26, variantId: null, imageUrl: "https://images.unsplash.com/photo-1524995997947-a306fd4cfd27?w=500&h=500&fit=crop", altText: "Atomic Habits", sortOrder: 0, isPrimary: true },
          { productId: 27, variantId: null, imageUrl: "https://images.unsplash.com/photo-1495446822316-db4d2152f2e0?w=500&h=500&fit=crop", altText: "Psychology of Money", sortOrder: 0, isPrimary: true },
          // Samsung Galaxy A54
          { productId: 18, variantId: null, imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e2378842?w=500&h=500&fit=crop", altText: "A54 Front", sortOrder: 0, isPrimary: true },
          { productId: 18, variantId: 27, imageUrl: "https://images.unsplash.com/photo-1598327105666-5b24d092b8d5?w=500&h=500&fit=crop", altText: "A54 Graphite", sortOrder: 1, isPrimary: false },
          // OnePlus Nord CE 3 Lite
          { productId: 19, variantId: null, imageUrl: "https://images.unsplash.com/photo-1592750427025-9e0c4777e265?w=500&h=500&fit=crop", altText: "Nord CE 3 Lite", sortOrder: 0, isPrimary: true },
          // HP 15s Ryzen
          { productId: 20, variantId: null, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop", altText: "HP 15s Ryzen", sortOrder: 0, isPrimary: true },
          // Nike Air Max 270
          { productId: 21, variantId: null, imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810c9b2?w=500&h=500&fit=crop", altText: "Air Max 270", sortOrder: 0, isPrimary: true },
          { productId: 21, variantId: 32, imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=500&fit=crop", altText: "Air Max 270 UK 8", sortOrder: 1, isPrimary: false },
          // Prestige Induction
          { productId: 22, variantId: null, imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&h=500&fit=crop", altText: "Prestige Induction", sortOrder: 0, isPrimary: true },
          // Sony WF-1000XM5
          { productId: 23, variantId: null, imageUrl: "https://images.unsplash.com/photo-1590658118975-696e4c4c43f0?w=500&h=500&fit=crop", altText: "WF-1000XM5", sortOrder: 0, isPrimary: true },
          { productId: 23, variantId: null, imageUrl: "https://images.unsplash.com/photo-1583394838223-9fc2ba066c23?w=500&h=500&fit=crop", altText: "WF-1000XM5 Case", sortOrder: 1, isPrimary: false },
          // Samsung QLED 65"
          { productId: 24, variantId: null, imageUrl: "https://images.unsplash.com/photo-1593359677879-a6e3233ad4e2?w=500&h=500&fit=crop", altText: "Samsung QLED 65", sortOrder: 0, isPrimary: true },
          // Apple Watch
          { productId: 25, variantId: null, imageUrl: "https://images.unsplash.com/photo-1546868871-af0de0ae4be7?w=500&h=500&fit=crop", altText: "Watch Series 9", sortOrder: 0, isPrimary: true },
          { productId: 25, variantId: null, imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop", altText: "Watch Series 9 Wrist", sortOrder: 1, isPrimary: false },
          // Levi's 501
          { productId: 28, variantId: null, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3832bf3d?w=500&h=500&fit=crop", altText: "Levis 501", sortOrder: 0, isPrimary: true },
          // Nike Revolution 6
          { productId: 29, variantId: null, imageUrl: "https://images.unsplash.com/photo-1542293567-909e5291e7ab?w=500&h=500&fit=crop", altText: "Nike Revolution 6", sortOrder: 0, isPrimary: true },
          // Samsung Galaxy Buds FE
          { productId: 30, variantId: null, imageUrl: "https://images.unsplash.com/photo-1590658118975-696e4c4c43f0?w=500&h=500&fit=crop", altText: "Galaxy Buds FE", sortOrder: 0, isPrimary: true },
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
          { productId: 25, categoryId: 11, isPrimary: false }, // Apple Watch also in Smartphones
          { productId: 21, categoryId: 15, isPrimary: false }, // Nike Air Max also in Men
          { productId: 29, categoryId: 15, isPrimary: false }, // Nike Revolution 6 also in Men
          { productId: 30, categoryId: 13, isPrimary: false }, // Galaxy Buds FE also in Headphones
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
            imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e2378842?w=200&h=200&fit=crop",
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
            imageUrl: "https://images.unsplash.com/photo-1544944744-04b3c1c9293e?w=200&h=200&fit=crop",
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
            imageUrl: "https://images.unsplash.com/photo-1524995997947-a306fd4cfd27?w=200&h=200&fit=crop",
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
            imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
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
            imageUrl: "https://images.unsplash.com/photo-1542272604-787c3832bf3d?w=200&h=200&fit=crop",
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
            imageUrl: "https://images.unsplash.com/photo-1484709838915-9b395913d6b2?w=200&h=200&fit=crop",
          },
        ],
      });

      // ═══════════════════════════════════════════════════════════════════════
      // ─── NEW PRODUCTS (31-150) ────────────────────────────────────────────
      // ═══════════════════════════════════════════════════════════════════════

      await tx.product.createMany({
        data: [
          // ─── Sports & Fitness (categoryId 23 = Fitness Equipment, 24 = Team Sports) ───
          { id: 31, name: "FitGoal Adjustable Dumbbells 20kg Pair", slug: "fitgoal-adjustable-dumbbells-20kg", brandId: 11, categoryId: 23, shortDesc: "Adjustable 2.5-20kg, Anti-Slip Grip, Compact Design", longDesc: "<p>FitGoal adjustable dumbbells with quick-change weight system from 2.5kg to 20kg per dumbbell. Anti-slip textured grip, durable steel construction.</p>", basePrice: 4999.0, mrp: 7999.0, avgRating: 4.3, reviewCount: 65, totalSold: 800 },
          { id: 32, name: "FitGoal Premium Yoga Mat 6mm", slug: "fitgoal-premium-yoga-mat-6mm", brandId: 11, categoryId: 23, shortDesc: "6mm Thick, Non-Slip TPE Material, Carry Strap Included", longDesc: "<p>Premium eco-friendly TPE yoga mat with dual-layer non-slip surface, 6mm cushioning for joint protection, and included carry strap.</p>", basePrice: 999.0, mrp: 1999.0, avgRating: 4.5, reviewCount: 120, totalSold: 2500 },
          { id: 33, name: "FitGoal Foldable Treadmill", slug: "fitgoal-foldable-treadmill", brandId: 11, categoryId: 23, shortDesc: "2.5HP Motor, 12km/h Max Speed, Foldable Design", longDesc: "<p>Compact foldable treadmill with 2.5HP quiet motor, 12km/h max speed, 3-level incline, LED display, and transport wheels.</p>", basePrice: 18999.0, mrp: 29999.0, avgRating: 4.1, reviewCount: 45, totalSold: 300, isFeatured: true },
          { id: 34, name: "FitGoal Resistance Band Set (5 Bands)", slug: "fitgoal-resistance-band-set", brandId: 11, categoryId: 23, shortDesc: "5 Resistance Levels, Latex-Free, Door Anchor Included", longDesc: "<p>Set of 5 resistance bands with varying tensions from light to extra heavy. Includes door anchor, handles, and ankle straps.</p>", basePrice: 599.0, mrp: 1199.0, avgRating: 4.4, reviewCount: 90, totalSold: 1800 },
          { id: 35, name: "Nike Badminton Racket Vapor Pro", slug: "nike-badminton-racket-vapor-pro", brandId: 6, categoryId: 24, shortDesc: "Carbon Fiber Shaft, Isometric Head, 85g Weight", longDesc: "<p>Nike Vapor Pro badminton racket with carbon fiber shaft, isometric head shape for larger sweet spot, and lightweight 85g frame.</p>", basePrice: 2499.0, mrp: 3999.0, avgRating: 4.2, reviewCount: 35, totalSold: 400 },
          { id: 36, name: "SG Kashmir Willow Cricket Bat", slug: "sg-kashmir-willow-cricket-bat", brandId: null, categoryId: 24, shortDesc: "Kashmir Willow, Short Handle, Full Size", longDesc: "<p>SG Kashmir willow cricket bat with traditional shape, short handle, and full-size blade for club-level cricket.</p>", basePrice: 1499.0, mrp: 2499.0, avgRating: 3.9, reviewCount: 28, totalSold: 600 },
          { id: 37, name: "Nike Flight Premier Football", slug: "nike-flight-premier-football", brandId: 6, categoryId: 24, shortDesc: "Size 5, Machine-Stitched, Textured Casing", longDesc: "<p>Nike Flight Premier football with machine-stitched casing, textured surface for better touch, and butyl bladder for air retention.</p>", basePrice: 1295.0, mrp: 1995.0, avgRating: 4.0, reviewCount: 22, totalSold: 350 },
          { id: 38, name: "FitGoal Gym Bag with Shoe Compartment", slug: "fitgoal-gym-bag-shoe-compartment", brandId: 11, categoryId: 23, shortDesc: "45L Capacity, Water-Resistant, Separate Shoe Pocket", longDesc: "<p>Spacious 45L gym bag with separate ventilated shoe compartment, water-resistant polyester, multiple pockets, and padded shoulder strap.</p>", basePrice: 1299.0, mrp: 2499.0, avgRating: 4.3, reviewCount: 55, totalSold: 700 },
          { id: 39, name: "FitGoal Protein Shaker Bottle 700ml", slug: "fitgoal-protein-shaker-700ml", brandId: 11, categoryId: 23, shortDesc: "BPA-Free, Mixing Ball, Leak-Proof Lid", longDesc: "<p>FitGoal protein shaker with 700ml capacity, stainless steel mixing ball, leak-proof flip cap, and BPA-free Tritan material.</p>", basePrice: 349.0, mrp: 699.0, avgRating: 4.1, reviewCount: 40, totalSold: 1200 },
          { id: 40, name: "FitGoal Jump Rope Speed Pro", slug: "fitgoal-jump-rope-speed-pro", brandId: 11, categoryId: 23, shortDesc: "Adjustable Length, Ball Bearing System, Foam Handles", longDesc: "<p>Speed jump rope with ball bearing system for smooth rotation, adjustable cable length, and comfortable foam handles.</p>", basePrice: 349.0, mrp: 599.0, avgRating: 4.5, reviewCount: 70, totalSold: 900 },
          { id: 41, name: "FitGoal Boxing Gloves 12oz", slug: "fitgoal-boxing-gloves-12oz", brandId: 11, categoryId: 23, shortDesc: "PU Leather, Foam Padding, Velcro Closure", longDesc: "<p>FitGoal boxing gloves with premium PU leather, multi-layer foam padding, and secure Velcro wrist closure.</p>", basePrice: 999.0, mrp: 1799.0, avgRating: 4.0, reviewCount: 25, totalSold: 300 },
          { id: 42, name: "FitGoal Sports Watch X200", slug: "fitgoal-sports-watch-x200", brandId: 11, categoryId: 23, shortDesc: "Heart Rate Monitor, IP68 Waterproof, 14-Day Battery", longDesc: "<p>FitGoal X200 sports smartwatch with 24/7 heart rate monitoring, IP68 waterproof, 14-day battery, and 20+ sport modes.</p>", basePrice: 2999.0, mrp: 4999.0, avgRating: 4.2, reviewCount: 55, totalSold: 500, isFeatured: true },

          // ─── Toys & Games (categoryId 25 = Building Toys, 26 = Board Games) ───
          { id: 43, name: "PlayBox Creator Set 1500+ Pieces", slug: "playbox-creator-set-1500-pieces", brandId: 12, categoryId: 25, shortDesc: "1500+ Pieces, 15 Build Options, Ages 8+", longDesc: "<p>PlayBox Creator building set with over 1500 pieces and instructions for 15 different models. Compatible with major building block brands.</p>", basePrice: 3499.0, mrp: 5999.0, avgRating: 4.6, reviewCount: 80, totalSold: 900 },
          { id: 44, name: "PlayBox City Builder Set 800 Pieces", slug: "playbox-city-builder-set-800", brandId: 12, categoryId: 25, shortDesc: "800 Pieces, City Theme, Minifigures Included", longDesc: "<p>PlayBox City Builder with 800+ pieces, city buildings, vehicles, and 8 minifigures. Perfect for creative builders ages 6+.</p>", basePrice: 2499.0, mrp: 3999.0, avgRating: 4.4, reviewCount: 50, totalSold: 600 },
          { id: 45, name: "PlayBox Board Game Collection: Ultimate Strategy", slug: "playbox-ultimate-strategy-board-game", brandId: 12, categoryId: 26, shortDesc: "2-6 Players, Ages 10+, 60-90 Min Play Time", longDesc: "<p>Ultimate Strategy board game for 2-6 players. Build, trade, and conquer in this epic civilization game with variable player powers.</p>", basePrice: 1999.0, mrp: 3499.0, avgRating: 4.5, reviewCount: 35, totalSold: 400 },
          { id: 46, name: "PlayBox Classic Board Game Set (10-in-1)", slug: "playbox-classic-board-game-10-in-1", brandId: 12, categoryId: 26, shortDesc: "Chess, Ludo, Snakes & Ladders, and 7 More Games", longDesc: "<p>Compact 10-in-1 board game set including Chess, Ludo, Snakes & Ladders, Checkers, Backgammon, and more. Magnetic pieces for travel.</p>", basePrice: 799.0, mrp: 1499.0, avgRating: 4.2, reviewCount: 65, totalSold: 1500 },
          { id: 47, name: "Rubik's Cube 3x3 Speed Cube", slug: "rubiks-cube-3x3-speed", brandId: null, categoryId: 26, shortDesc: "Stickerless, Smooth Rotation, Competition Grade", longDesc: "<p>Speed-optimized Rubik's Cube with stickerless design, smooth corner-cutting, and competition-grade tension adjustment.</p>", basePrice: 299.0, mrp: 499.0, avgRating: 4.7, reviewCount: 150, totalSold: 3000 },
          { id: 48, name: "UNO Card Game Family Pack", slug: "uno-card-game-family-pack", brandId: null, categoryId: 26, shortDesc: "Classic + 2 Expansion Decks, Ages 7+", longDesc: "<p>UNO card game family pack with classic deck plus 2 expansion decks for added fun. Easy to learn, endless fun for all ages.</p>", basePrice: 399.0, mrp: 599.0, avgRating: 4.6, reviewCount: 200, totalSold: 5000, isFeatured: true },
          { id: 49, name: "PlayBox Wooden Building Blocks 100 Pieces", slug: "playbox-wooden-building-blocks-100", brandId: 12, categoryId: 25, shortDesc: "100 Pieces, Natural Wood, Non-Toxic Paint, Ages 3+", longDesc: "<p>PlayBox natural wooden building blocks with 100 pieces in various shapes and colors. Non-toxic paint, smooth edges, safe for toddlers.</p>", basePrice: 899.0, mrp: 1599.0, avgRating: 4.5, reviewCount: 45, totalSold: 700 },
          { id: 50, name: "PlayBox Puzzle 1000 Pieces - World Map", slug: "playbox-puzzle-1000-world-map", brandId: 12, categoryId: 26, shortDesc: "1000 Pieces, Premium Cardboard, 70x50cm Finished", longDesc: "<p>Beautiful world map jigsaw puzzle with 1000 pieces on premium thick cardboard. Finished size 70x50cm. Includes reference poster.</p>", basePrice: 599.0, mrp: 999.0, avgRating: 4.3, reviewCount: 30, totalSold: 450 },
          { id: 51, name: "PlayBox Action Figure Robot Warrior", slug: "playbox-action-figure-robot-warrior", brandId: 12, categoryId: 25, shortDesc: "12-Inch, Articulated Joints, Light & Sound Effects", longDesc: "<p>12-inch robot warrior action figure with 20+ articulated joints, LED light effects, sound effects, and accessory weapons.</p>", basePrice: 1499.0, mrp: 2499.0, avgRating: 4.1, reviewCount: 25, totalSold: 300 },
          { id: 52, name: "PlayBox RC Drone Mini Flyer", slug: "playbox-rc-drone-mini-flyer", brandId: 12, categoryId: 26, shortDesc: "Foldable, 4K Camera, 20-Min Flight Time, GPS", longDesc: "<p>Mini foldable drone with 4K camera, GPS positioning, altitude hold, and 20 minutes of flight time. Includes carrying case.</p>", basePrice: 7999.0, mrp: 12999.0, avgRating: 4.0, reviewCount: 20, totalSold: 150 },
          { id: 53, name: "PlayBox Play-Doh Creative Set 12 Colors", slug: "playbox-play-doh-creative-set-12", brandId: 12, categoryId: 25, shortDesc: "12 Colors, Shape Cutters, Roller, Ages 3+", longDesc: "<p>Creative Play-Doh set with 12 vibrant colors, shape cutters, rolling pin, and sculpting tools. Non-toxic and safe for children.</p>", basePrice: 499.0, mrp: 899.0, avgRating: 4.4, reviewCount: 55, totalSold: 1000 },
          { id: 54, name: "PlayBox Chess & Checkers Wooden Set", slug: "playbox-chess-checkers-wooden-set", brandId: 12, categoryId: 26, shortDesc: "Handcrafted Wooden Board, Magnetic Pieces, Foldable", longDesc: "<p>Elegant handcrafted wooden chess and checkers set with magnetic pieces, foldable board with storage, and King height 3 inches.</p>", basePrice: 1299.0, mrp: 2499.0, avgRating: 4.5, reviewCount: 40, totalSold: 500 },

          // ─── Beauty & Health (categoryId 27 = Skincare, 28 = Personal Care) ───
          { id: 55, name: "GlowWell Vitamin C Face Moisturizer", slug: "glowwell-vitamin-c-moisturizer", brandId: 13, categoryId: 27, shortDesc: "SPF 30, Vitamin C & Hyaluronic Acid, 50ml", longDesc: "<p>GlowWell daily moisturizer with Vitamin C for brightening, Hyaluronic Acid for hydration, and SPF 30 sun protection. Suitable for all skin types.</p>", basePrice: 599.0, mrp: 999.0, avgRating: 4.3, reviewCount: 85, totalSold: 2000 },
          { id: 56, name: "GlowWell Sunscreen SPF 50+ Gel", slug: "glowwell-sunscreen-spf50-gel", brandId: 13, categoryId: 27, shortDesc: "SPF 50+ PA+++, Oil-Free Gel, No White Cast", longDesc: "<p>GlowWell lightweight sunscreen gel with SPF 50+ PA+++ protection, oil-free formula that leaves no white cast. Water-resistant for 80 minutes.</p>", basePrice: 499.0, mrp: 799.0, avgRating: 4.5, reviewCount: 120, totalSold: 3500, isFeatured: true },
          { id: 57, name: "GlowWell Hair Serum Argan Oil", slug: "glowwell-hair-serum-argan", brandId: 13, categoryId: 28, shortDesc: "Argan Oil + Keratin, Frizz Control, 100ml", longDesc: "<p>GlowWell hair serum with Moroccan argan oil and keratin proteins for smooth, frizz-free hair. Protects from heat styling up to 230°C.</p>", basePrice: 399.0, mrp: 699.0, avgRating: 4.2, reviewCount: 60, totalSold: 1500 },
          { id: 58, name: "GlowWell Charcoal Face Wash", slug: "glowwell-charcoal-face-wash", brandId: 13, categoryId: 27, shortDesc: "Activated Charcoal, Deep Cleansing, Oil Control, 150ml", longDesc: "<p>GlowWell activated charcoal face wash for deep pore cleansing, oil control, and acne prevention. Gentle formula suitable for daily use.</p>", basePrice: 249.0, mrp: 449.0, avgRating: 4.1, reviewCount: 95, totalSold: 2500 },
          { id: 59, name: "GlowWell Matte Lipstick Collection", slug: "glowwell-matte-lipstick-collection", brandId: 13, categoryId: 28, shortDesc: "Set of 4, Long-Lasting Matte, Vitamin E Enriched", longDesc: "<p>Set of 4 trendy matte lipsticks enriched with Vitamin E. Long-lasting 8-hour wear, smudge-proof, and transfer-resistant formula.</p>", basePrice: 699.0, mrp: 1299.0, avgRating: 4.4, reviewCount: 45, totalSold: 800 },
          { id: 60, name: "GlowWell Nail Polish Gel Set 6 Colors", slug: "glowwell-nail-polish-gel-set", brandId: 13, categoryId: 28, shortDesc: "6 Gel Colors, UV Lamp Required, 14-Day Wear", longDesc: "<p>Professional gel nail polish set with 6 trending colors. Requires UV/LED lamp for curing. Up to 14-day chip-free wear.</p>", basePrice: 899.0, mrp: 1499.0, avgRating: 4.0, reviewCount: 30, totalSold: 500 },
          { id: 61, name: "GlowWell Body Lotion Shea Butter 400ml", slug: "glowwell-body-lotion-shea-butter", brandId: 13, categoryId: 28, shortDesc: "Shea Butter & Cocoa, 48-Hour Moisturization", longDesc: "<p>GlowWell body lotion with shea butter and cocoa for deep 48-hour moisturization. Fast-absorbing, non-greasy formula.</p>", basePrice: 349.0, mrp: 599.0, avgRating: 4.3, reviewCount: 70, totalSold: 1800 },
          { id: 62, name: "GlowWell Anti-Dandruff Shampoo 300ml", slug: "glowwell-anti-dandruff-shampoo", brandId: 13, categoryId: 28, shortDesc: "Ketoconazole 2%, Clinically Proven, 300ml", longDesc: "<p>GlowWell anti-dandruff shampoo with 2% Ketoconazole. Clinically proven to eliminate dandruff and prevent recurrence.</p>", basePrice: 299.0, mrp: 499.0, avgRating: 4.1, reviewCount: 88, totalSold: 2200 },
          { id: 63, name: "GlowWell Eye Shadow Palette 18 Shades", slug: "glowwell-eye-shadow-palette-18", brandId: 13, categoryId: 28, shortDesc: "18 Matte & Shimmer Shades, Highly Pigmented", longDesc: "<p>Professional eye shadow palette with 18 highly pigmented shades in matte and shimmer finishes. Includes mirror and dual-end brush.</p>", basePrice: 1299.0, mrp: 2199.0, avgRating: 4.5, reviewCount: 35, totalSold: 600 },
          { id: 64, name: "GlowWell Sheet Mask Pack of 7", slug: "glowwell-sheet-mask-pack-7", brandId: 13, categoryId: 27, shortDesc: "7 Different Masks, Hyaluronic Acid & Vitamin E", longDesc: "<p>Pack of 7 hydrating sheet masks with different active ingredients: Aloe, Green Tea, Pomegranate, Charcoal, Vitamin C, Snail, and Honey.</p>", basePrice: 499.0, mrp: 899.0, avgRating: 4.2, reviewCount: 50, totalSold: 1200 },
          { id: 65, name: "GlowWell Eau de Parfum 50ml", slug: "glowwell-eau-de-parfum-50ml", brandId: 13, categoryId: 28, shortDesc: "Floral Woody, Long-Lasting 8-Hour, 50ml", longDesc: "<p>GlowWell Eau de Parfum with floral woody notes. Top: bergamot and pink pepper. Heart: jasmine and rose. Base: sandalwood and vanilla.</p>", basePrice: 1299.0, mrp: 2499.0, avgRating: 4.4, reviewCount: 40, totalSold: 500 },
          { id: 66, name: "GlowWell Men's Shaving Cream 150ml", slug: "glowwell-mens-shaving-cream", brandId: 13, categoryId: 28, shortDesc: "Rich Lather, Aloe Vera, Sensitive Skin Formula", longDesc: "<p>GlowWell shaving cream with rich lather, aloe vera for soothing, and specially formulated for sensitive skin. Provides smooth razor glide.</p>", basePrice: 249.0, mrp: 449.0, avgRating: 4.0, reviewCount: 32, totalSold: 800 },

          // ─── Automotive (categoryId 29 = Car Accessories, 30 = Car Care) ───
          { id: 67, name: "AutoPro Magnetic Car Phone Mount", slug: "autopro-magnetic-car-phone-mount", brandId: 14, categoryId: 29, shortDesc: "N52 Magnets, 360° Rotation, Dashboard Mount", longDesc: "<p>AutoPro magnetic car phone mount with N52 neodymium magnets, 360° rotation, and strong adhesive dashboard mount. One-hand operation.</p>", basePrice: 499.0, mrp: 999.0, avgRating: 4.3, reviewCount: 95, totalSold: 2500 },
          { id: 68, name: "AutoPro Dash Camera 1080P", slug: "autopro-dash-camera-1080p", brandId: 14, categoryId: 29, shortDesc: "1080P Full HD, Night Vision, 170° Wide Angle, G-Sensor", longDesc: "<p>AutoPro dash camera with 1080P Full HD recording, enhanced night vision, 170° wide angle lens, G-sensor for emergency recording, and loop recording.</p>", basePrice: 2999.0, mrp: 4999.0, avgRating: 4.2, reviewCount: 55, totalSold: 800, isFeatured: true },
          { id: 69, name: "AutoPro Car Vacuum Cleaner 12V", slug: "autopro-car-vacuum-12v", brandId: 14, categoryId: 30, shortDesc: "6000Pa Suction, 12V Car Plug, HEPA Filter", longDesc: "<p>AutoPro portable car vacuum cleaner with 6000Pa suction power, 12V car adapter, washable HEPA filter, and 3 nozzle attachments.</p>", basePrice: 999.0, mrp: 1999.0, avgRating: 3.9, reviewCount: 42, totalSold: 600 },
          { id: 70, name: "AutoPro Car Seat Covers Universal Fit", slug: "autopro-car-seat-covers-universal", brandId: 14, categoryId: 29, shortDesc: "PU Leather, Airbag Compatible, Set of 9 Pieces", longDesc: "<p>AutoPro universal fit PU leather car seat covers. Airbag compatible, set of 9 pieces covering front and rear seats. Breathable mesh backing.</p>", basePrice: 2999.0, mrp: 4999.0, avgRating: 4.0, reviewCount: 38, totalSold: 500 },
          { id: 71, name: "AutoPro Car Air Freshener Set of 3", slug: "autopro-car-air-freshener-set-3", brandId: 14, categoryId: 30, shortDesc: "3 Fragrances, 45-Day Each, Vent Clip Design", longDesc: "<p>AutoPro vent clip car air fresheners with 3 premium fragrances: Ocean Breeze, Lavender Fields, and Citrus Burst. Each lasts up to 45 days.</p>", basePrice: 349.0, mrp: 599.0, avgRating: 4.1, reviewCount: 50, totalSold: 1500 },
          { id: 72, name: "AutoPro Digital Tyre Inflator", slug: "autopro-digital-tyre-inflator", brandId: 14, categoryId: 30, shortDesc: "12V, Auto-Shutoff, Digital Pressure Gauge, LED Light", longDesc: "<p>AutoPro digital tyre inflator with 12V car adapter, preset pressure auto-shutoff, LCD display, and built-in LED emergency light.</p>", basePrice: 1299.0, mrp: 2499.0, avgRating: 4.4, reviewCount: 65, totalSold: 900 },
          { id: 73, name: "AutoPro Car Jump Starter 12000mAh", slug: "autopro-car-jump-starter-12000mah", brandId: 14, categoryId: 29, shortDesc: "12000mAh, Peak 1000A, USB Charging, LED Flashlight", longDesc: "<p>AutoPro portable car jump starter with 12000mAh capacity, peak 1000A current for up to 6L petrol/4L diesel engines. USB-C charging, LED flashlight.</p>", basePrice: 3999.0, mrp: 6999.0, avgRating: 4.5, reviewCount: 30, totalSold: 300 },
          { id: 74, name: "AutoPro Car Body Cover Waterproof", slug: "autopro-car-body-cover-waterproof", brandId: 14, categoryId: 30, shortDesc: "Universal Sedan, UV Protection, Mirror Pockets", longDesc: "<p>AutoPro waterproof car body cover for sedans. Multi-layer protection with UV coating, breathable fabric, and mirror pocket design.</p>", basePrice: 699.0, mrp: 1299.0, avgRating: 4.0, reviewCount: 45, totalSold: 700 },
          { id: 75, name: "AutoPro 3D Car Floor Mats Set", slug: "autopro-3d-car-floor-mats-set", brandId: 14, categoryId: 29, shortDesc: "TPE Material, Anti-Skid, Set of 5, Odorless", longDesc: "<p>AutoPro 3D car floor mats made from eco-friendly TPE material. Anti-skid design, laser-measured fit, set of 5 pieces, and odorless.</p>", basePrice: 1499.0, mrp: 2999.0, avgRating: 4.3, reviewCount: 55, totalSold: 800 },
          { id: 76, name: "AutoPro LED Headlight H4 12000LM", slug: "autopro-led-headlight-h4-12000lm", brandId: 14, categoryId: 29, shortDesc: "H4 Socket, 6000K White, 12000LM Pair, CANbus Ready", longDesc: "<p>AutoPro LED headlight conversion kit with H4 socket, 6000K cool white, 12000LM per pair, built-in CANbus driver, and 50,000-hour lifespan.</p>", basePrice: 1999.0, mrp: 3499.0, avgRating: 4.2, reviewCount: 40, totalSold: 500 },
          { id: 77, name: "AutoPro Steering Wheel Cover Leather", slug: "autopro-steering-wheel-cover-leather", brandId: 14, categoryId: 29, shortDesc: "PU Leather, Anti-Slip, 38cm Universal, Black", longDesc: "<p>AutoPro steering wheel cover with premium PU leather, anti-skid inner ring, universal 38cm fit, and easy installation without tools.</p>", basePrice: 499.0, mrp: 899.0, avgRating: 4.0, reviewCount: 35, totalSold: 600 },
          { id: 78, name: "AutoPro Windshield Wiper Blades Set", slug: "autopro-windshield-wiper-blades-set", brandId: 14, categoryId: 30, shortDesc: "Beam Style, All-Season, Set of 2 (24\"+16\")", longDesc: "<p>AutoPro beam-style wiper blade set with aerodynamic design for quiet operation. All-season performance, easy hook installation.</p>", basePrice: 599.0, mrp: 1199.0, avgRating: 4.1, reviewCount: 28, totalSold: 400 },

          // ─── Grocery (categoryId 31 = Staples, 32 = Snacks) ───
          { id: 79, name: "NaturePure Daawat Basmati Rice 5kg", slug: "naturepure-daawat-basmati-rice-5kg", brandId: 15, categoryId: 31, shortDesc: "Extra Long Grain, Aged 2 Years, 5kg Bag", longDesc: "<p>NaturePure Daawat extra-long grain basmati rice, aged for 2 years for maximum aroma and fluffiness. Ideal for biryani and pulao.</p>", basePrice: 599.0, mrp: 780.0, avgRating: 4.5, reviewCount: 180, totalSold: 8000 },
          { id: 80, name: "NaturePure Toor Dal 2kg", slug: "naturepure-toor-dal-2kg", brandId: 15, categoryId: 31, shortDesc: "Premium Quality, Polished, 2kg Pack", longDesc: "<p>NaturePure premium toor dal, machine-cleaned and polished for consistent quality. Rich in protein and dietary fiber.</p>", basePrice: 249.0, mrp: 340.0, avgRating: 4.3, reviewCount: 95, totalSold: 5000 },
          { id: 81, name: "NaturePure Mustard Oil 1L", slug: "naturepure-mustard-oil-1l", brandId: 15, categoryId: 31, shortDesc: "Cold Pressed, Kacchi Ghani, 1L Bottle", longDesc: "<p>NaturePure cold-pressed Kacchi Ghani mustard oil with natural pungency and aroma. Traditional wood-pressed method preserves nutrients.</p>", basePrice: 199.0, mrp: 280.0, avgRating: 4.4, reviewCount: 75, totalSold: 4000 },
          { id: 82, name: "NaturePure Organic Honey 500g", slug: "naturepure-organic-honey-500g", brandId: 15, categoryId: 31, shortDesc: "100% Pure, NMR Tested, 500g Glass Jar", longDesc: "<p>NaturePure 100% pure organic honey, NMR tested for authenticity. Raw, unprocessed honey from Himalayan flora. No added sugar or preservatives.</p>", basePrice: 449.0, mrp: 650.0, avgRating: 4.2, reviewCount: 60, totalSold: 2500 },
          { id: 83, name: "NaturePure Green Tea Bags 100 Count", slug: "naturepure-green-tea-bags-100", brandId: 15, categoryId: 32, shortDesc: "100 Tea Bags, Antioxidant Rich, No Artificial Flavour", longDesc: "<p>NaturePure green tea with 100 individually wrapped tea bags. High in antioxidants, zero calories, no artificial flavors or colors.</p>", basePrice: 299.0, mrp: 499.0, avgRating: 4.1, reviewCount: 88, totalSold: 3500 },
          { id: 84, name: "NaturePure Almond Butter Crunchy 350g", slug: "naturepure-almond-butter-crunchy", brandId: 15, categoryId: 32, shortDesc: "100% Almonds, No Palm Oil, No Added Sugar", longDesc: "<p>NaturePure crunchy almond butter made from 100% roasted almonds. No palm oil, no added sugar, no preservatives. Rich in Vitamin E.</p>", basePrice: 549.0, mrp: 799.0, avgRating: 4.5, reviewCount: 35, totalSold: 800 },
          { id: 85, name: "NaturePure Quinoa 500g", slug: "naturepure-quinoa-500g", brandId: 15, categoryId: 31, shortDesc: "White Quinoa, Protein-Rich, Gluten-Free, 500g", longDesc: "<p>NaturePure white quinoa, a complete protein source with all 9 essential amino acids. Gluten-free, easy to cook in 15 minutes.</p>", basePrice: 399.0, mrp: 599.0, avgRating: 4.3, reviewCount: 28, totalSold: 700 },
          { id: 86, name: "NaturePure Dark Chocolate 72% 100g", slug: "naturepure-dark-chocolate-72-100g", brandId: 15, categoryId: 32, shortDesc: "72% Cocoa, Belgian Recipe, No Artificial Flavours, 100g", longDesc: "<p>NaturePure dark chocolate made with 72% cocoa using a Belgian recipe. Rich antioxidant content, no artificial flavors or preservatives.</p>", basePrice: 149.0, mrp: 250.0, avgRating: 4.6, reviewCount: 110, totalSold: 5000, isFeatured: true },
          { id: 87, name: "NaturePure Mixed Dry Fruits 500g", slug: "naturepure-mixed-dry-fruits-500g", brandId: 15, categoryId: 32, shortDesc: "Almonds, Cashews, Raisins, Pistachios, 500g", longDesc: "<p>NaturePure premium mixed dry fruits pack with California almonds, W240 cashews, Afghan raisins, and Iranian pistachios. Grade A quality.</p>", basePrice: 699.0, mrp: 999.0, avgRating: 4.4, reviewCount: 55, totalSold: 2000 },
          { id: 88, name: "NaturePure A2 Cow Ghee 500ml", slug: "naturepure-a2-cow-ghee-500ml", brandId: 15, categoryId: 31, shortDesc: "A2 Gir Cow, Vedic Bilona Method, 500ml Jar", longDesc: "<p>NaturePure A2 cow ghee from Gir cow milk using traditional Vedic Bilona method. Hand-churned, rich aroma, granular texture.</p>", basePrice: 699.0, mrp: 999.0, avgRating: 4.7, reviewCount: 70, totalSold: 1800 },
          { id: 89, name: "NaturePure Instant Coffee Powder 200g", slug: "naturepure-instant-coffee-200g", brandId: 15, categoryId: 32, shortDesc: "Freeze-Dried, Medium Roast, 200g Jar", longDesc: "<p>NaturePure freeze-dried instant coffee with smooth medium roast flavor. Made from 100% Arabica beans sourced from Coorg.</p>", basePrice: 399.0, mrp: 599.0, avgRating: 4.2, reviewCount: 65, totalSold: 2200 },
          { id: 90, name: "NaturePure Protein Bars 6-Pack", slug: "naturepure-protein-bars-6-pack", brandId: 15, categoryId: 32, shortDesc: "20g Protein Each, No Added Sugar, 6 Bars", longDesc: "<p>NaturePure protein bars with 20g protein per bar. No added sugar, no artificial sweeteners. Flavors: Chocolate Almond, Berry Crunch, Peanut Butter.</p>", basePrice: 549.0, mrp: 900.0, avgRating: 4.0, reviewCount: 40, totalSold: 1000 },

          // ─── Office Products (categoryId 33 = Desk Accessories, 34 = Stationery) ───
          { id: 91, name: "OfficeEx Ergonomic Office Chair", slug: "officeex-ergonomic-office-chair", brandId: 16, categoryId: 33, shortDesc: "Lumbar Support, Mesh Back, Adjustable Height, 120kg Max", longDesc: "<p>OfficeEx ergonomic office chair with adjustable lumbar support, breathable mesh back, 3D armrests, and height adjustment. Supports up to 120kg.</p>", basePrice: 8999.0, mrp: 14999.0, avgRating: 4.3, reviewCount: 45, totalSold: 400, isFeatured: true },
          { id: 92, name: "OfficeEx LED Desk Lamp with Wireless Charger", slug: "officeex-led-desk-lamp-wireless-charger", brandId: 16, categoryId: 33, shortDesc: "5 Color Modes, 7 Brightness Levels, Qi Charging", longDesc: "<p>OfficeEx LED desk lamp with 5 color temperatures, 7 brightness levels, built-in Qi wireless charger, and USB-A charging port.</p>", basePrice: 1999.0, mrp: 3499.0, avgRating: 4.5, reviewCount: 38, totalSold: 500 },
          { id: 93, name: "OfficeEx Premium Pen Set 12 Pieces", slug: "officeex-premium-pen-set-12", brandId: 16, categoryId: 34, shortDesc: "6 Ballpoint + 6 Gel Pens, Gift Box, Smooth Writing", longDesc: "<p>OfficeEx premium pen set with 6 ballpoint pens and 6 gel pens in an elegant gift box. 0.5mm fine tip, smooth writing experience.</p>", basePrice: 399.0, mrp: 699.0, avgRating: 4.2, reviewCount: 55, totalSold: 1200 },
          { id: 94, name: "OfficeEx Notebook Set A5 3-Pack", slug: "officeex-notebook-set-a5-3-pack", brandId: 16, categoryId: 34, shortDesc: "3 Hard Cover Notebooks, 200 Pages Each, Dotted Grid", longDesc: "<p>Set of 3 A5 hardcover notebooks with 200 dotted grid pages each. 100gsm acid-free paper, lay-flat binding, elastic closure.</p>", basePrice: 499.0, mrp: 899.0, avgRating: 4.4, reviewCount: 42, totalSold: 800 },
          { id: 95, name: "OfficeEx Heavy Duty Stapler", slug: "officeex-heavy-duty-stapler", brandId: 16, categoryId: 34, shortDesc: "50-Sheet Capacity, All-Metal Body, Upto 26/6 Staples", longDesc: "<p>OfficeEx heavy-duty desktop stapler with all-metal construction. 50-sheet capacity, accepts 26/6 and 24/6 staples, built-in staple remover.</p>", basePrice: 299.0, mrp: 499.0, avgRating: 4.0, reviewCount: 30, totalSold: 600 },
          { id: 96, name: "OfficeEx Magnetic Whiteboard 90x60cm", slug: "officeex-magnetic-whiteboard-90x60", brandId: 16, categoryId: 33, shortDesc: "90x60cm, Aluminium Frame, Pen Tray, Wall Mount", longDesc: "<p>OfficeEx magnetic whiteboard with smooth lacquered steel surface, aluminium frame, marker tray, and wall mounting hardware included.</p>", basePrice: 1999.0, mrp: 3499.0, avgRating: 4.1, reviewCount: 25, totalSold: 300 },
          { id: 97, name: "OfficeEx File Organizer Desktop", slug: "officeex-file-organizer-desktop", brandId: 16, categoryId: 33, shortDesc: "5 Compartments, Mesh Metal, Non-Slip Base", longDesc: "<p>OfficeEx desktop file organizer with 5 vertical compartments, heavy-duty mesh metal construction, and non-slip rubber base.</p>", basePrice: 699.0, mrp: 1299.0, avgRating: 4.3, reviewCount: 35, totalSold: 500 },
          { id: 98, name: "OfficeEx Monitor Stand Riser", slug: "officeex-monitor-stand-riser", brandId: 16, categoryId: 33, shortDesc: "Tempered Glass, Adjustable Height, Cable Management", longDesc: "<p>OfficeEx monitor stand with tempered glass top, 3-level adjustable height, integrated cable management, and 30kg weight capacity.</p>", basePrice: 1999.0, mrp: 3499.0, avgRating: 4.4, reviewCount: 28, totalSold: 350 },
          { id: 99, name: "OfficeEx Mechanical Pencil Set", slug: "officeex-mechanical-pencil-set", brandId: 16, categoryId: 34, shortDesc: "3 Sizes (0.3/0.5/0.7mm), Metal Body, 12 Lead Refills", longDesc: "<p>OfficeEx mechanical pencil set with 3 metal-body pencils in 0.3mm, 0.5mm, and 0.7mm sizes. Includes 12 lead refills and eraser.</p>", basePrice: 349.0, mrp: 599.0, avgRating: 4.5, reviewCount: 40, totalSold: 700 },
          { id: 100, name: "OfficeEx A4 Printer Paper 500 Sheets", slug: "officeex-a4-printer-paper-500", brandId: 16, categoryId: 34, shortDesc: "80gsm, Bright White, 500 Sheets, Inkjet/Laser", longDesc: "<p>OfficeEx premium A4 printer paper, 80gsm bright white. Suitable for inkjet and laser printers. 500 sheets per ream.</p>", basePrice: 349.0, mrp: 499.0, avgRating: 4.2, reviewCount: 55, totalSold: 2000 },
          { id: 101, name: "OfficeEx Ergonomic Mouse Pad with Wrist Rest", slug: "officeex-mouse-pad-wrist-rest", brandId: 16, categoryId: 33, shortDesc: "Gel Wrist Rest, Non-Slip Base, Smooth Surface", longDesc: "<p>OfficeEx ergonomic mouse pad with memory foam wrist rest, smooth lycra surface, and non-slip rubber base. Reduces wrist strain.</p>", basePrice: 399.0, mrp: 699.0, avgRating: 4.1, reviewCount: 38, totalSold: 900 },
          { id: 102, name: "OfficeEx Desk Organizer Multi-Compartment", slug: "officeex-desk-organizer-multi", brandId: 16, categoryId: 33, shortDesc: "Bamboo Wood, 6 Slots, Phone Stand, Letter Tray", longDesc: "<p>OfficeEx natural bamboo desk organizer with 6 compartments, phone stand slot, and letter tray. Eco-friendly and elegant design.</p>", basePrice: 899.0, mrp: 1599.0, avgRating: 4.5, reviewCount: 30, totalSold: 450 },

          // ─── Women's Clothing (categoryId 16) ───
          { id: 103, name: "Woven Craft Embroidered Kurti", slug: "woven-craft-embroidered-kurti", brandId: null, categoryId: 16, shortDesc: "Cotton, Anarkali Style, 3/4 Sleeves, Size S-XXL", longDesc: "<p>Beautiful embroidered Anarkali kurti in pure cotton with intricate thread work. 3/4 sleeves, round neck, flared hem.</p>", basePrice: 899.0, mrp: 1799.0, avgRating: 4.2, reviewCount: 45, totalSold: 700 },
          { id: 104, name: "Nike Women's Running Shoes Pegasus 40", slug: "nike-womens-running-shoes-pegasus-40", brandId: 6, categoryId: 16, shortDesc: "React Foam, Zoom Air Unit, Breathable Mesh", longDesc: "<p>Nike Pegasus 40 women's running shoes with React foam midsole, Zoom Air unit for responsiveness, and breathable mesh upper.</p>", basePrice: 8995.0, mrp: 10995.0, avgRating: 4.5, reviewCount: 60, totalSold: 500 },
          { id: 105, name: "Levi's Women's 711 Skinny Jeans", slug: "levis-womens-711-skinny-jeans", brandId: 5, categoryId: 16, shortDesc: "Skinny Fit, Stretch Denim, Mid Rise, 77% Cotton", longDesc: "<p>Levi's 711 Skinny women's jeans with super-stretch denim for a flattering fit. Mid rise, sits at the waist, skinny through the leg.</p>", basePrice: 2299.0, mrp: 3999.0, avgRating: 4.3, reviewCount: 42, totalSold: 400 },
          { id: 106, name: "Lavie Women's Handbag Tote", slug: "lavie-womens-handbag-tote", brandId: null, categoryId: 16, shortDesc: "PU Leather, Spacious, Laptop Compartment, Beige", longDesc: "<p>Lavie women's tote handbag in premium PU leather. Spacious interior with laptop compartment, zip pockets, and detachable shoulder strap.</p>", basePrice: 1799.0, mrp: 3499.0, avgRating: 4.1, reviewCount: 35, totalSold: 600 },
          { id: 107, name: "Nike Women's Sandals Solar Slide", slug: "nike-womens-solar-slide", brandId: 6, categoryId: 16, shortDesc: "Synthetic, Solarsoft Foam, Adjustable Strap", longDesc: "<p>Nike Solar Slide women's sandals with Solarsoft foam midsole for cushioning, adjustable midfoot strap, and durable rubber outsole.</p>", basePrice: 1495.0, mrp: 2195.0, avgRating: 4.0, reviewCount: 28, totalSold: 350 },
          { id: 108, name: "Fabindia Cotton Printed Scarf", slug: "fabindia-cotton-printed-scarf", brandId: null, categoryId: 16, shortDesc: "Hand-Block Printed, 100% Cotton, 180x70cm", longDesc: "<p>Fabindia hand-block printed cotton scarf with traditional Indian motifs. Lightweight, breathable, 180x70cm size. Ethically crafted.</p>", basePrice: 599.0, mrp: 999.0, avgRating: 4.4, reviewCount: 22, totalSold: 450 },

          // ─── Kitchen Appliances (categoryId 19) ───
          { id: 109, name: "ChefMaster Mixer Grinder 750W 3 Jars", slug: "chefmaster-mixer-grinder-750w", brandId: 20, categoryId: 19, shortDesc: "750W Motor, 3 Stainless Steel Jars, 3 Speed Control", longDesc: "<p>ChefMaster 750W mixer grinder with 3 stainless steel jars (1.5L, 1L, 0.4L). 3-speed control with pulse function, overload protection.</p>", basePrice: 2999.0, mrp: 4999.0, avgRating: 4.2, reviewCount: 75, totalSold: 1500 },
          { id: 110, name: "ChefMaster Digital Air Fryer 4.5L", slug: "chefmaster-digital-air-fryer-4-5l", brandId: 20, categoryId: 19, shortDesc: "4.5L Capacity, 8 Presets, 360° Air Circulation", longDesc: "<p>ChefMaster digital air fryer with 4.5L basket, 8 preset cooking programs, 360° rapid air circulation, and non-stick basket.</p>", basePrice: 4999.0, mrp: 8999.0, avgRating: 4.5, reviewCount: 55, totalSold: 800, isFeatured: true },
          { id: 111, name: "ChefMaster 2-Slice Pop-Up Toaster", slug: "chefmaster-2-slice-pop-up-toaster", brandId: 20, categoryId: 19, shortDesc: "2-Slice, 6 Browning Levels, Defrost & Reheat", longDesc: "<p>ChefMaster 2-slice pop-up toaster with 6 browning levels, defrost function, reheat function, and removable crumb tray.</p>", basePrice: 1299.0, mrp: 2199.0, avgRating: 4.0, reviewCount: 40, totalSold: 600 },
          { id: 112, name: "ChefMaster Power Blender 1.5L", slug: "chefmaster-power-blender-1-5l", brandId: 20, categoryId: 19, shortDesc: "500W, 1.5L Unbreakable Jar, 3 Speed + Pulse", longDesc: "<p>ChefMaster power blender with 500W motor, 1.5L unbreakable polycarbonate jar, 3-speed settings with pulse, and stainless steel blades.</p>", basePrice: 1499.0, mrp: 2499.0, avgRating: 4.1, reviewCount: 35, totalSold: 500 },
          { id: 113, name: "Kent Water Purifier RO+UV+UF", slug: "kent-water-purifier-ro-uv-uf", brandId: null, categoryId: 19, shortDesc: "8L Capacity, RO+UV+UF, Min 9L/hr, Zero Water Wastage", longDesc: "<p>Kent Grand+ water purifier with RO+UV+UF purification, 8L storage, mineral retention technology, and zero water wastage feature.</p>", basePrice: 14999.0, mrp: 21000.0, avgRating: 4.3, reviewCount: 48, totalSold: 400 },
          { id: 114, name: "ChefMaster Electric Kettle 1.8L", slug: "chefmaster-electric-kettle-1-8l", brandId: 20, categoryId: 19, shortDesc: "1.8L, 1500W, Stainless Steel, Auto Shut-Off", longDesc: "<p>ChefMaster stainless steel electric kettle with 1.8L capacity, 1500W rapid boil, auto shut-off, boil-dry protection, and 360° swivel base.</p>", basePrice: 999.0, mrp: 1799.0, avgRating: 4.4, reviewCount: 60, totalSold: 1200 },

          // ─── Furniture (categoryId 20) ───
          { id: 115, name: "ComfortHome Ergonomic Study Chair", slug: "comforthome-ergonomic-study-chair", brandId: 19, categoryId: 20, shortDesc: "Mesh Back, Lumbar Support, Height Adjustable, Black", longDesc: "<p>ComfortHome ergonomic study chair with breathable mesh back, adjustable lumbar support, soft cushion seat, and BIFMA-certified gas lift.</p>", basePrice: 5999.0, mrp: 9999.0, avgRating: 4.2, reviewCount: 40, totalSold: 350 },
          { id: 116, name: "ComfortHome Bookshelf 5-Tier", slug: "comforthome-bookshelf-5-tier", brandId: 19, categoryId: 20, shortDesc: "Engineered Wood, 5 Shelves, 80x30x120cm, Walnut", longDesc: "<p>ComfortHome 5-tier open bookshelf in walnut finish. Made from engineered wood with anti-tip wall anchor and 25kg per shelf capacity.</p>", basePrice: 3499.0, mrp: 5999.0, avgRating: 4.0, reviewCount: 28, totalSold: 250 },
          { id: 117, name: "ComfortHome Coffee Table Sheesham", slug: "comforthome-coffee-table-sheesham", brandId: 19, categoryId: 20, shortDesc: "Solid Sheesham Wood, 100x60x40cm, Natural Finish", longDesc: "<p>ComfortHome solid sheesham wood coffee table with natural finish, tapered legs, and lower shelf. Handcrafted by skilled artisans.</p>", basePrice: 7999.0, mrp: 12999.0, avgRating: 4.5, reviewCount: 20, totalSold: 120 },
          { id: 118, name: "ComfortHome Queen Bed Frame", slug: "comforthome-queen-bed-frame", brandId: 19, categoryId: 20, shortDesc: "Queen Size, Engineered Wood, Headboard, 152x203cm", longDesc: "<p>ComfortHome queen-size bed frame in honey finish with upholstered headboard. Engineered wood construction, centre support, 350kg weight capacity.</p>", basePrice: 12999.0, mrp: 21999.0, avgRating: 4.1, reviewCount: 18, totalSold: 100 },
          { id: 119, name: "ComfortHome 3-Door Wardrobe", slug: "comforthome-3-door-wardrobe", brandId: 19, categoryId: 20, shortDesc: "3 Doors, Mirror, 150x55x200cm, Provisions Tea", longDesc: "<p>ComfortHome 3-door wardrobe with mirror on center door, 150x55x200cm. Provisions tea finish, soft-close hinges, and adjustable shelves.</p>", basePrice: 15999.0, mrp: 27999.0, avgRating: 3.9, reviewCount: 15, totalSold: 80 },
          { id: 120, name: "ComfortHome L-Shaped Sofa Set", slug: "comforthome-l-shaped-sofa-set", brandId: 19, categoryId: 20, shortDesc: "6-Seater L-Shape, Fabric, Grey, 270x180cm", longDesc: "<p>ComfortHome L-shaped sofa set in premium grey fabric. 6-seater with reversible chaise, high-density foam, and solid wood frame.</p>", basePrice: 24999.0, mrp: 42999.0, avgRating: 4.3, reviewCount: 22, totalSold: 70, isFeatured: true },

          // ─── Fiction (categoryId 21) ───
          { id: 121, name: "The Alchemist", slug: "the-alchemist-paulo-coelho", brandId: null, categoryId: 21, shortDesc: "by Paulo Coelho - A Fable About Following Your Dream", longDesc: "<p>Paulo Coelho's enchanting novel about an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.</p>", basePrice: 299.0, mrp: 499.0, avgRating: 4.4, reviewCount: 250, totalSold: 6000, isFeatured: true },
          { id: 122, name: "The Girl on the Train", slug: "the-girl-on-the-train-paula-hawkins", brandId: null, categoryId: 21, shortDesc: "by Paula Hawkins - #1 Bestselling Psychological Thriller", longDesc: "<p>Paula Hawkins' gripping psychological thriller about a woman who witnesses something shocking from her daily train commute.</p>", basePrice: 319.0, mrp: 499.0, avgRating: 4.1, reviewCount: 180, totalSold: 4000 },
          { id: 123, name: "Pride and Prejudice", slug: "pride-and-prejudice-jane-austen", brandId: null, categoryId: 21, shortDesc: "by Jane Austen - A Classic Love Story", longDesc: "<p>Jane Austen's beloved classic about Elizabeth Bennet and Mr. Darcy - a witty, romantic story of love and social class.</p>", basePrice: 199.0, mrp: 350.0, avgRating: 4.6, reviewCount: 320, totalSold: 8000 },
          { id: 124, name: "Dune", slug: "dune-frank-herbert", brandId: null, categoryId: 21, shortDesc: "by Frank Herbert - Science Fiction Masterpiece", longDesc: "<p>Frank Herbert's epic science fiction masterpiece set on the desert planet Arrakis. A tale of politics, religion, ecology, and human potential.</p>", basePrice: 399.0, mrp: 599.0, avgRating: 4.5, reviewCount: 145, totalSold: 3000 },
          { id: 125, name: "The Silent Patient", slug: "the-silent-patient-alex-michaelides", brandId: null, categoryId: 21, shortDesc: "by Alex Michaelides - The #1 International Bestseller", longDesc: "<p>A woman shoots her husband five times and then never speaks another word. A criminal psychotherapist becomes obsessed with uncovering why.</p>", basePrice: 299.0, mrp: 499.0, avgRating: 4.3, reviewCount: 110, totalSold: 2500 },
          { id: 126, name: "The Name of the Wind", slug: "the-name-of-the-wind-patrick-rothfuss", brandId: null, categoryId: 21, shortDesc: "by Patrick Rothfuss - Epic Fantasy Novel", longDesc: "<p>Patrick Rothfuss's stunning fantasy debut about Kvothe, from childhood in a troupe of traveling players to years spent as a near-feral orphan.</p>", basePrice: 349.0, mrp: 550.0, avgRating: 4.7, reviewCount: 95, totalSold: 2000 },

          // ─── Non-Fiction (categoryId 22) ───
          { id: 127, name: "Steve Jobs", slug: "steve-jobs-walter-isaacson", brandId: null, categoryId: 22, shortDesc: "by Walter Isaacson - The Exclusive Biography", longDesc: "<p>Walter Isaacson's authorized biography of Apple co-founder Steve Jobs, based on over 40 interviews with Jobs and 100+ with family and colleagues.</p>", basePrice: 449.0, mrp: 699.0, avgRating: 4.5, reviewCount: 160, totalSold: 3500 },
          { id: 128, name: "Rich Dad Poor Dad", slug: "rich-dad-poor-dad-robert-kiyosaki", brandId: null, categoryId: 22, shortDesc: "by Robert Kiyosaki - What the Rich Teach Their Kids", longDesc: "<p>Robert Kiyosaki's personal finance classic that challenges conventional wisdom about money and investing.</p>", basePrice: 299.0, mrp: 499.0, avgRating: 4.3, reviewCount: 220, totalSold: 7000 },
          { id: 129, name: "Zero to One", slug: "zero-to-one-peter-thiel", brandId: null, categoryId: 22, shortDesc: "by Peter Thiel - Notes on Startups, or How to Build the Future", longDesc: "<p>Peter Thiel's contrarian thinking on startups and innovation. The next Bill Gates will not build an operating system.</p>", basePrice: 349.0, mrp: 550.0, avgRating: 4.4, reviewCount: 130, totalSold: 3000 },
          { id: 130, name: "Into the Wild", slug: "into-the-wild-jon-krakauer", brandId: null, categoryId: 22, shortDesc: "by Jon Krakauer - A True Story of Adventure", longDesc: "<p>Jon Krakauer's mesmerizing narrative about Christopher McCandless, who walked into the Alaskan wilderness and never came out.</p>", basePrice: 319.0, mrp: 499.0, avgRating: 4.2, reviewCount: 85, totalSold: 2000 },
          { id: 131, name: "Indian Cookery", slug: "indian-cookery-madhur-jaffrey", brandId: null, categoryId: 22, shortDesc: "by Madhur Jaffrey - The Definitive Guide to Indian Cooking", longDesc: "<p>Madhur Jaffrey's comprehensive guide to Indian cooking with over 200 recipes from every region of India.</p>", basePrice: 499.0, mrp: 799.0, avgRating: 4.5, reviewCount: 45, totalSold: 1200 },
          { id: 132, name: "India After Gandhi", slug: "india-after-gandhi-ramachandra-guha", brandId: null, categoryId: 22, shortDesc: "by Ramachandra Guha - The History of the World's Largest Democracy", longDesc: "<p>Ramachandra Guha's magisterial history of India since Independence, told with authority, insight, and elegance.</p>", basePrice: 549.0, mrp: 899.0, avgRating: 4.6, reviewCount: 75, totalSold: 1800 },

          // ─── More Electronics ───
          { id: 133, name: "Samsung Galaxy Tab S9 FE", slug: "samsung-galaxy-tab-s9-fe", brandId: 1, categoryId: 11, shortDesc: '10.9" Display, Exynos 1380, 6GB RAM, 128GB, S Pen', longDesc: "<p>Samsung Galaxy Tab S9 FE with 10.9-inch display, Exynos 1380, included S Pen, and long-lasting 8000mAh battery.</p>", basePrice: 44990.0, mrp: 52990.0, avgRating: 4.3, reviewCount: 40, totalSold: 200 },
          { id: 134, name: "Apple Watch SE 2nd Gen", slug: "apple-watch-se-2nd-gen", brandId: 2, categoryId: 11, shortDesc: "44mm GPS, S8 Chip, Crash Detection, Sleep Tracking", longDesc: "<p>Apple Watch SE 2nd generation with S8 chip, crash detection, advanced fitness tracking, and water resistance to 50m.</p>", basePrice: 29900.0, mrp: 32900.0, avgRating: 4.4, reviewCount: 55, totalSold: 350 },
          { id: 135, name: "Samsung 20000mAh Power Bank", slug: "samsung-20000mah-power-bank", brandId: 1, categoryId: 11, shortDesc: "20000mAh, 25W Fast Charging, Dual USB-C Ports", longDesc: "<p>Samsung 20000mAh power bank with 25W super fast charging, dual USB-C ports, and compact design. Charges Galaxy S24 4+ times.</p>", basePrice: 2199.0, mrp: 3999.0, avgRating: 4.2, reviewCount: 75, totalSold: 1800 },
          { id: 136, name: "JBL Charge 5 Bluetooth Speaker", slug: "jbl-charge-5-bluetooth-speaker", brandId: 18, categoryId: 13, shortDesc: "30W, IP67 Waterproof, 20hr Battery, Powerbank", longDesc: "<p>JBL Charge 5 portable Bluetooth speaker with 30W output, IP67 waterproof rating, 20 hours of playtime, and built-in powerbank.</p>", basePrice: 13999.0, mrp: 16999.0, avgRating: 4.5, reviewCount: 50, totalSold: 400 },
          { id: 137, name: "Logitech G502 Gaming Mouse", slug: "logitech-g502-gaming-mouse", brandId: null, categoryId: 11, shortDesc: "25600 DPI, 11 Buttons, RGB, Adjustable Weights", longDesc: "<p>Logitech G502 HERO gaming mouse with 25600 DPI sensor, 11 programmable buttons, RGB lighting, and adjustable weight system.</p>", basePrice: 3995.0, mrp: 5495.0, avgRating: 4.6, reviewCount: 90, totalSold: 600 },
          { id: 138, name: "Logitech C920 HD Webcam", slug: "logitech-c920-hd-webcam", brandId: null, categoryId: 11, shortDesc: "1080p Full HD, Auto Light Correction, Dual Mics", longDesc: "<p>Logitech C920 HD Pro webcam with 1080p Full HD video, automatic light correction, dual noise-reducing microphones, and universal clip.</p>", basePrice: 6995.0, mrp: 9995.0, avgRating: 4.3, reviewCount: 45, totalSold: 250 },
          { id: 139, name: "Bose QuietComfort Ultra Earbuds", slug: "bose-qc-ultra-earbuds", brandId: 17, categoryId: 13, shortDesc: "Best-in-Class ANC, Immersive Audio, 6hr Battery", longDesc: "<p>Bose QuietComfort Ultra earbuds with world-class noise cancellation, Immersive Audio with head tracking, CustomTune fit, and 6-hour battery.</p>", basePrice: 22900.0, mrp: 26900.0, avgRating: 4.5, reviewCount: 35, totalSold: 200 },
          { id: 140, name: "JBL Tune 230NC TWS Earbuds", slug: "jbl-tune-230nc-tws-earbuds", brandId: 18, categoryId: 13, shortDesc: "Active Noise Cancelling, 10hr Battery, 40hr Total", longDesc: "<p>JBL Tune 230NC true wireless earbuds with Active Noise Cancellation, JBL Pure Bass Sound, 10 hours of playtime, and 40 hours total with case.</p>", basePrice: 4999.0, mrp: 7999.0, avgRating: 4.1, reviewCount: 55, totalSold: 700 },

          // ─── More Home & Kitchen ───
          { id: 141, name: "ComfortHome Single Bed Frame with Storage", slug: "comforthome-single-bed-frame-storage", brandId: 19, categoryId: 20, shortDesc: "Single Size, Hydraulic Storage, Engineered Wood", longDesc: "<p>ComfortHome single bed frame with hydraulic lift-up storage, engineered wood in wenge finish, and 150kg weight capacity.</p>", basePrice: 8999.0, mrp: 14999.0, avgRating: 4.0, reviewCount: 18, totalSold: 100 },
          { id: 142, name: "ComfortHome 4-Seater Dining Table", slug: "comforthome-4-seater-dining-table", brandId: 19, categoryId: 20, shortDesc: "4-Seater, Solid Sheesham Wood, 120x80x76cm, Natural", longDesc: "<p>ComfortHome 4-seater dining table in solid sheesham wood with natural finish. Sturdy construction, elegant design, seats 4 comfortably.</p>", basePrice: 11999.0, mrp: 19999.0, avgRating: 4.3, reviewCount: 12, totalSold: 60 },
          { id: 143, name: "ComfortHome TV Unit 180cm", slug: "comforthome-tv-unit-180cm", brandId: 19, categoryId: 20, shortDesc: "180cm Wide, Up to 65\" TV, Engineered Wood, Walnut", longDesc: "<p>ComfortHome TV entertainment unit, 180cm wide, suitable for TVs up to 65 inches. Walnut finish, cable management, and open shelves.</p>", basePrice: 7999.0, mrp: 13999.0, avgRating: 4.1, reviewCount: 22, totalSold: 150 },
          { id: 144, name: "ChefMaster Non-Stick Cookware Set 5-Piece", slug: "chefmaster-non-stick-cookware-5-piece", brandId: 20, categoryId: 19, shortDesc: "5-Piece Set, Induction Compatible, PFOA Free", longDesc: "<p>ChefMaster 5-piece non-stick cookware set: 2 frying pans, 1 kadhai, 1 saucepan, 1 tawa. Induction compatible, PFOA-free coating.</p>", basePrice: 2499.0, mrp: 4499.0, avgRating: 4.2, reviewCount: 50, totalSold: 800 },
          { id: 145, name: "ChefMaster Electric Tandoor", slug: "chefmaster-electric-tandoor", brandId: 20, categoryId: 19, shortDesc: "1200W, Stainless Steel, 4-Piece Skewer Set", longDesc: "<p>ChefMaster electric tandoor with 1200W heating element, stainless steel body, 4-piece skewer set, and viewing window.</p>", basePrice: 2999.0, mrp: 4999.0, avgRating: 4.0, reviewCount: 30, totalSold: 350 },

          // ─── More Sports & Fitness ───
          { id: 146, name: "Nike Speed Running Shoes Pegasus 41", slug: "nike-speed-running-shoes-pegasus-41", brandId: 6, categoryId: 23, shortDesc: "ReactX Foam, Zoom Air, Breathable Engineered Mesh", longDesc: "<p>Nike Pegasus 41 with ReactX foam for 13% more energy return, Zoom Air unit, and engineered mesh upper for breathability.</p>", basePrice: 10995.0, mrp: 13995.0, avgRating: 4.4, reviewCount: 65, totalSold: 500 },
          { id: 147, name: "FitGoal Ab Roller Wheel", slug: "fitgoal-ab-roller-wheel", brandId: 11, categoryId: 23, shortDesc: "Dual-Wheel, Non-Slip, Knee Pad Included, Steel Core", longDesc: "<p>FitGoal dual-wheel ab roller with non-slip rubber wheels, steel core construction, and included knee pad for comfortable workouts.</p>", basePrice: 499.0, mrp: 999.0, avgRating: 4.3, reviewCount: 42, totalSold: 600 },
          { id: 148, name: "FitGoal Pull-Up Bar Doorway Mount", slug: "fitgoal-pull-up-bar-doorway", brandId: 11, categoryId: 23, shortDesc: "Adjustable Width, No Drilling, 120kg Capacity, Padded Grips", longDesc: "<p>FitGoal doorway pull-up bar with adjustable width 60-100cm, no-drill installation, 120kg weight capacity, and 3 grip positions.</p>", basePrice: 999.0, mrp: 1799.0, avgRating: 4.2, reviewCount: 38, totalSold: 450 },
          { id: 149, name: "FitGoal Foam Roller 45cm", slug: "fitgoal-foam-roller-45cm", brandId: 11, categoryId: 23, shortDesc: "High-Density EVA Foam, Textured Surface, 45x15cm", longDesc: "<p>FitGoal high-density EVA foam roller for muscle recovery and self-myofascial release. Textured surface for targeted massage, 45x15cm.</p>", basePrice: 699.0, mrp: 1199.0, avgRating: 4.5, reviewCount: 50, totalSold: 700 },
          { id: 150, name: "FitGoal Yoga Block Set 2 Pieces", slug: "fitgoal-yoga-block-set-2", brandId: 11, categoryId: 23, shortDesc: "EVA Foam, Non-Slip, Lightweight, 23x15x8cm", longDesc: "<p>FitGoal EVA foam yoga block set of 2. Non-slip surface, lightweight yet firm support, beveled edges for comfortable grip.</p>", basePrice: 449.0, mrp: 799.0, avgRating: 4.4, reviewCount: 35, totalSold: 550 },
        ],
      });

      // ─── NEW PRODUCT VARIANTS ──────────────────────────────────────────
      await tx.productVariant.createMany({
        data: [
          // Nike Badminton Racket sizes (grip)
          { id: 37, productId: 35, sku: "NK-VAPOR-G4", variantName: "Grip G4", stock: 40 },
          { id: 38, productId: 35, sku: "NK-VAPOR-G5", variantName: "Grip G5", stock: 35 },
          // Nike Women's Running Shoes sizes
          { id: 39, productId: 104, sku: "NK-PEG40-W-6", variantName: "UK 6", stock: 25 },
          { id: 40, productId: 104, sku: "NK-PEG40-W-7", variantName: "UK 7", stock: 30 },
          { id: 41, productId: 104, sku: "NK-PEG40-W-8", variantName: "UK 8", stock: 20 },
          // Levi's Women's 711 sizes
          { id: 42, productId: 105, sku: "LEV-711-W26", variantName: "Waist 26", stock: 30 },
          { id: 43, productId: 105, sku: "LEV-711-W28", variantName: "Waist 28", stock: 40 },
          { id: 44, productId: 105, sku: "LEV-711-W30", variantName: "Waist 30", stock: 35 },
          // Women's Kurti sizes
          { id: 45, productId: 103, sku: "WC-KURTI-S", variantName: "Small", stock: 50 },
          { id: 46, productId: 103, sku: "WC-KURTI-M", variantName: "Medium", stock: 70 },
          { id: 47, productId: 103, sku: "WC-KURTI-L", variantName: "Large", stock: 60 },
          { id: 48, productId: 103, sku: "WC-KURTI-XL", variantName: "Extra Large", stock: 40 },
          // Nike Women's Sandals sizes
          { id: 49, productId: 107, sku: "NK-SOLAR-W-5", variantName: "UK 5", stock: 30 },
          { id: 50, productId: 107, sku: "NK-SOLAR-W-6", variantName: "UK 6", stock: 35 },
          { id: 51, productId: 107, sku: "NK-SOLAR-W-7", variantName: "UK 7", stock: 25 },
          // Nike Pegasus 41 sizes
          { id: 52, productId: 146, sku: "NK-PEG41-8", variantName: "UK 8", stock: 30 },
          { id: 53, productId: 146, sku: "NK-PEG41-9", variantName: "UK 9", stock: 35 },
          { id: 54, productId: 146, sku: "NK-PEG41-10", variantName: "UK 10", stock: 25 },
        ],
      });

      // ─── NEW VARIANT ATTRIBUTES ─────────────────────────────────────────
      await tx.variantAttribute.createMany({
        data: [
          { variantId: 37, attributeName: "Grip Size", attributeValue: "G4" },
          { variantId: 38, attributeName: "Grip Size", attributeValue: "G5" },
          { variantId: 39, attributeName: "UK Size", attributeValue: "6" },
          { variantId: 40, attributeName: "UK Size", attributeValue: "7" },
          { variantId: 41, attributeName: "UK Size", attributeValue: "8" },
          { variantId: 42, attributeName: "Waist", attributeValue: "26" },
          { variantId: 43, attributeName: "Waist", attributeValue: "28" },
          { variantId: 44, attributeName: "Waist", attributeValue: "30" },
          { variantId: 45, attributeName: "Size", attributeValue: "S" },
          { variantId: 46, attributeName: "Size", attributeValue: "M" },
          { variantId: 47, attributeName: "Size", attributeValue: "L" },
          { variantId: 48, attributeName: "Size", attributeValue: "XL" },
          { variantId: 49, attributeName: "UK Size", attributeValue: "5" },
          { variantId: 50, attributeName: "UK Size", attributeValue: "6" },
          { variantId: 51, attributeName: "UK Size", attributeValue: "7" },
          { variantId: 52, attributeName: "UK Size", attributeValue: "8" },
          { variantId: 53, attributeName: "UK Size", attributeValue: "9" },
          { variantId: 54, attributeName: "UK Size", attributeValue: "10" },
        ],
      });

      // ─── NEW PRODUCT IMAGES ──────────────────────────────────────────────
      await tx.productImage.createMany({
        data: [
          // Sports & Fitness (31-42)
          { productId: 31, imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop", altText: "Adjustable Dumbbells", sortOrder: 0, isPrimary: true },
          { productId: 32, imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", altText: "Yoga Mat", sortOrder: 0, isPrimary: true },
          { productId: 33, imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", altText: "Foldable Treadmill", sortOrder: 0, isPrimary: true },
          { productId: 34, imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop", altText: "Resistance Bands", sortOrder: 0, isPrimary: true },
          { productId: 35, imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop", altText: "Badminton Racket", sortOrder: 0, isPrimary: true },
          { productId: 36, imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop", altText: "Cricket Bat", sortOrder: 0, isPrimary: true },
          { productId: 37, imageUrl: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=400&h=400&fit=crop", altText: "Football", sortOrder: 0, isPrimary: true },
          { productId: 38, imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop", altText: "Gym Bag", sortOrder: 0, isPrimary: true },
          { productId: 39, imageUrl: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=400&h=400&fit=crop", altText: "Protein Shaker", sortOrder: 0, isPrimary: true },
          { productId: 40, imageUrl: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=400&h=400&fit=crop", altText: "Jump Rope", sortOrder: 0, isPrimary: true },
          { productId: 41, imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=400&fit=crop", altText: "Boxing Gloves", sortOrder: 0, isPrimary: true },
          { productId: 42, imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", altText: "Sports Watch", sortOrder: 0, isPrimary: true },
          // Toys & Games (43-54)
          { productId: 43, imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop", altText: "Creator Set", sortOrder: 0, isPrimary: true },
          { productId: 44, imageUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop", altText: "City Builder", sortOrder: 0, isPrimary: true },
          { productId: 45, imageUrl: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400&h=400&fit=crop", altText: "Strategy Board Game", sortOrder: 0, isPrimary: true },
          { productId: 46, imageUrl: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400&h=400&fit=crop", altText: "10-in-1 Board Games", sortOrder: 0, isPrimary: true },
          { productId: 47, imageUrl: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&h=400&fit=crop", altText: "Rubik's Cube", sortOrder: 0, isPrimary: true },
          { productId: 48, imageUrl: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&h=400&fit=crop", altText: "UNO Cards", sortOrder: 0, isPrimary: true },
          { productId: 49, imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop", altText: "Wooden Blocks", sortOrder: 0, isPrimary: true },
          { productId: 50, imageUrl: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=400&h=400&fit=crop", altText: "World Map Puzzle", sortOrder: 0, isPrimary: true },
          { productId: 51, imageUrl: "https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400&h=400&fit=crop", altText: "Robot Warrior", sortOrder: 0, isPrimary: true },
          { productId: 52, imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop", altText: "RC Drone", sortOrder: 0, isPrimary: true },
          { productId: 53, imageUrl: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=400&fit=crop", altText: "Play-Doh Set", sortOrder: 0, isPrimary: true },
          { productId: 54, imageUrl: "https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400&h=400&fit=crop", altText: "Chess Set", sortOrder: 0, isPrimary: true },
          // Beauty & Health (55-66)
          { productId: 55, imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop", altText: "Face Moisturizer", sortOrder: 0, isPrimary: true },
          { productId: 56, imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop", altText: "Sunscreen Gel", sortOrder: 0, isPrimary: true },
          { productId: 57, imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop", altText: "Hair Serum", sortOrder: 0, isPrimary: true },
          { productId: 58, imageUrl: "https://images.unsplash.com/photo-1570655652364-2e0a67455ac6?w=400&h=400&fit=crop", altText: "Charcoal Face Wash", sortOrder: 0, isPrimary: true },
          { productId: 59, imageUrl: "https://images.unsplash.com/photo-1570655652364-2e0a67455ac6?w=400&h=400&fit=crop", altText: "Matte Lipstick", sortOrder: 0, isPrimary: true },
          { productId: 60, imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop", altText: "Nail Polish Set", sortOrder: 0, isPrimary: true },
          { productId: 61, imageUrl: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=400&h=400&fit=crop", altText: "Body Lotion", sortOrder: 0, isPrimary: true },
          { productId: 62, imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop", altText: "Shampoo", sortOrder: 0, isPrimary: true },
          { productId: 63, imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop", altText: "Eye Shadow Palette", sortOrder: 0, isPrimary: true },
          { productId: 64, imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop", altText: "Sheet Masks", sortOrder: 0, isPrimary: true },
          { productId: 65, imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop", altText: "Perfume", sortOrder: 0, isPrimary: true },
          { productId: 66, imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop", altText: "Shaving Cream", sortOrder: 0, isPrimary: true },
          // Automotive (67-78)
          { productId: 67, imageUrl: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=400&fit=crop", altText: "Phone Mount", sortOrder: 0, isPrimary: true },
          { productId: 68, imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop", altText: "Dash Camera", sortOrder: 0, isPrimary: true },
          { productId: 69, imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop", altText: "Car Vacuum", sortOrder: 0, isPrimary: true },
          { productId: 70, imageUrl: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=400&fit=crop", altText: "Seat Covers", sortOrder: 0, isPrimary: true },
          { productId: 71, imageUrl: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=400&h=400&fit=crop", altText: "Car Freshener", sortOrder: 0, isPrimary: true },
          { productId: 72, imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=400&fit=crop", altText: "Tyre Inflator", sortOrder: 0, isPrimary: true },
          { productId: 73, imageUrl: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop", altText: "Jump Starter", sortOrder: 0, isPrimary: true },
          { productId: 74, imageUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=400&fit=crop", altText: "Car Cover", sortOrder: 0, isPrimary: true },
          { productId: 75, imageUrl: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=400&fit=crop", altText: "Floor Mats", sortOrder: 0, isPrimary: true },
          { productId: 76, imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop", altText: "LED Headlight", sortOrder: 0, isPrimary: true },
          { productId: 77, imageUrl: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop", altText: "Steering Cover", sortOrder: 0, isPrimary: true },
          { productId: 78, imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop", altText: "Wiper Blades", sortOrder: 0, isPrimary: true },
          // Grocery (79-90)
          { productId: 79, imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop", altText: "Basmati Rice", sortOrder: 0, isPrimary: true },
          { productId: 80, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop", altText: "Toor Dal", sortOrder: 0, isPrimary: true },
          { productId: 81, imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", altText: "Mustard Oil", sortOrder: 0, isPrimary: true },
          { productId: 82, imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop", altText: "Organic Honey", sortOrder: 0, isPrimary: true },
          { productId: 83, imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop", altText: "Green Tea", sortOrder: 0, isPrimary: true },
          { productId: 84, imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop", altText: "Almond Butter", sortOrder: 0, isPrimary: true },
          { productId: 85, imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", altText: "Quinoa", sortOrder: 0, isPrimary: true },
          { productId: 86, imageUrl: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=400&h=400&fit=crop", altText: "Dark Chocolate", sortOrder: 0, isPrimary: true },
          { productId: 87, imageUrl: "https://images.unsplash.com/photo-1612257416648-ee7a6c533b4f?w=400&h=400&fit=crop", altText: "Mixed Dry Fruits", sortOrder: 0, isPrimary: true },
          { productId: 88, imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop", altText: "A2 Cow Ghee", sortOrder: 0, isPrimary: true },
          { productId: 89, imageUrl: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=400&h=400&fit=crop", altText: "Instant Coffee", sortOrder: 0, isPrimary: true },
          { productId: 90, imageUrl: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&h=400&fit=crop", altText: "Protein Bars", sortOrder: 0, isPrimary: true },
          // Office Products (91-102)
          { productId: 91, imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop", altText: "Ergonomic Chair", sortOrder: 0, isPrimary: true },
          { productId: 92, imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop", altText: "LED Desk Lamp", sortOrder: 0, isPrimary: true },
          { productId: 93, imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop", altText: "Pen Set", sortOrder: 0, isPrimary: true },
          { productId: 94, imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop", altText: "Notebook Set", sortOrder: 0, isPrimary: true },
          { productId: 95, imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop", altText: "Stapler", sortOrder: 0, isPrimary: true },
          { productId: 96, imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=400&fit=crop", altText: "Whiteboard", sortOrder: 0, isPrimary: true },
          { productId: 97, imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop", altText: "File Organizer", sortOrder: 0, isPrimary: true },
          { productId: 98, imageUrl: "https://images.unsplash.com/photo-1568205612837-017257d2310a?w=400&h=400&fit=crop", altText: "Monitor Stand", sortOrder: 0, isPrimary: true },
          { productId: 99, imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=400&fit=crop", altText: "Mechanical Pencil", sortOrder: 0, isPrimary: true },
          { productId: 100, imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=400&fit=crop", altText: "Printer Paper", sortOrder: 0, isPrimary: true },
          { productId: 101, imageUrl: "https://images.unsplash.com/photo-1568205612837-017257d2310a?w=400&h=400&fit=crop", altText: "Mouse Pad", sortOrder: 0, isPrimary: true },
          { productId: 102, imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=400&fit=crop", altText: "Desk Organizer", sortOrder: 0, isPrimary: true },
          // Women's Clothing (103-108)
          { productId: 103, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", altText: "Embroidered Kurti", sortOrder: 0, isPrimary: true },
          { productId: 104, imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop", altText: "Running Shoes", sortOrder: 0, isPrimary: true },
          { productId: 105, imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop", altText: "711 Skinny Jeans", sortOrder: 0, isPrimary: true },
          { productId: 106, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", altText: "Handbag Tote", sortOrder: 0, isPrimary: true },
          { productId: 107, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", altText: "Women's Sandals", sortOrder: 0, isPrimary: true },
          { productId: 108, imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop", altText: "Cotton Scarf", sortOrder: 0, isPrimary: true },
          // Kitchen Appliances (109-114)
          { productId: 109, imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", altText: "Mixer Grinder", sortOrder: 0, isPrimary: true },
          { productId: 110, imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=400&fit=crop", altText: "Air Fryer", sortOrder: 0, isPrimary: true },
          { productId: 111, imageUrl: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=400&h=400&fit=crop", altText: "Toaster", sortOrder: 0, isPrimary: true },
          { productId: 112, imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=400&fit=crop", altText: "Blender", sortOrder: 0, isPrimary: true },
          { productId: 113, imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop", altText: "Water Purifier", sortOrder: 0, isPrimary: true },
          { productId: 114, imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop", altText: "Electric Kettle", sortOrder: 0, isPrimary: true },
          // Furniture (115-120)
          { productId: 115, imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop", altText: "Study Chair", sortOrder: 0, isPrimary: true },
          { productId: 116, imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", altText: "Bookshelf", sortOrder: 0, isPrimary: true },
          { productId: 117, imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop", altText: "Coffee Table", sortOrder: 0, isPrimary: true },
          { productId: 118, imageUrl: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=400&fit=crop", altText: "Bed Frame", sortOrder: 0, isPrimary: true },
          { productId: 119, imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", altText: "Wardrobe", sortOrder: 0, isPrimary: true },
          { productId: 120, imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop", altText: "Sofa Set", sortOrder: 0, isPrimary: true },
          // Fiction / Books (121-126)
          { productId: 121, imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop", altText: "The Alchemist", sortOrder: 0, isPrimary: true },
          { productId: 122, imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop", altText: "The Girl on the Train", sortOrder: 0, isPrimary: true },
          { productId: 123, imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop", altText: "Pride and Prejudice", sortOrder: 0, isPrimary: true },
          { productId: 124, imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop", altText: "Dune", sortOrder: 0, isPrimary: true },
          { productId: 125, imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=400&fit=crop", altText: "The Silent Patient", sortOrder: 0, isPrimary: true },
          { productId: 126, imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop", altText: "The Name of the Wind", sortOrder: 0, isPrimary: true },
          // Non-Fiction / Books (127-132)
          { productId: 127, imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop", altText: "Steve Jobs", sortOrder: 0, isPrimary: true },
          { productId: 128, imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop", altText: "Rich Dad Poor Dad", sortOrder: 0, isPrimary: true },
          { productId: 129, imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop", altText: "Zero to One", sortOrder: 0, isPrimary: true },
          { productId: 130, imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop", altText: "Into the Wild", sortOrder: 0, isPrimary: true },
          { productId: 131, imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop", altText: "Indian Cookery", sortOrder: 0, isPrimary: true },
          { productId: 132, imageUrl: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=400&fit=crop", altText: "India After Gandhi", sortOrder: 0, isPrimary: true },
          // Electronics (133-140)
          { productId: 133, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", altText: "Galaxy Tab S9 FE", sortOrder: 0, isPrimary: true },
          { productId: 134, imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", altText: "Apple Watch SE", sortOrder: 0, isPrimary: true },
          { productId: 135, imageUrl: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=400&h=400&fit=crop", altText: "Power Bank", sortOrder: 0, isPrimary: true },
          { productId: 136, imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop", altText: "JBL Charge 5", sortOrder: 0, isPrimary: true },
          { productId: 137, imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop", altText: "Gaming Mouse", sortOrder: 0, isPrimary: true },
          { productId: 138, imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop", altText: "Webcam", sortOrder: 0, isPrimary: true },
          { productId: 139, imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop", altText: "Bose QC Ultra", sortOrder: 0, isPrimary: true },
          { productId: 140, imageUrl: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=400&fit=crop", altText: "JBL Tune 230NC", sortOrder: 0, isPrimary: true },
          // More Home (141-145)
          { productId: 141, imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", altText: "Bed Frame Storage", sortOrder: 0, isPrimary: true },
          { productId: 142, imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop", altText: "Dining Table", sortOrder: 0, isPrimary: true },
          { productId: 143, imageUrl: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=400&h=400&fit=crop", altText: "TV Unit", sortOrder: 0, isPrimary: true },
          { productId: 144, imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=400&fit=crop", altText: "Cookware Set", sortOrder: 0, isPrimary: true },
          { productId: 145, imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop", altText: "Electric Tandoor", sortOrder: 0, isPrimary: true },
          // More Sports (146-150)
          { productId: 146, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", altText: "Pegasus 41", sortOrder: 0, isPrimary: true },
          { productId: 147, imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop", altText: "Ab Roller", sortOrder: 0, isPrimary: true },
          { productId: 148, imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", altText: "Pull-Up Bar", sortOrder: 0, isPrimary: true },
          { productId: 149, imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop", altText: "Foam Roller", sortOrder: 0, isPrimary: true },
          { productId: 150, imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop", altText: "Yoga Blocks", sortOrder: 0, isPrimary: true },
        ],
      });

      // ─── NEW PRODUCT SPECIFICATIONS ──────────────────────────────────────
      await tx.productSpecification.createMany({
        data: [
          // FitGoal Treadmill
          { productId: 33, groupName: "General", specKey: "Motor", specValue: "2.5 HP", sortOrder: 1 },
          { productId: 33, groupName: "General", specKey: "Max Speed", specValue: "12 km/h", sortOrder: 2 },
          { productId: 33, groupName: "General", specKey: "Running Area", specValue: "110x40cm", sortOrder: 3 },
          { productId: 33, groupName: "General", specKey: "Max User Weight", specValue: "100kg", sortOrder: 4 },
          // ChefMaster Air Fryer
          { productId: 110, groupName: "General", specKey: "Capacity", specValue: "4.5 Litres", sortOrder: 1 },
          { productId: 110, groupName: "General", specKey: "Power", specValue: "1500W", sortOrder: 2 },
          { productId: 110, groupName: "General", specKey: "Presets", specValue: "8", sortOrder: 3 },
          { productId: 110, groupName: "Safety", specKey: "Auto Shut-Off", specValue: "Yes", sortOrder: 4 },
          // ChefMaster Mixer Grinder
          { productId: 109, groupName: "General", specKey: "Motor", specValue: "750W", sortOrder: 1 },
          { productId: 109, groupName: "General", specKey: "Jars", specValue: "3 Stainless Steel", sortOrder: 2 },
          { productId: 109, groupName: "General", specKey: "Speed Settings", specValue: "3 + Pulse", sortOrder: 3 },
          // Samsung Galaxy Tab S9 FE
          { productId: 133, groupName: "Display", specKey: "Screen Size", specValue: "10.9 inches", sortOrder: 1 },
          { productId: 133, groupName: "Display", specKey: "Type", specValue: "IPS LCD", sortOrder: 2 },
          { productId: 133, groupName: "Performance", specKey: "Processor", specValue: "Exynos 1380", sortOrder: 3 },
          { productId: 133, groupName: "Performance", specKey: "RAM", specValue: "6 GB", sortOrder: 4 },
          { productId: 133, groupName: "Storage", specKey: "Internal", specValue: "128 GB", sortOrder: 5 },
          { productId: 133, groupName: "Battery", specKey: "Capacity", specValue: "8000 mAh", sortOrder: 6 },
          // JBL Charge 5
          { productId: 136, groupName: "Audio", specKey: "Output", specValue: "30W", sortOrder: 1 },
          { productId: 136, groupName: "Battery", specKey: "Playtime", specValue: "20 hours", sortOrder: 2 },
          { productId: 136, groupName: "General", specKey: "Waterproof", specValue: "IP67", sortOrder: 3 },
          { productId: 136, groupName: "Connectivity", specKey: "Bluetooth", specValue: "5.1", sortOrder: 4 },
          // AutoPro Dash Camera
          { productId: 68, groupName: "Video", specKey: "Resolution", specValue: "1080P Full HD", sortOrder: 1 },
          { productId: 68, groupName: "Video", specKey: "Field of View", specValue: "170°", sortOrder: 2 },
          { productId: 68, groupName: "Features", specKey: "Night Vision", specValue: "Yes", sortOrder: 3 },
          { productId: 68, groupName: "Features", specKey: "G-Sensor", specValue: "Yes", sortOrder: 4 },
          // ComfortHome L-Shaped Sofa
          { productId: 120, groupName: "General", specKey: "Seating", specValue: "6 Seater", sortOrder: 1 },
          { productId: 120, groupName: "General", specKey: "Material", specValue: "Fabric", sortOrder: 2 },
          { productId: 120, groupName: "General", specKey: "Dimensions", specValue: "270x180cm", sortOrder: 3 },
          { productId: 120, groupName: "General", specKey: "Frame", specValue: "Solid Wood", sortOrder: 4 },
          // OfficeEx Ergonomic Chair
          { productId: 91, groupName: "General", specKey: "Material", specValue: "Mesh + Foam", sortOrder: 1 },
          { productId: 91, groupName: "General", specKey: "Max Weight", specValue: "120kg", sortOrder: 2 },
          { productId: 91, groupName: "Features", specKey: "Lumbar Support", specValue: "Adjustable", sortOrder: 3 },
          { productId: 91, groupName: "Features", specKey: "Armrests", specValue: "3D Adjustable", sortOrder: 4 },
          // FitGoal Sports Watch X200
          { productId: 42, groupName: "Display", specKey: "Type", specValue: "1.69\" TFT", sortOrder: 1 },
          { productId: 42, groupName: "Battery", specKey: "Life", specValue: "14 days", sortOrder: 2 },
          { productId: 42, groupName: "Features", specKey: "Heart Rate", specValue: "24/7", sortOrder: 3 },
          { productId: 42, groupName: "General", specKey: "Waterproof", specValue: "IP68", sortOrder: 4 },
        ],
      });

      // ─── NEW REVIEWS ─────────────────────────────────────────────────────
      await tx.productReview.createMany({
        data: [
          { productId: 33, userId: 1, rating: 4, title: "Great for home workouts", body: "Compact and powerful. Folds away nicely. The incline feature is a bonus.", isVerified: true },
          { productId: 42, userId: 1, rating: 4, title: "Amazing value for a smartwatch", body: "Heart rate monitoring is accurate. Battery easily lasts 10+ days. Great for the price.", isVerified: true },
          { productId: 42, userId: 2, rating: 5, title: "Best budget sports watch", body: "Does everything my expensive Garmin did at a fraction of the price.", isVerified: true },
          { productId: 48, userId: 1, rating: 5, title: "Classic family fun", body: "UNO never gets old. The expansion packs add great variety. Must-have for game nights.", isVerified: true },
          { productId: 56, userId: 1, rating: 5, title: "No white cast at all!", body: "Finally a sunscreen that doesn't leave a white cast on Indian skin. Gel formula absorbs instantly.", isVerified: true },
          { productId: 56, userId: 2, rating: 4, title: "Great but small bottle", body: "The formula is amazing but 50ml goes fast with daily use. Wish they had a bigger size.", isVerified: true },
          { productId: 68, userId: 1, rating: 4, title: "Peace of mind while driving", body: "Clear footage day and night. The G-sensor automatically saves clips during hard braking.", isVerified: true },
          { productId: 86, userId: 1, rating: 5, title: "Rich and smooth", body: "72% cocoa hits the sweet spot - not too bitter, not too sweet. Belgian quality at Indian prices.", isVerified: true },
          { productId: 86, userId: 2, rating: 5, title: "Best dark chocolate in India", body: "Smooth texture, complex flavor. Better than imported brands at half the price.", isVerified: true },
          { productId: 110, userId: 1, rating: 5, title: "Game changer for healthy cooking", body: "Made perfect fries, samosas, and even pakoras with almost no oil. The presets are handy.", isVerified: true },
          { productId: 110, userId: 2, rating: 4, title: "Great but needs preheating", body: "Cooking results are excellent. Just needs 2-3 min preheating. Easy to clean.", isVerified: true },
          { productId: 91, userId: 1, rating: 4, title: "Comfortable for long hours", body: "I work 10+ hours a day and this chair keeps me comfortable. Lumbar support is excellent.", isVerified: true },
          { productId: 120, userId: 1, rating: 4, title: "Beautiful and comfortable", body: "The fabric quality is premium and the L-shape fits perfectly in my living room. Very comfortable.", isVerified: true },
          { productId: 121, userId: 1, rating: 5, title: "A life-changing read", body: "Simple yet profound. Paulo Coelho teaches that the universe conspires to help you achieve your dreams.", isVerified: true },
          { productId: 128, userId: 1, rating: 4, title: "Eye-opening financial lessons", body: "Changed my perspective on assets vs liabilities. A must-read for anyone starting their financial journey.", isVerified: true },
          { productId: 136, userId: 1, rating: 5, title: "Best portable speaker", body: "The bass is incredible for the size. IP67 means I can take it to the beach. Powerbank feature is super useful.", isVerified: true },
        ],
      });
    },
    { timeout: 120000 }
  );
}

main()
  .then(async () => {
    // Reset all sequences so auto-increment picks up after the max seeded ID
    const tables = [
      "users", "addresses", "categories", "brands", "products",
      "product_variants", "variant_attributes", "product_images",
      "product_specifications", "product_categories", "product_reviews",
      "cart_items", "wishlist_items", "orders", "order_items",
    ];
    for (const table of tables) {
      try {
        const seqName = await prisma.$queryRawUnsafe(
          `SELECT pg_get_serial_sequence('"${table}"', 'id')`
        ) as any[];
        if (seqName?.[0]?.pg_get_serial_sequence) {
          await prisma.$executeRawUnsafe(
            `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1, false)`
          );
        }
      } catch {
        // Skip tables without an id sequence
      }
    }
    console.log("Seed completed successfully.");
  })
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
