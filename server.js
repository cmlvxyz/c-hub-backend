// c-hub-backend/server.js

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3013;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ I-SERVE ANG STATIC FILES (IMAGES)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Data folder
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const PURCHASE_ORDERS_FILE = path.join(DATA_DIR, 'purchase_orders.json');

const INITIAL_PRODUCTS = [
  // ============ MEN'S T-SHIRTS ============
  {
    "id": "clothes-men-tshirt-White-XL",
    "sku": "CHUB-TEE-001",
    "name": "Premium T-Shirt - White",
    "price": 1999,
    "stock": 50,
    "image": "/images/clothes/men/t-shirts/white.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["White"],
    "category": "Apparel",
    "subCategory": "T-Shirts",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-tshirt-Black-XL",
    "sku": "CHUB-TEE-002",
    "name": "Premium T-Shirt - Black",
    "price": 1999,
    "stock": 45,
    "image": "/images/clothes/men/t-shirts/black.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Black"],
    "category": "Apparel",
    "subCategory": "T-Shirts",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-tshirt-Blue-XL",
    "sku": "CHUB-TEE-003",
    "name": "Premium T-Shirt - Blue",
    "price": 1999,
    "stock": 40,
    "image": "/images/clothes/men/t-shirts/blue.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Blue"],
    "category": "Apparel",
    "subCategory": "T-Shirts",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-tshirt-Yellow-XL",
    "sku": "CHUB-TEE-004",
    "name": "Premium T-Shirt - Yellow",
    "price": 1999,
    "stock": 35,
    "image": "/images/clothes/men/t-shirts/yellow.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Yellow"],
    "category": "Apparel",
    "subCategory": "T-Shirts",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-tshirt-Red-XL",
    "sku": "CHUB-TEE-005",
    "name": "Premium T-Shirt - Red",
    "price": 1999,
    "stock": 30,
    "image": "/images/clothes/men/t-shirts/red.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Red"],
    "category": "Apparel",
    "subCategory": "T-Shirts",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-tshirt-Green-XL",
    "sku": "CHUB-TEE-006",
    "name": "Premium T-Shirt - Green",
    "price": 1999,
    "stock": 25,
    "image": "/images/clothes/men/t-shirts/green.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Green"],
    "category": "Apparel",
    "subCategory": "T-Shirts",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  
  // ============ MEN'S HOODIES ============
  {
    "id": "clothes-men-hoodie-Beige-XL",
    "sku": "CHUB-HD-001",
    "name": "Cozy Hoodie - Beige",
    "price": 2499,
    "stock": 40,
    "image": "/images/clothes/men/hoodie/beige.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Beige"],
    "category": "Apparel",
    "subCategory": "Hoodies & Sweats",
    "costPrice": 1200,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-hoodie-Mauve-XL",
    "sku": "CHUB-HD-002",
    "name": "Cozy Hoodie - Mauve",
    "price": 2499,
    "stock": 35,
    "image": "/images/clothes/men/hoodie/mauve.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Mauve"],
    "category": "Apparel",
    "subCategory": "Hoodies & Sweats",
    "costPrice": 1200,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-hoodie-Pink-XL",
    "sku": "CHUB-HD-003",
    "name": "Cozy Hoodie - Pink",
    "price": 2499,
    "stock": 30,
    "image": "/images/clothes/men/hoodie/pink.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Pink"],
    "category": "Apparel",
    "subCategory": "Hoodies & Sweats",
    "costPrice": 1200,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-hoodie-Sage-XL",
    "sku": "CHUB-HD-004",
    "name": "Cozy Hoodie - Sage",
    "price": 2499,
    "stock": 25,
    "image": "/images/clothes/men/hoodie/sage.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Sage"],
    "category": "Apparel",
    "subCategory": "Hoodies & Sweats",
    "costPrice": 1200,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-hoodie-Burgundy-XL",
    "sku": "CHUB-HD-005",
    "name": "Cozy Hoodie - Burgundy",
    "price": 2499,
    "stock": 20,
    "image": "/images/clothes/men/hoodie/burgundy.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Burgundy"],
    "category": "Apparel",
    "subCategory": "Hoodies & Sweats",
    "costPrice": 1200,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-hoodie-Brown-XL",
    "sku": "CHUB-HD-006",
    "name": "Cozy Hoodie - Brown",
    "price": 2499,
    "stock": 15,
    "image": "/images/clothes/men/hoodie/brown.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Brown"],
    "category": "Apparel",
    "subCategory": "Hoodies & Sweats",
    "costPrice": 1200,
    "brand": "C-HUB Originals"
  },
  
  // ============ MEN'S SWEATSHIRTS ============
  {
    "id": "clothes-men-sweatshirt-White-XL",
    "sku": "CHUB-SW-001",
    "name": "Classic Sweatshirt - White",
    "price": 2199,
    "stock": 40,
    "image": "/images/clothes/men/sweatshirts/white1.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["White"],
    "category": "Apparel",
    "subCategory": "Sweatshirts",
    "costPrice": 1000,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-sweatshirt-Gray-XL",
    "sku": "CHUB-SW-002",
    "name": "Classic Sweatshirt - Gray",
    "price": 2199,
    "stock": 35,
    "image": "/images/clothes/men/sweatshirts/gray1.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Gray"],
    "category": "Apparel",
    "subCategory": "Sweatshirts",
    "costPrice": 1000,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-sweatshirt-Blue-XL",
    "sku": "CHUB-SW-003",
    "name": "Classic Sweatshirt - Blue",
    "price": 2199,
    "stock": 30,
    "image": "/images/clothes/men/sweatshirts/blue1.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Blue"],
    "category": "Apparel",
    "subCategory": "Sweatshirts",
    "costPrice": 1000,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-sweatshirt-Brown-XL",
    "sku": "CHUB-SW-004",
    "name": "Classic Sweatshirt - Brown",
    "price": 2199,
    "stock": 25,
    "image": "/images/clothes/men/sweatshirts/brown2.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Brown"],
    "category": "Apparel",
    "subCategory": "Sweatshirts",
    "costPrice": 1000,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-sweatshirt-Pink-XL",
    "sku": "CHUB-SW-005",
    "name": "Classic Sweatshirt - Pink",
    "price": 2199,
    "stock": 20,
    "image": "/images/clothes/men/sweatshirts/pink1.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Pink"],
    "category": "Apparel",
    "subCategory": "Sweatshirts",
    "costPrice": 1000,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-men-sweatshirt-Beige-XL",
    "sku": "CHUB-SW-006",
    "name": "Classic Sweatshirt - Beige",
    "price": 2199,
    "stock": 15,
    "image": "/images/clothes/men/sweatshirts/beige1.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Beige"],
    "category": "Apparel",
    "subCategory": "Sweatshirts",
    "costPrice": 1000,
    "brand": "C-HUB Originals"
  },

  // ============ WOMEN'S TOPS ============
  {
    "id": "clothes-women-top-Cream-S",
    "sku": "CHUB-WTOP-001",
    "name": "Peplum Top - Cream",
    "price": 1799,
    "stock": 30,
    "image": "/images/clothes/women/top/top1.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Cream"],
    "category": "Apparel",
    "subCategory": "Top",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-women-top-White-S",
    "sku": "CHUB-WTOP-002",
    "name": "Peplum Top - White",
    "price": 1799,
    "stock": 30,
    "image": "/images/clothes/women/top/top2.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["White"],
    "category": "Apparel",
    "subCategory": "Top",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-women-top-Sky Blue Gingham-S",
    "sku": "CHUB-WTOP-003",
    "name": "Peplum Top - Sky Blue Gingham",
    "price": 1799,
    "stock": 30,
    "image": "/images/clothes/women/top/top3.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Sky Blue Gingham"],
    "category": "Apparel",
    "subCategory": "Top",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-women-top-Sage Green-S",
    "sku": "CHUB-WTOP-004",
    "name": "Peplum Top - Sage Green",
    "price": 1799,
    "stock": 30,
    "image": "/images/clothes/women/top/top4.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Sage Green"],
    "category": "Apparel",
    "subCategory": "Top",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-women-top-Mocha Brown-S",
    "sku": "CHUB-WTOP-005",
    "name": "Peplum Top - Mocha Brown",
    "price": 1799,
    "stock": 30,
    "image": "/images/clothes/women/top/top5.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Mocha Brown"],
    "category": "Apparel",
    "subCategory": "Top",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-women-top-Obsidian Black-S",
    "sku": "CHUB-WTOP-006",
    "name": "Peplum Top - Obsidian Black",
    "price": 1799,
    "stock": 30,
    "image": "/images/clothes/women/top/top6.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Obsidian Black"],
    "category": "Apparel",
    "subCategory": "Top",
    "costPrice": 800,
    "brand": "C-HUB Originals"
  },

  // ============ WOMEN'S DRESSES ============
  {
    "id": "clothes-women-dress-Polka White-S",
    "sku": "CHUB-WDRS-001",
    "name": "Summer Halter Dress - Polka White",
    "price": 2999,
    "stock": 25,
    "image": "/images/clothes/women/dress/dress1.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Polka White"],
    "category": "Apparel",
    "subCategory": "Dress",
    "costPrice": 1500,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-women-dress-Sky Stripe-S",
    "sku": "CHUB-WDRS-002",
    "name": "Summer Halter Dress - Sky Stripe",
    "price": 2999,
    "stock": 25,
    "image": "/images/clothes/women/dress/dress2.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Sky Stripe"],
    "category": "Apparel",
    "subCategory": "Dress",
    "costPrice": 1500,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-women-dress-Buttercup Gingham-S",
    "sku": "CHUB-WDRS-003",
    "name": "Summer Halter Dress - Buttercup Gingham",
    "price": 2999,
    "stock": 25,
    "image": "/images/clothes/women/dress/dress3.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Buttercup Gingham"],
    "category": "Apparel",
    "subCategory": "Dress",
    "costPrice": 1500,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-women-dress-Rose Gingham-S",
    "sku": "CHUB-WDRS-004",
    "name": "Summer Halter Dress - Rose Gingham",
    "price": 2999,
    "stock": 25,
    "image": "/images/clothes/women/dress/dress4.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Rose Gingham"],
    "category": "Apparel",
    "subCategory": "Dress",
    "costPrice": 1500,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-women-dress-Ocean Gingham-S",
    "sku": "CHUB-WDRS-005",
    "name": "Summer Halter Dress - Ocean Gingham",
    "price": 2999,
    "stock": 25,
    "image": "/images/clothes/women/dress/dress5.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Ocean Gingham"],
    "category": "Apparel",
    "subCategory": "Dress",
    "costPrice": 1500,
    "brand": "C-HUB Originals"
  },
  {
    "id": "clothes-women-dress-Midnight Polka-S",
    "sku": "CHUB-WDRS-006",
    "name": "Summer Halter Dress - Midnight Polka",
    "price": 2999,
    "stock": 25,
    "image": "/images/clothes/women/dress/dress6.png",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Midnight Polka"],
    "category": "Apparel",
    "subCategory": "Dress",
    "costPrice": 1500,
    "brand": "C-HUB Originals"
  },

  // ============ MEN'S SHOES ============
  {
    "id": "shoes-men-sneakers-Chalk White-7",
    "sku": "CHUB-SNK-001",
    "name": "Urban Sneakers - Chalk White",
    "price": 2499,
    "stock": 40,
    "image": "/images/clothes/men/shoes/shoes1.png",
    "sizes": ["7", "8", "9", "10", "11"],
    "colors": ["Chalk White"],
    "category": "Footwear",
    "subCategory": "Sneakers",
    "costPrice": 1200,
    "brand": "C-HUB Kicks"
  },
  {
    "id": "shoes-men-sneakers-Stealth Charcoal-7",
    "sku": "CHUB-SNK-002",
    "name": "Urban Sneakers - Stealth Charcoal",
    "price": 2499,
    "stock": 35,
    "image": "/images/clothes/men/shoes/shoes2.png",
    "sizes": ["7", "8", "9", "10", "11"],
    "colors": ["Stealth Charcoal"],
    "category": "Footwear",
    "subCategory": "Sneakers",
    "costPrice": 1200,
    "brand": "C-HUB Kicks"
  },
  {
    "id": "shoes-men-sneakers-Deep Navy-7",
    "sku": "CHUB-SNK-003",
    "name": "Urban Sneakers - Deep Navy",
    "price": 2499,
    "stock": 30,
    "image": "/images/clothes/men/shoes/shoes3.png",
    "sizes": ["7", "8", "9", "10", "11"],
    "colors": ["Deep Navy"],
    "category": "Footwear",
    "subCategory": "Sneakers",
    "costPrice": 1200,
    "brand": "C-HUB Kicks"
  },

  // ============ PANTS ============
  {
    "id": "clothes-men-pants-Light Stone-28",
    "sku": "CHUB-PANTS-001",
    "name": "Classic Denim Jeans - Light Stone",
    "price": 1799,
    "stock": 40,
    "image": "/images/clothes/men/pants/pants1.png",
    "sizes": ["28", "30", "32", "34", "36"],
    "colors": ["Light Stone"],
    "category": "Apparel",
    "subCategory": "Jeans",
    "costPrice": 900,
    "brand": "C-HUB Street"
  },
  
  // ============ ACCESSORIES ============
  {
    "id": "clothes-men-accessories-Black-OS",
    "sku": "CHUB-BAG-001",
    "name": "Everyday Crossbody Bag - Stone",
    "price": 1499,
    "stock": 50,
    "image": "/images/clothes/men/accessories/black.png",
    "sizes": ["OS", "S", "M", "L"],
    "colors": ["Stone"],
    "category": "Accessories",
    "subCategory": "Bags",
    "costPrice": 700,
    "brand": "C-HUB Gear"
  },
  {
    "id": "clothes-men-accessories-White-OS",
    "sku": "CHUB-CAP-001",
    "name": "Classic Street Cap - White",
    "price": 799,
    "stock": 60,
    "image": "/images/clothes/men/accessories/white.png",
    "sizes": ["OS", "S", "M", "L"],
    "colors": ["White"],
    "category": "Accessories",
    "subCategory": "Hats",
    "costPrice": 350,
    "brand": "C-HUB Gear"
  },
  {
    "id": "clothes-men-accessories-White-S",
    "sku": "CHUB-SOCK-001",
    "name": "Cushioned Crew Socks - White",
    "price": 399,
    "stock": 100,
    "image": "/images/clothes/men/accessories/white.png",
    "sizes": ["S", "M", "L"],
    "colors": ["White"],
    "category": "Accessories",
    "subCategory": "Socks",
    "costPrice": 150,
    "brand": "C-HUB Gear"
  }
];

