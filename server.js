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

// ✅ CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Serve static images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ============ DATA DIRECTORY ============
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');


// ============ INITIALIZE FILES ============
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(PRODUCTS_FILE)) {
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

  // ============ PANTS - MEN ============
  {
    "id": "clothes-men-pants-Light Stone-28",
    "sku": "CHUB-PANTS-001",
    "name": "Classic Denim Jeans - Light Stone",
    "price": 1799,
    "stock": 40,
    "image": "/images/pants/men/pants/pants1.png",
    "sizes": ["28", "30", "32", "34", "36"],
    "colors": ["Light Stone"],
    "category": "Apparel",
    "subCategory": "Jeans",
    "costPrice": 900,
    "brand": "C-HUB Street"
  },
  {
    "id": "clothes-men-pants-Mid Gray-28",
    "sku": "CHUB-PANTS-002",
    "name": "Classic Denim Jeans - Mid Gray",
    "price": 1799,
    "stock": 35,
    "image": "/images/pants/men/pants/pants2.png",
    "sizes": ["28", "30", "32", "34", "36"],
    "colors": ["Mid Gray"],
    "category": "Apparel",
    "subCategory": "Jeans",
    "costPrice": 900,
    "brand": "C-HUB Street"
  },
  {
    "id": "clothes-men-pants-Off White-28",
    "sku": "CHUB-PANTS-003",
    "name": "Classic Denim Jeans - Off White",
    "price": 1799,
    "stock": 30,
    "image": "/images/pants/men/pants/pants3.png",
    "sizes": ["28", "30", "32", "34", "36"],
    "colors": ["Off White"],
    "category": "Apparel",
    "subCategory": "Jeans",
    "costPrice": 900,
    "brand": "C-HUB Street"
  },
  {
    "id": "clothes-men-pants-Silver Sand-28",
    "sku": "CHUB-PANTS-004",
    "name": "Classic Denim Jeans - Silver Sand",
    "price": 1799,
    "stock": 25,
    "image": "/images/pants/men/pants/pants4.png",
    "sizes": ["28", "30", "32", "34", "36"],
    "colors": ["Silver Sand"],
    "category": "Apparel",
    "subCategory": "Jeans",
    "costPrice": 900,
    "brand": "C-HUB Street"
  },
  {
    "id": "clothes-men-pants-Deep Indigo Navy-28",
    "sku": "CHUB-PANTS-005",
    "name": "Classic Denim Jeans - Deep Indigo Navy",
    "price": 1799,
    "stock": 20,
    "image": "/images/pants/men/pants/pants5.png",
    "sizes": ["28", "30", "32", "34", "36"],
    "colors": ["Deep Indigo Navy"],
    "category": "Apparel",
    "subCategory": "Jeans",
    "costPrice": 900,
    "brand": "C-HUB Street"
  },
  {
    "id": "clothes-men-pants-Rustic Brown-28",
    "sku": "CHUB-PANTS-006",
    "name": "Classic Denim Jeans - Rustic Brown",
    "price": 1799,
    "stock": 15,
    "image": "/images/pants/men/pants/pants6.png",
    "sizes": ["28", "30", "32", "34", "36"],
    "colors": ["Rustic Brown"],
    "category": "Apparel",
    "subCategory": "Jeans",
    "costPrice": 900,
    "brand": "C-HUB Street"
  },

  // ============ PANTS - WOMEN ============
  // Wala pang images sa products.ts - skip muna

  // ============ MEN'S SHOES ============
  // Wala pang images sa products.ts - skip muna

  // ============ ACCESSORIES ============
  // Wala pang images sa products.ts - skip muna
];
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2));
}
if (!fs.existsSync(REVIEWS_FILE)) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify([]));
}

// ============ READ/WRITE FUNCTIONS ============
const readData = (file) => {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      return JSON.parse(content) || [];
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

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  const orders = readData(ORDERS_FILE);
  const products = readData(PRODUCTS_FILE);
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    orders: orders.length,
    products: products.length
  });
});

// ============ DEBUG ============
app.get('/api/debug/products', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  res.json({
    total: products.length,
    products: products.map(p => ({ 
      id: p.id, 
      name: p.name, 
      image: p.image 
    }))
  });
});

// ============ ORDERS ============

// Get all orders
app.get('/api/orders', (req, res) => {
  const orders = readData(ORDERS_FILE);
  res.json(orders);
});

// Sync orders from store
app.post('/api/orders/sync', (req, res) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: 'Invalid orders data' });
    }
    
    console.log(`🔄 Syncing ${orders.length} orders...`);
    writeData(ORDERS_FILE, orders);
    
    res.json({ success: true, count: orders.length });
  } catch (error) {
    console.error('❌ Sync failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create order
app.post('/api/orders', (req, res) => {
  try {
    const orders = readData(ORDERS_FILE);
    
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

    orders.unshift(newOrder);
    writeData(ORDERS_FILE, orders);

    console.log(`✅ Order saved: ${newOrder.orderId}`);
    res.status(201).json({ success: true, order: newOrder });
    
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order
app.patch('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const orders = readData(ORDERS_FILE);
    const index = orders.findIndex(o => o.orderId === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    orders[index] = {
      ...orders[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    writeData(ORDERS_FILE, orders);
    res.json({ success: true, order: orders[index] });
    
  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const orders = readData(ORDERS_FILE);
    const filtered = orders.filter(o => o.orderId !== id);
    
    if (filtered.length === orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    writeData(ORDERS_FILE, filtered);
    console.log(`🗑️ Order ${id} deleted`);
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ PRODUCTS ============

// Get all products
app.get('/api/products', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  res.json(products);
});

// ============ REVIEWS ============

// Get reviews
app.get('/api/reviews', (req, res) => {
  const reviews = readData(REVIEWS_FILE);
  res.json(reviews);
});

// Create review
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

  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', clientId })}\n\n`);

  const interval = setInterval(() => {
    res.write(`: ping\n\n`);
  }, 15000);

  req.on('close', () => {
    console.log(`🔌 SSE client ${clientId} disconnected`);
    clearInterval(interval);
  });

  req.on('error', (err) => {
    console.log(`⚠️ SSE client ${clientId} error:`, err.message);
    clearInterval(interval);
  });
});

// ============ START SERVER ============
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ C-HUB Backend Server running on port ${PORT}`);
  console.log(`   📁 Data folder: ${DATA_DIR}`);
  console.log(`   📦 Orders: ${readData(ORDERS_FILE).length}`);
  console.log(`   📦 Products: ${readData(PRODUCTS_FILE).length}`);
  console.log(`   🔌 Health: http://localhost:${PORT}/api/health`);
  console.log(`   📡 Sync: POST /api/orders/sync`);
});