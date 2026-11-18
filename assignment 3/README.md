# Inventory and Data Management System

Web Dev III - Assignment 3 (Unit 3)

**Submitted by:** Aashit Rai  
**Roll No:** 2501350089  
**Course:** B.Tech CSE (FSD)  
**Class:** Sem 3, Section B  

---

This is a REST API backend for managing the products of a store or warehouse. You can add products, update them, change the stock when items are sold or restocked, search and filter the list, and get reports like low-stock items and a category-wise summary. All data is stored in MongoDB.

## Tech used

- Node.js
- Express.js
- MongoDB with Mongoose
- dotenv

## Folder structure

```
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   └── productController.js   # logic for every route
├── middleware/
│   ├── errorHandler.js        # 404 + central error handler
│   └── validate.js            # id check and stock change check
├── models/
│   └── Product.js             # product schema with validation
├── routes/
│   └── productRoutes.js
├── .env.example
├── package.json
└── server.js
```

## How to run

1. Install the packages

```bash
npm install
```

2. Make a `.env` file in the root folder (you can copy `.env.example`)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/inventory_db
```

3. Make sure MongoDB is running, then start the server

```bash
npm start
```

The server runs on `http://localhost:5000`. You can test the routes using Postman.

## Product fields

| Field        | Type   | Rules                                             |
| ------------ | ------ | ------------------------------------------------- |
| name         | String | required, 2 to 100 characters                     |
| sku          | String | required, unique, saved in uppercase              |
| category     | String | required                                          |
| price        | Number | required, cannot be negative                      |
| quantity     | Number | whole number, cannot be negative, default 0       |
| reorderLevel | Number | whole number, cannot be negative, default 10      |
| supplier     | String | optional                                          |

`createdAt` and `updatedAt` are added automatically. Every product also comes back with a `stockValue` field, which is just `price * quantity`.

## API endpoints

| Method | Endpoint                     | What it does                          |
| ------ | ---------------------------- | ------------------------------------- |
| POST   | `/api/products`              | Add a new product                     |
| GET    | `/api/products`              | Get all products (filter, sort, pages)|
| GET    | `/api/products/:id`          | Get one product                       |
| PUT    | `/api/products/:id`          | Update product details                |
| PATCH  | `/api/products/:id/stock`    | Increase or decrease stock            |
| DELETE | `/api/products/:id`          | Delete a product                      |
| GET    | `/api/products/low-stock`    | Products at or below reorder level    |
| GET    | `/api/products/summary`      | Category-wise inventory summary       |

### Filtering, sorting and pagination

`GET /api/products` takes these query params:

- `category` - exact category, like `Electronics`
- `supplier` - exact supplier name
- `search` - searches in the product name (not case sensitive)
- `minPrice`, `maxPrice` - price range
- `inStock=true` - only products with quantity more than 0
- `sort` - field name, put `-` in front for descending. More than one field can be given with commas, like `sort=category,-price`. Default is newest first.
- `page` and `limit` - default is page 1 with 10 products

Example:

```
GET /api/products?category=Electronics&minPrice=1000&sort=-price&page=1&limit=5
```

Response looks like this:

```json
{
  "total": 12,
  "page": 1,
  "totalPages": 2,
  "count": 10,
  "products": [ ... ]
}
```

### Stock update

Send the amount to add or remove in `change`. Positive number means restock, negative means a sale.

```json
{ "change": 10 }
```

If a sale asks for more than what is in stock, the API returns `400` and the quantity is not changed, so stock never goes below zero.

### Reports

- **Low stock** - returns all products where `quantity <= reorderLevel`, lowest quantity first.
- **Summary** - uses an aggregation pipeline to group products by category and gives `totalItems`, `totalQuantity`, `totalStockValue` and `avgPrice` for each one, sorted by stock value.

## Error handling

All errors go to one error handler in `middleware/errorHandler.js` and come back as `{ "message": "..." }`.

- `400` - validation failed, invalid id, wrong data type or bad JSON
- `404` - product or route not found
- `409` - SKU already exists
- `500` - anything else