// Initialize data
const initializeData = () => {
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2));
  }
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(PURCHASE_ORDERS_FILE)) {
    fs.writeFileSync(PURCHASE_ORDERS_FILE, JSON.stringify([]));
  }
};

initializeData();

// ============ READ/WRITE DATA ============
const readData = (file) => {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (!content || content.trim() === '') {
        return [];
      }
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error(`❌ Error reading ${file}:`, error);
    return [];
  }
};

const writeData = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`❌ Error writing ${file}:`, error);
    return false;
  }
};

// ============ PRODUCT IMAGE ENRICHMENT - FIXED & ROBUST ============
const enrichOrderItemsWithImages = (order) => {
  if (!order || !order.items || order.items.length === 0) {
    return order;
  }
  
  const products = readData(PRODUCTS_FILE);
  const BASE_URL = 'https://c-hub-admin.vercel.app';
  
  console.log(`🔍 Enriching ${order.items.length} items for order ${order.orderId}`);
  
  const enrichedItems = order.items.map(item => {
    console.log(`  - Looking for product: "${item.name}" (id: ${item.id || item.productId || 'N/A'})`);
    
    // Hanapin ang product gamit ang iba't ibang paraan
    let product = null;
    
    // 1. Hanapin gamit ang productId
    if (item.productId) {
      product = products.find(p => p.id === item.productId);
      if (product) console.log(`    ✅ Found by productId: ${product.id}`);
    }
    
    // 2. Hanapin gamit ang id
    if (!product && item.id) {
      product = products.find(p => p.id === item.id);
      if (product) console.log(`    ✅ Found by id: ${product.id}`);
    }
    
    // 3. Hanapin gamit ang sku
    if (!product && item.sku) {
      product = products.find(p => p.sku === item.sku);
      if (product) console.log(`    ✅ Found by sku: ${product.sku}`);
    }
    
    // 4. Hanapin gamit ang exact name
    if (!product && item.name) {
      product = products.find(p => p.name === item.name);
      if (product) console.log(`    ✅ Found by exact name: ${product.name}`);
    }
    
    // 5. Hanapin gamit ang partial name
    if (!product && item.name) {
      const itemNameLower = item.name.toLowerCase();
      product = products.find(p => p.name.toLowerCase().includes(itemNameLower));
      if (product) console.log(`    ✅ Found by partial name: ${product.name}`);
    }
    
    // 6. Hanapin gamit ang subCategory
    if (!product && item.subCategory) {
      product = products.find(p => p.subCategory === item.subCategory);
      if (product) console.log(`    ✅ Found by subCategory: ${product.subCategory}`);
    }
    
    // 7. Hanapin gamit ang color
    if (!product && item.color) {
      product = products.find(p => p.colors && p.colors.some(c => c.toLowerCase() === item.color.toLowerCase()));
      if (product) console.log(`    ✅ Found by color: ${product.colors}`);
    }
    
    // ✅ KUNG MAY PRODUCT, GAMITIN ANG IMAGE
    if (product && product.image) {
      let imageUrl = product.image;
      if (imageUrl.startsWith('/')) {
        imageUrl = `${BASE_URL}${imageUrl}`;
      }
      console.log(`    ✅ Image URL: ${imageUrl}`);
      return { ...item, image: imageUrl };
    }
    
    // ✅ FALLBACK: Gumamit ng default image (base sa category)
    let fallbackImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80';
    if (item.subCategory === 'Sneakers') {
      fallbackImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80';
    } else if (item.subCategory === 'T-Shirts') {
      fallbackImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=80';
    } else if (item.subCategory === 'Hoodies & Sweats') {
      fallbackImage = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80';
    }
    
    console.log(`    📷 Using fallback for "${item.name}"`);
    return { ...item, image: fallbackImage };
  });
  
  order.items = enrichedItems;
  return order;
};

