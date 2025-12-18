# Strapi Content-Types Guide

This document describes the Content-Types you need to create in your Strapi backend.

---

## 1. Product (Collection Type)

**API ID:** `product`

### Fields:

| Field Name | Type | Required | Unique | Notes |
|------------|------|----------|--------|-------|
| `name` | Text (Short text) | ✅ Yes | ❌ No | Product name |
| `price` | Number (Decimal) | ✅ Yes | ❌ No | Product price |
| `category` | Text (Short text) | ❌ No | ❌ No | Product category (e.g., "Audio", "Electronics") |
| `image` | Media (Single media) | ❌ No | ❌ No | Product image |
| `description` | Rich text | ❌ No | ❌ No | Optional: Product description |

### Permissions:
- **Public (unauthenticated):**
  - ✅ `find` (get all products)
  - ✅ `findOne` (get single product)
- **Authenticated:**
  - ✅ `find`
  - ✅ `findOne`

---

## 2. Order (Collection Type)

**API ID:** `order`

### Fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `items` | JSON | ✅ Yes | Array of order items with product ID, quantity, price |
| `total` | Number (Decimal) | ✅ Yes | Total order amount |
| `status` | Enumeration | ✅ Yes | Options: `pending`, `processing`, `completed`, `cancelled` |
| `user` | Relation | ✅ Yes | Relation to User (many-to-one) |

### Relation Setup:
- **Order → User:** Many Orders to One User
  - In Order content-type: Add relation field named `user`
  - Type: "Relation to User (from: users-permissions)"
  - Relation type: "Many-to-One"

### Permissions:
- **Authenticated:**
  - ✅ `create` (create new order)
  - ✅ `find` (get own orders - you may need to add filter in controller)
  - ✅ `findOne` (get single order)

---

## 3. User (Built-in from users-permissions plugin)

Strapi comes with a built-in User content-type. You just need to enable authentication.

### Default Fields:
- `username`
- `email`
- `password` (hashed automatically)
- `confirmed`
- `blocked`

### Authentication Setup:
1. Go to **Settings → Users & Permissions plugin → Roles**
2. **Public role:** Enable `find` and `findOne` for Products
3. **Authenticated role:** Enable all permissions for Orders and Products

---

## Quick Setup Steps in Strapi Admin:

### Step 1: Create Product Content-Type
```
Content-Type Builder → Create new collection type
Name: Product
Add fields as listed above
Save
```

### Step 2: Create Order Content-Type
```
Content-Type Builder → Create new collection type
Name: Order
Add fields as listed above
Add relation to User
Save
```

### Step 3: Set Permissions
```
Settings → Users & Permissions plugin → Roles
→ Public: Enable Product (find, findOne)
→ Authenticated: Enable Product (find, findOne), Order (create, find, findOne)
Save
```

### Step 4: Add Sample Products
```
Content Manager → Product → Create new entry
Fill in: name, price, category, upload image
Publish
Repeat for 3-5 products
```

---

## Example Product Data:

```json
{
  "name": "Premium Wireless Headphones",
  "price": 299,
  "category": "Audio",
  "description": "High-quality wireless headphones with noise cancellation"
}
```

## Example Order Data (sent from frontend):

```json
{
  "items": [
    {
      "product": 1,
      "quantity": 2,
      "price": 299
    }
  ],
  "total": 598,
  "status": "pending"
}
```

---

## Environment Variables

Create a `.env` file in your frontend:

```env
VITE_API_URL=http://localhost:1337
```

For production, change to your deployed Strapi URL.

---

## Testing the Integration:

1. **Start Strapi:** `npm run develop` (in your Strapi project)
2. **Start Frontend:** `npm run dev` (in your React project)
3. **Create a user:** Register via Strapi admin or use the frontend login
4. **Add products:** Via Strapi admin panel
5. **Test:** Login → Browse products → Add to cart → Checkout

---

## Troubleshooting:

### CORS Issues:
If you get CORS errors, update Strapi's `config/middlewares.js`:

```javascript
module.exports = [
  // ... other middlewares
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:5173'], // Your Vite dev server
      credentials: true,
    },
  },
];
```

### Image URLs:
Images in Strapi are stored at: `http://localhost:1337/uploads/filename.jpg`

The frontend automatically prepends the API URL to image paths.
