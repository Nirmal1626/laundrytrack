// In-memory storage
const orders = [];

// Price catalog (₹)
const PRICE_CATALOG = {
  'Shirt':   30,
  'Pants':   40,
  'Saree':   80,
  'Jacket': 120,
  'Kurta':   50,
  'Suit':   200,
  'Dupatta': 25,
  'Blanket': 150,
  'Bedsheet': 60,
  'Towel':   20,
};

const VALID_STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

let orderCounter = 1;

function generateOrderId() {
  return `ORD-${String(orderCounter++).padStart(4, '0')}`;
}

function calculateTotal(garments) {
  return garments.reduce((sum, g) => {
    const price = g.pricePerItem ?? PRICE_CATALOG[g.type] ?? 0;
    return sum + price * g.quantity;
  }, 0);
}

function estimateDelivery(createdAt) {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + 2); // 2-day turnaround
  return d.toISOString();
}

module.exports = { orders, PRICE_CATALOG, VALID_STATUSES, generateOrderId, calculateTotal, estimateDelivery };