// ============ SSE CLIENTS ============
let sseClients = [];

function broadcastSSE(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  console.log(`📡 Broadcasting SSE: ${event} to ${sseClients.length} clients`);
  sseClients.forEach(client => {
    try {
      client.res.write(payload);
    } catch (err) {
      console.log('⚠️ Failed to send SSE to client');
    }
  });
}

// ============ API ROUTES ============

// ✅ SYNC ORDERS FROM STORE
app.post('/api/orders/sync', (req, res) => {
  try {
    const { orders: clientOrders } = req.body;
    
    if (!Array.isArray(clientOrders)) {
      return res.status(400).json({ error: 'Invalid orders data' });
    }
    
    console.log(`🔄 Syncing ${clientOrders.length} orders from client...`);
    console.log('📦 First order items:', JSON.stringify(clientOrders[0]?.items || [], null, 2));
    
    // I-enrich ang bawat order ng product images
    const enrichedOrders = clientOrders.map(order => enrichOrderItemsWithImages(order));
    
    // I-load ang existing orders
    let existingOrders = readData(ORDERS_FILE);
    if (!Array.isArray(existingOrders)) {
      existingOrders = [];
    }
    
    // I-merge ang orders
    const existingIds = new Set(existingOrders.map(o => o.orderId));
    
    enrichedOrders.forEach(clientOrder => {
      if (!existingIds.has(clientOrder.orderId)) {
        existingOrders.push(clientOrder);
        existingIds.add(clientOrder.orderId);
      } else {
        const index = existingOrders.findIndex(o => o.orderId === clientOrder.orderId);
        if (index !== -1) {
          existingOrders[index] = { ...existingOrders[index], ...clientOrder };
        }
      }
    });
    
    writeData(ORDERS_FILE, existingOrders);
    broadcastSSE('order_sync', { count: existingOrders.length });
    
    console.log(`✅ Synced ${existingOrders.length} total orders`);
    res.json({ success: true, count: existingOrders.length });
    
  } catch (error) {
    console.error('❌ Failed to sync orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all orders - WITH IMAGE ENRICHMENT
app.get('/api/orders', (req, res) => {
  let orders = readData(ORDERS_FILE);
  if (!Array.isArray(orders)) {
    orders = [];
  }
  
  console.log(`📦 Loading ${orders.length} orders...`);
  
  // I-enrich ang bawat order ng product images
  const enrichedOrders = orders.map(order => enrichOrderItemsWithImages(order));
  
  res.json(enrichedOrders);
});

// Get single order - WITH IMAGE ENRICHMENT
app.get('/api/orders/:id', (req, res) => {
  let orders = readData(ORDERS_FILE);
  if (!Array.isArray(orders)) {
    orders = [];
  }
  const order = orders.find(o => o.orderId === req.params.id);
  
  if (order) {
    const enrichedOrder = enrichOrderItemsWithImages(order);
    res.json(enrichedOrder);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Create order - WITH IMAGE ENRICHMENT
app.post('/api/orders', (req, res) => {
  try {
    console.log('📦 Received order request');
    
    let orders = readData(ORDERS_FILE);
    if (!Array.isArray(orders)) {
      orders = [];
    }
    
    const products = readData(PRODUCTS_FILE);
    const BASE_URL = 'https://c-hub-admin.vercel.app';
    
    const newOrder = {
      ...req.body,
      orderId: req.body.orderId || `CHUB-${Math.floor(100000 + Math.random() * 900000)}`,
      date: req.body.date || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      createdAt: new Date().toISOString(),
      status: req.body.status || 'To Ship'
    };

    // I-enrich ang items ng product images
    newOrder.items = newOrder.items.map(item => {
      let product = products.find(p => p.id === item.productId);
      if (!product && item.id) {
        product = products.find(p => p.id === item.id);
      }
      if (!product && item.sku) {
        product = products.find(p => p.sku === item.sku);
      }
      if (!product && item.name) {
        product = products.find(p => p.name === item.name);
      }
      if (!product && item.name) {
        const itemNameLower = item.name.toLowerCase();
        product = products.find(p => p.name.toLowerCase().includes(itemNameLower));
      }
      
      let imageUrl = null;
      // ✅ I-CONVERT LAHAT NG IMAGES SA TAMANG FULL URL
      if (product && product.image) {
        let fullImageUrl = product.image;
        
        // Kung may leading slash (/), lagyan ng backend URL
        if (fullImageUrl.startsWith('/')) {
          fullImageUrl = `${BASE_URL}${fullImageUrl}`;
        }
        // Kung wala pang http, lagyan ng buong URL
        else if (!fullImageUrl.startsWith('http') && !fullImageUrl.startsWith('https')) {
          fullImageUrl = `${BASE_URL}/${fullImageUrl}`;
        }
        
        imageUrl = fullImageUrl;
      } else {
        // Fallback para sa generic na item
        imageUrl = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80';
      }
      
      return { ...item, image: imageUrl };
    });

    // Decrement inventory
    if (newOrder.items && newOrder.items.length > 0) {
      newOrder.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId || p.id === item.id);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - (item.qty || 1));
        }
      });
      writeData(PRODUCTS_FILE, products);
    }

    orders.unshift(newOrder);
    writeData(ORDERS_FILE, orders);

    broadcastSSE('new_order', newOrder);
    broadcastSSE('inventory_sync', products);

    console.log('✅ Order saved:', newOrder.orderId);
    res.status(201).json({ success: true, order: newOrder });
    
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create order' 
    });
  }
});

