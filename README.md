# 🧺 LaundryTrack — Mini Laundry Order Management System

A lightweight, AI-assisted order management system for a dry cleaning store. Built in Node.js + Express with an in-memory store and a fully functional React-style frontend.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+ 
- npm

### Install & Run

```bash
git clone <repo-url>
cd laundrytrack
npm install
npm start
```

The server starts at **http://localhost:3000**

- **Frontend UI** → http://localhost:3000
- **API Base** → http://localhost:3000/api

---

## ✅ Features Implemented

### Core (All Required Features)
| Feature | Status |
|---|---|
| Create Order (name, phone, garments, qty, price) | ✅ |
| Auto-generated Order ID (ORD-0001, ORD-0002…) | ✅ |
| Auto-calculated total bill | ✅ |
| Order statuses: RECEIVED → PROCESSING → READY → DELIVERED | ✅ |
| Update order status via PATCH | ✅ |
| Status history with timestamps | ✅ |
| List all orders | ✅ |
| Filter by status | ✅ |
| Filter by customer name | ✅ |
| Filter by phone number | ✅ |
| Dashboard: total orders, revenue, orders per status | ✅ |

### Bonus Features
| Feature | Status |
|---|---|
| Simple frontend (dark UI, single-page app) | ✅ |
| Estimated delivery date (auto, +2 days) | ✅ |
| Filter by garment type | ✅ |
| Price catalog endpoint | ✅ |
| Top garment stat on dashboard | ✅ |
| Average order value | ✅ |
| Input validation with meaningful errors | ✅ |

---

## 📡 API Reference

### Create Order
```
POST /api/orders
Body: { customerName, phone, garments: [{ type, quantity }] }
Response 201: { id, totalAmount, status: "RECEIVED", estimatedDelivery, ... }
```

### List Orders (with filters)
```
GET /api/orders?status=READY&name=Priya&phone=9876&garmentType=Shirt
Response: { count, orders: [...] }
```

### Get Single Order
```
GET /api/orders/:id
Response: full order object with statusHistory
```

### Update Status
```
PATCH /api/orders/:id/status
Body: { status: "PROCESSING" }
Response: updated order object
```

### Dashboard
```
GET /api/dashboard
Response: { totalOrders, totalRevenue, avgOrderValue, ordersByStatus, topGarment, recentOrders }
```

### Price Catalog
```
GET /api/orders/catalog/prices
Response: { Shirt: 30, Pants: 40, Saree: 80, ... }
```

---

## 🤖 AI Usage Report

### Tools Used
- **Claude (Anthropic)** — Primary AI tool used throughout development

### Where AI Helped

**1. Project scaffold**
> Prompt: *"Create a Node.js Express REST API for a laundry order management system with in-memory storage. Include routes for creating orders, updating status (RECEIVED/PROCESSING/READY/DELIVERED), listing/filtering orders, and a dashboard endpoint."*

AI generated the complete server.js, routes structure, and store.js boilerplate in one shot. The overall architecture (separate store module, routes folder) was AI-suggested and I kept it because it's clean.

**2. Billing logic**
> Prompt: *"Write a calculateTotal function that takes an array of garments with type, quantity, and optional pricePerItem, and falls back to a price catalog if pricePerItem is missing."*

AI nailed this on first try. Used the `??` nullish coalescing operator correctly.

**3. Frontend UI**
> Prompt: *"Build a dark-themed single-page HTML app for this laundry API. Sidebar nav, dashboard with stat cards and status bars, orders table with filters, create order modal with dynamic garment rows, and order detail modal with status update."*

AI produced a solid HTML/CSS/JS structure. I then heavily customized the design — replaced the generic color scheme with the yellow accent + dark industrial aesthetic, rewrote the typography system using Syne + DM Mono, and added the animated status bars.

**4. Filter query params**
> Prompt: *"Add query parameter filtering to GET /api/orders supporting status, customer name (partial), phone (partial), and garment type (searches inside garments array)."*

AI generated this correctly, including the `.some()` call for garment-type searching.

---

### What AI Got Wrong

| Issue | Fix |
|---|---|
| Used `app.get('*', ...)` wildcard — incompatible with Express 5's path-to-regexp | Changed to `app.get('/{*path}', ...)` |
| Frontend used `PageNumber` from docx (unrelated doc generation bug) | N/A — separate script |
| AI initially put all routes in server.js (monolithic) | Refactored into routes/ folder |
| AI forgot to add `statusHistory` array to track timeline of changes | Added manually to store + PATCH handler |
| Estimated delivery date was not in the initial AI output | Added `estimateDelivery()` helper manually |

---

### What I Improved Over AI Output

1. **Status history tracking** — AI's initial version only stored the current status. I added `statusHistory: []` so the detail modal can show a full timeline.
2. **Frontend design** — AI's default UI was generic purple-on-white. Completely restyled with a dark industrial aesthetic, custom fonts, animated progress bars, and toast notifications.
3. **Price catalog as an API endpoint** — AI hardcoded prices only in the backend. I exposed `/api/orders/catalog/prices` so the frontend can dynamically populate dropdowns.
4. **Input validation** — AI generated basic presence checks. I added phone format validation (`/^\d{10}$/`) and per-garment validation.
5. **Average order value and top garment** — These were not in the AI's dashboard output. Added manually.
6. **Estimated delivery** — Auto-set to createdAt + 2 days, stored on the order object.

---

## ⚖️ Tradeoffs

### What Was Skipped
- **Database persistence** — In-memory only; data resets on restart. MongoDB would be the next step.
- **Authentication** — No auth. In production, even a simple JWT or API key header would be needed.
- **Pagination** — Orders list returns all results. For large datasets, cursor-based pagination is needed.
- **Unit tests** — No test suite. Would use Jest + supertest.

### What I'd Improve With More Time
- Add MongoDB with Mongoose for persistence
- Add basic JWT auth with a `/login` endpoint
- Pagination on GET /api/orders
- Deploy to Railway or Render with a public URL
- Add real-time order status updates via WebSocket
- Add print/invoice generation per order

---

## 🗂 Project Structure

```
laundrytrack/
├── src/
│   ├── server.js        # Express app setup
│   ├── store.js         # In-memory store + price catalog
│   └── routes/
│       ├── orders.js    # CRUD + filter routes
│       └── dashboard.js # Dashboard stats route
├── public/
│   └── index.html       # Full frontend SPA
├── package.json
└── README.md
```
