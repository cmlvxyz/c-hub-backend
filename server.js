// c-hub-backend/server.js

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3006;

// ============ CORS SETUP ============
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:3004', 'http://localhost:3005'];

app.use(cors({
  origin: (origin, callback) => {
    // Payagan ang localhost, specific origins, at lahat ng Vercel deployments
    if (!origin || corsOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback allow all for seamless connection
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ============ DATA DIRECTORY ============
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const DELETED_FILE = path.join(DATA_DIR, 'deleted_orders.json');

// ============ READ/WRITE HELPER FUNCTIONS ============
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

// Tomstone list of deleted order IDs -> pinipigilan ang pag-resurrect sa pamamagitan ng /sync
const readDeletedIds = () => {
  const val = readData(DELETED_FILE);
  return Array.isArray(val) ? val : [];
};

const writeDeletedIds = (ids) => {
  writeData(DELETED_FILE, [...new Set(ids)]);
};

// ============ ORDER STATUS HELPER ============
// Source of truth para sa initial order status:
//  - Cash on Delivery        -> 'To Ship'
//  - Online (GCash/Maya/Card) na bayad na -> 'To Ship'
//  - Online (GCash/Maya/Card) na hindi pa bayad / pending -> 'To Pay'
const getInitialOrderStatus = (payment, isPaid) => {
  const pay = String(payment || '').toLowerCase();
  const isCashOnDelivery = pay.includes('cod') || pay.includes('cash on delivery') || pay.includes('cashondelivery');
  if (isCashOnDelivery) return 'To Ship';

  let paid = isPaid === true || isPaid === 'true';
  if (payment && typeof payment === 'object') {
    const pStatus = String(payment.status || '').toLowerCase();
    if (['paid', 'success', 'successful', 'completed', 'succeeded', 'approved'].includes(pStatus)) paid = true;
  }

  return paid ? 'To Ship' : 'To Pay';
};

// ============ SSE CLIENTS TRACKER (REAL-TIME) ============
let sseClients = [];

const broadcastSSE = (event, data) => {
  sseClients.forEach(client => {
    client.res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  });
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

// ============ PRODUCTS ENDPOINTS ============
app.get('/api/products', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// ============ ORDERS ENDPOINTS ============

// GET Orders (May suporta sa email query para sa Store Customer)
app.get('/api/orders', (req, res) => {
  const { email, customerId, status } = req.query;
  let orders = readData(ORDERS_FILE);

  if (email) {
    orders = orders.filter(o => o.customer?.email?.toLowerCase() === email.toLowerCase());
  }

  if (status && status !== 'ALL') {
    orders = orders.filter(o => o.status?.toLowerCase() === status.toLowerCase());
  }

  res.json(orders);
});

// GET Single Order by ID
app.get('/api/orders/:id', (req, res) => {
  const orders = readData(ORDERS_FILE);
  const order = orders.find(o => o.orderId === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// POST Create Order (Galing sa C-Hub Store)
app.post('/api/orders', (req, res) => {
  try {
    const orders = readData(ORDERS_FILE);
    const products = readData(PRODUCTS_FILE);

    const { customer, items, payment, subtotal, shipping, discount, discountCode, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    // 1. Validate & Deduct Stock from products.json
    items.forEach(orderItem => {
      const prodIndex = products.findIndex(p => p.id === orderItem.id);
      if (prodIndex !== -1) {
        products[prodIndex].stock = Math.max(0, products[prodIndex].stock - (orderItem.qty || 1));
      }
    });
    writeData(PRODUCTS_FILE, products);

    // 2. Determine initial status base sa payment method (backend ang source of truth)
    // COD -> 'To Ship' | Online Payment na hindi bayad -> 'To Pay'
    const initialStatus = getInitialOrderStatus(payment, req.body.isPaid);

    const newOrder = {
      orderId: req.body.orderId || `CHUB-${Math.floor(100000 + Math.random() * 900000)}`,
      date: req.body.date || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      createdAt: new Date().toISOString(),
      customer: customer || {
        name: req.body.customerName || 'Customer',
        email: req.body.customerEmail || '',
        phone: req.body.customerPhone || '',
        address: req.body.shippingAddress?.address || ''
      },
      items: items,
      subtotal: subtotal || 0,
      shipping: shipping || 0,
      discount: discount || 0,
      discountCode: discountCode || '',
      total: total || subtotal || 0,
      payment: payment || 'Cash on Delivery',
      status: initialStatus
    };

    orders.unshift(newOrder);
    writeData(ORDERS_FILE, orders);

    console.log(`✅ New Order Placed: ${newOrder.orderId} - Total: ₱${newOrder.total}`);

    // 3. Real-Time Broadcast papunta sa Admin Panel via SSE
    broadcastSSE('new-order', newOrder);

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST Sync Orders (Galing sa Store localStorage; server ang source of truth ng status)
app.post('/api/orders/sync', (req, res) => {
  try {
    const incoming = Array.isArray(req.body) ? req.body : (req.body?.orders || []);
    if (!Array.isArray(incoming) || incoming.length === 0) {
      return res.status(400).json({ error: 'No orders to sync' });
    }

    const orders = readData(ORDERS_FILE);
    const deletedIds = readDeletedIds();
    let added = 0;
    let updated = 0;
    let skipped = 0;

    incoming.forEach(incomingOrder => {
      if (!incomingOrder?.orderId) return;

      // Huwag nang i-restore ang order na dati nang dinelete sa admin
      if (deletedIds.includes(incomingOrder.orderId)) {
        skipped++;
        return;
      }

      const index = orders.findIndex(o => o.orderId === incomingOrder.orderId);

      if (index !== -1) {
        // Existing order -> panatilihin ang status na galing sa server (source of truth)
        const serverStatus = orders[index].status;
        orders[index] = {
          ...orders[index],
          ...incomingOrder,
          status: serverStatus,
          updatedAt: new Date().toISOString()
        };
        updated++;
      } else {
        // Bagong order -> i-compute ang status mula sa payment, at i-broadcast para sa admin
        const newOrder = {
          ...incomingOrder,
          status: getInitialOrderStatus(incomingOrder.payment, incomingOrder.isPaid),
          createdAt: incomingOrder.createdAt || new Date().toISOString(),
          customer: incomingOrder.customer || {
            name: incomingOrder.customerName || 'Customer',
            email: incomingOrder.customerEmail || '',
            phone: incomingOrder.customerPhone || '',
            address: incomingOrder.shippingAddress?.address || ''
          }
        };
        orders.unshift(newOrder);
        added++;
        console.log(`✅ Synced New Order: ${newOrder.orderId}`);
        broadcastSSE('new-order', newOrder);
      }
    });

    writeData(ORDERS_FILE, orders);
    res.json({ success: true, added, updated, skipped, total: orders.length });
  } catch (error) {
    console.error('❌ Error syncing orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH Update Order Status (Galing sa Admin Panel: To Ship -> To Receive -> To Review -> Completed)
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
    console.log(`🔄 Order ${id} updated to status: ${orders[index].status}`);

    // Broadcast status change to SSE
    broadcastSSE('order-updated', orders[index]);

    res.json({ success: true, order: orders[index] });
  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE Order
app.delete('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const orders = readData(ORDERS_FILE);
    const filtered = orders.filter(o => o.orderId !== id);

    if (filtered.length === orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    writeData(ORDERS_FILE, filtered);

    // Tombstone: tandaan ang deleted ID para hindi na ito ma-resurrect ng /sync (localStorage ng store)
    const deletedIds = readDeletedIds();
    if (!deletedIds.includes(id)) deletedIds.push(id);
    writeDeletedIds(deletedIds);

    console.log(`🗑️ Order ${id} deleted`);
    broadcastSSE('order-deleted', { orderId: id });
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ REVIEWS ENDPOINTS ============
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

// ============ REAL-TIME SSE ENDPOINT ============
app.get('/api/orders/stream/public', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no'
  });

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);
  console.log(`🔌 SSE Client connected: ${clientId} (Total: ${sseClients.length})`);

  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', clientId })}\n\n`);

  const interval = setInterval(() => {
    res.write(`: ping\n\n`);
  }, 15000);

  req.on('close', () => {
    console.log(`🔌 SSE Client disconnected: ${clientId}`);
    clearInterval(interval);
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// ============ START SERVER ============
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ C-HUB Backend Server running on port ${PORT}`);
  console.log(`   📁 Data folder: ${DATA_DIR}`);
  console.log(`   📦 Orders: ${readData(ORDERS_FILE).length}`);
  console.log(`   📦 Products: ${readData(PRODUCTS_FILE).length}`);
  console.log(`   🔌 SSE stream: http://localhost:${PORT}/api/orders/stream/public`);
});