// UPDATE ORDER STATUS
app.patch('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    let orders = readData(ORDERS_FILE);
    if (!Array.isArray(orders)) {
      orders = [];
    }
    
    const index = orders.findIndex(o => o.orderId === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = {
      ...orders[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    const enrichedOrder = enrichOrderItemsWithImages(updatedOrder);
    
    orders[index] = enrichedOrder;
    writeData(ORDERS_FILE, orders);
    
    broadcastSSE('order_update', { 
      orderId: id, 
      status: enrichedOrder.status, 
      order: enrichedOrder 
    });
    
    console.log(`📦 Order ${id} updated to ${enrichedOrder.status}`);
    res.json({ success: true, order: enrichedOrder });
    
  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE ORDER
app.delete('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    let orders = readData(ORDERS_FILE);
    if (!Array.isArray(orders)) {
      orders = [];
    }
    
    const index = orders.findIndex(o => o.orderId === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const deletedOrder = orders[index];
    orders.splice(index, 1);
    writeData(ORDERS_FILE, orders);
    
    broadcastSSE('order_deleted', { orderId: id });
    
    console.log(`🗑️ Order ${id} deleted`);
    res.json({ success: true, order: deletedOrder });
    
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get products
app.get('/api/products', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  res.json(products);
});

// Update product
app.patch('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = readData(PRODUCTS_FILE);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = {
      ...products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    writeData(PRODUCTS_FILE, products);
    broadcastSSE('inventory_sync', products[index]);
    res.json({ success: true, product: products[index] });
    
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = readData(PRODUCTS_FILE);
    const filtered = products.filter(p => p.id !== id);
    
    if (filtered.length === products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    writeData(PRODUCTS_FILE, filtered);
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ ALERTS ============
app.get('/api/alerts', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const alerts = products
    .filter(p => p.stock <= 10)
    .map(p => ({
      id: `alert-${p.id}`,
      productId: p.id,
      sku: p.sku || `SKU-${p.id}`,
      productName: p.name,
      category: p.category || 'General',
      currentStock: p.stock,
      threshold: 10,
      reorderPoint: 15,
      reorderQty: 50,
      supplierName: 'Default Supplier',
      estimatedDaysToOut: p.stock > 0 ? Math.round((p.stock / 5) * 10) / 10 : 0,
      severity: p.stock === 0 ? 'critical' : 'warning',
      status: 'active',
      createdAt: new Date().toISOString()
    }));
  res.json(alerts);
});

// ============ PURCHASE ORDERS ============
app.get('/api/purchase-orders', (req, res) => {
  const pos = readData(PURCHASE_ORDERS_FILE);
  res.json(pos);
});

app.post('/api/purchase-orders', (req, res) => {
  try {
    const pos = readData(PURCHASE_ORDERS_FILE);
    const newPO = {
      ...req.body,
      id: `po-${Date.now()}`,
      poNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'Draft'
    };
    pos.unshift(newPO);
    writeData(PURCHASE_ORDERS_FILE, pos);
    res.status(201).json({ success: true, purchaseOrder: newPO });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/purchase-orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const pos = readData(PURCHASE_ORDERS_FILE);
    const index = pos.findIndex(p => p.id === id || p.poNumber === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    pos[index] = {
      ...pos[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    writeData(PURCHASE_ORDERS_FILE, pos);
    res.json({ success: true, purchaseOrder: pos[index] });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ REVIEWS ============
app.get('/api/reviews', (req, res) => {
  const reviews = readData(REVIEWS_FILE);
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  try {
    const reviews = readData(REVIEWS_FILE);
    const newReview = {
      ...req.body,
      id: `review-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'published'
    };
    reviews.unshift(newReview);
    writeData(REVIEWS_FILE, reviews);
    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reviews/:id/reply', (req, res) => {
  try {
    const { id } = req.params;
    const reviews = readData(REVIEWS_FILE);
    const index = reviews.findIndex(r => r.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    reviews[index].adminReply = {
      comment: req.body.comment,
      date: new Date().toISOString()
    };

    writeData(REVIEWS_FILE, reviews);
    res.json({ success: true, review: reviews[index] });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ GATEWAYS ============
const GATEWAYS = [
  {
    id: 'gcash',
    name: 'GCash Direct & QR',
    type: 'E-Wallet',
    icon: 'gcash',
    enabled: true,
    testMode: false,
    feeFixed: 0,
    feePercentage: 1.5,
    successRate: 99.4,
    dailyVolume: 148500,
    health: 'healthy'
  },
  {
    id: 'maya',
    name: 'Maya Wallet & Checkout',
    type: 'E-Wallet',
    icon: 'maya',
    enabled: true,
    testMode: false,
    feeFixed: 0,
    feePercentage: 1.5,
    successRate: 98.9,
    dailyVolume: 92400,
    health: 'healthy'
  },
  {
    id: 'cards',
    name: 'Visa / Mastercard / JCB',
    type: 'Credit/Debit Card',
    icon: 'card',
    enabled: true,
    testMode: false,
    feeFixed: 15,
    feePercentage: 2.9,
    successRate: 97.8,
    dailyVolume: 215000,
    health: 'healthy'
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    type: 'Offline',
    icon: 'cash',
    enabled: true,
    testMode: false,
    feeFixed: 25,
    feePercentage: 0,
    successRate: 92.5,
    dailyVolume: 64000,
    health: 'healthy'
  }
];

app.get('/api/gateways', (req, res) => {
  res.json(GATEWAYS);
});

app.patch('/api/gateways/:id/toggle', (req, res) => {
  const { id } = req.params;
  const gateway = GATEWAYS.find(g => g.id === id);
  if (!gateway) {
    return res.status(404).json({ error: 'Gateway not found' });
  }
  gateway.enabled = !gateway.enabled;
  res.json({ success: true, gateway });
});

app.post('/api/gateways/:id/test-webhook', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Webhook test successful', 
    event: 'payment_intent.succeeded' 
  });
});

// ============ ANALYTICS ============
app.get('/api/analytics', (req, res) => {
  const orders = readData(ORDERS_FILE);
  const products = readData(PRODUCTS_FILE);
  const validOrders = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded');
  const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalCost = validOrders.reduce((sum, o) => sum + (o.costTotal || 0), 0);
  const grossProfit = totalRevenue - totalCost;
  const grossMarginPct = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;
  const aov = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
  
  res.json({
    totalRevenue,
    grossProfit,
    grossMarginPct,
    aov,
    totalOrders: orders.length,
    completedOrders: orders.filter(o => o.status === 'Completed').length,
    activeOrders: orders.filter(o => ['To Ship', 'Shipped', 'Out for Delivery'].includes(o.status)).length,
    toPayOrders: orders.filter(o => o.status === 'To Pay').length,
    channelData: { 'Online Store': totalRevenue * 0.6 },
    gatewayData: { 'GCash': 5, 'Maya': 3, 'COD': 2 },
    inventoryValuation: products.reduce((sum, p) => sum + (p.stock || 0) * (p.costPrice || 500), 0),
    retailValuation: products.reduce((sum, p) => sum + (p.stock || 0) * (p.price || 0), 0),
    totalUnitsInStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
    lowStockCount: products.filter(p => (p.stock || 0) <= 10 && (p.stock || 0) > 0).length,
    outOfStockCount: products.filter(p => (p.stock || 0) === 0).length
  });
});

// ============ SSE ENDPOINT ============
app.get('/api/orders/stream/public', (req, res) => {
  console.log('🔌 SSE client connected');
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no'
  });

  const clientId = Date.now();
  const client = { id: clientId, res };
  sseClients.push(client);
  console.log(`📡 SSE client ${clientId} connected. Total clients: ${sseClients.length}`);

  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', clientId })}\n\n`);

  const orders = readData(ORDERS_FILE);
  res.write(`event: orders_count\ndata: ${JSON.stringify({ count: orders.length })}\n\n`);

  const interval = setInterval(() => {
    res.write(`: ping\n\n`);
  }, 15000);

  req.on('close', () => {
    console.log(`🔌 SSE client ${clientId} disconnected`);
    sseClients = sseClients.filter(c => c.id !== clientId);
    clearInterval(interval);
    console.log(`📡 Total clients: ${sseClients.length}`);
  });

  req.on('error', (err) => {
    console.log(`⚠️ SSE client ${clientId} error:`, err.message);
    clearInterval(interval);
  });
});

// ============ DELETE ALL ORDERS ============
app.delete('/api/orders/all', (req, res) => {
  try {
    writeData(ORDERS_FILE, []);
    broadcastSSE('orders_cleared', {});
    res.json({ success: true, message: 'All orders cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  const orders = readData(ORDERS_FILE);
  const products = readData(PRODUCTS_FILE);
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    orders: orders.length,
    products: products.length,
    sseClients: sseClients.length
  });
});

// ============ START SERVER ============
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ C-HUB Backend Server running on http://localhost:${PORT}`);
  console.log(`   📁 Data stored in: ${DATA_DIR}`);
  console.log(`   📦 Orders: ${readData(ORDERS_FILE).length}`);
  console.log(`   📦 Products: ${readData(PRODUCTS_FILE).length}`);
  console.log(`   🔌 SSE: http://localhost:${PORT}/api/orders/stream/public`);
  console.log(`   📡 Sync endpoint: POST /api/orders/sync`);
});