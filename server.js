// c-hub-backend/server.js

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3013;

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

// Initialize data
const initializeData = () => {
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    // I-copy mo dito ang laman ng products.json mo
    const products = [/* your products here */];
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
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
  const BASE_URL = 'http://localhost:3013';
  
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
    const BASE_URL = 'http://localhost:3013';
    
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
      if (product && product.image) {
        imageUrl = product.image;
        if (imageUrl.startsWith('/')) {
          imageUrl = `${BASE_URL}${imageUrl}`;
        }
      } else {
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