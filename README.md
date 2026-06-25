# Food and Drink Backend

## Run

```bash
npm install
npm start
```

## Main APIs

- `GET /`
- `GET /health`
- `GET /health/db`
- `GET /routes`
- `GET /api/users`
- `GET /api/customers`
- `GET /api/customers/:id`
- `POST /api/customers`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/carts`
- `GET /api/favorites`
- `GET /api/orders`
- `GET /api/reviews`
- `GET /api/admin/dashboard`

## Generic Table APIs

- `GET /api/tables`
- `GET /api/tables/:table`
- `GET /api/tables/:table/:id`
- `POST /api/tables/:table`
- `PUT /api/tables/:table/:id`
- `PATCH /api/tables/:table/:id`
- `DELETE /api/tables/:table/:id`

Supported tables:

- `banner_promos`
- `carts`
- `categories`
- `customers`
- `favorites`
- `order_items`
- `orders`
- `products`
- `reviews`
- `users`

Examples:

- `GET /api/tables/customers`
- `GET /api/tables/products`
- `GET /api/tables/orders`
