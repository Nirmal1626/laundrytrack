const express = require('express');
const router = express.Router();
const { orders, VALID_STATUSES } = require('../store');

// GET /api/dashboard
router.get('/', (req, res) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const ordersByStatus = VALID_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const garmentCounts = {};
  orders.forEach(o => {
    o.garments.forEach(g => {
      garmentCounts[g.type] = (garmentCounts[g.type] || 0) + g.quantity;
    });
  });

  const topGarment = Object.entries(garmentCounts).sort((a, b) => b[1] - a[1])[0] || null;

  res.json({
    totalOrders,
    totalRevenue,
    avgOrderValue,
    ordersByStatus,
    topGarment: topGarment ? { type: topGarment[0], count: topGarment[1] } : null,
    recentOrders,
  });
});

module.exports = router;
