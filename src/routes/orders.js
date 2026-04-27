const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const {
  orders, PRICE_CATALOG, VALID_STATUSES,
  generateOrderId, calculateTotal, estimateDelivery
} = require('../store');

// POST /api/orders — Create a new order
router.post('/', (req, res) => {
  const { customerName, phone, garments } = req.body;

  // Validation
  if (!customerName || !phone || !garments || !Array.isArray(garments) || garments.length === 0) {
    return res.status(400).json({
      error: 'customerName, phone, and at least one garment are required.'
    });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone must be a 10-digit number.' });
  }

  for (const g of garments) {
    if (!g.type || !g.quantity || g.quantity < 1) {
      return res.status(400).json({ error: `Invalid garment entry: ${JSON.stringify(g)}` });
    }
  }

  // Enrich garments with pricing
  const enrichedGarments = garments.map(g => {
    const pricePerItem = g.pricePerItem ?? PRICE_CATALOG[g.type] ?? 0;
    return {
      type: g.type,
      quantity: g.quantity,
      pricePerItem,
      subtotal: pricePerItem * g.quantity
    };
  });

  const now = new Date().toISOString();
  const order = {
    id: generateOrderId(),
    customerName: customerName.trim(),
    phone: phone.trim(),
    garments: enrichedGarments,
    totalAmount: calculateTotal(enrichedGarments),
    status: 'RECEIVED',
    createdAt: now,
    updatedAt: now,
    estimatedDelivery: estimateDelivery(now),
    statusHistory: [{ status: 'RECEIVED', timestamp: now }]
  };

  orders.push(order);
  res.status(201).json(order);
});

// GET /api/orders — List all orders with optional filters
router.get('/', (req, res) => {
  const { status, name, phone, garmentType } = req.query;

  let result = [...orders];

  if (status) {
    const s = status.toUpperCase();
    if (!VALID_STATUSES.includes(s)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    result = result.filter(o => o.status === s);
  }

  if (name) {
    result = result.filter(o => o.customerName.toLowerCase().includes(name.toLowerCase()));
  }

  if (phone) {
    result = result.filter(o => o.phone.includes(phone));
  }

  if (garmentType) {
    result = result.filter(o =>
      o.garments.some(g => g.type.toLowerCase().includes(garmentType.toLowerCase()))
    );
  }

  res.json({ count: result.length, orders: result });
});

// GET /api/orders/:id — Get a single order
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: `Order ${req.params.id} not found.` });
  res.json(order);
});

// PATCH /api/orders/:id/status — Update order status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: 'status field is required.' });

  const s = status.toUpperCase();
  if (!VALID_STATUSES.includes(s)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: `Order ${req.params.id} not found.` });

  const now = new Date().toISOString();
  order.status = s;
  order.updatedAt = now;
  order.statusHistory.push({ status: s, timestamp: now });

  res.json(order);
});

// GET /api/orders/catalog/prices — Get price catalog
router.get('/catalog/prices', (req, res) => {
  res.json(PRICE_CATALOG);
});

module.exports = router;
