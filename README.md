# Hand Embroidered Dresses — E-Commerce Boutique & Management System

> **Multan's Authentic Handcrafted Heritage & Luxury Bridal Store**  
> Complete full-stack production-ready e-commerce solution with Node.js/Express REST API and React.js (Vite + Tailwind CSS + Framer Motion) frontend.

---

## 🏛️ Business Overview

| Attribute | Details |
| :--- | :--- |
| **Business Name** | Hand Embroidered Dresses |
| **Store Category** | Handcrafted Clothing Store & Luxury Bridal Boutique |
| **Store Address** | Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar, Ghali Colony, near Firdouse Market, Inner City, Multan, 66000, Pakistan |
| **Phone / WhatsApp** | `03186229753` (International: `+92 318 6229753`) |
| **Official Email** | `info@handembroidered.pk` |
| **Currency** | Pakistani Rupee (`PKR` / `Rs.`) |
| **Market & Delivery** | Nationwide delivery across all Pakistani cities (Multan, Lahore, Karachi, Islamabad, Peshawar, Quetta, Faisalabad, Sialkot, etc.) |
| **Payment Options** | Cash on Delivery (COD), JazzCash, EasyPaisa, Bank Transfer (with payment slip upload) |

---

## 🔐 Pre-configured User Accounts

### 👑 Store Administrator
- **Email:** `admin@handembroidered.pk`
- **Password:** `Admin@123456`
- **Access Level:** Full access to `/admin` dashboard (Product Catalog, Orders & PDF Invoices, Customer Management, Coupons, Category Tree, Tailoring Requests, Reviews, Banners, Blogs, Store Settings).
- *Tip: On the `/login` page, click the "👑 Autofill Admin Demo" button for instant 1-click test credentials.*

### 🛍️ Customer Demo Account
- **Email:** `fatima.khan@example.com`
- **Password:** `Customer@123`
- **Access Level:** Storefront shopping, order history, wishlist, profile and saved delivery addresses.
- *Tip: On the `/login` page, click the "🛍️ Autofill Customer Demo" button.*

---

## 🛠️ Tech Stack & Architecture

### Backend (`/backend`)
- **Runtime & Framework:** Node.js (ES Modules) + Express.js
- **Database:** MongoDB via Mongoose (with automated connection error handling)
- **Authentication:** JWT (JSON Web Tokens) with HTTP-only tokens & password hashing via `bcryptjs`
- **File Uploads:** `multer` disk storage for payment receipts (`/uploads/payments`) and custom dress sketches (`/uploads/custom-designs`)
- **Email System:** `nodemailer` with HTML template generation for order invoices and custom tailoring status updates
- **Invoicing:** Dynamic printable HTML invoice and packing slip generation (`/api/orders/:id/invoice`)
- **Security:** `helmet`, `cors`, `express-rate-limit`

### Frontend (`/frontend`)
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS with custom royal boutique color palette:
  - **Maroon:** `#5C061D` (Deep Regal Maroon)
  - **Gold:** `#C5A059` (Warm Antique Gold)
  - **Ivory:** `#FDFBF7` (Soft Pearl Cream)
  - **Emerald:** `#0B4636` (Multani Jade Accent)
  - **Charcoal:** `#1E1E1E` (Typography)
- **Typography:** *Cormorant Garamond*, *Playfair Display*, *Poppins*, and *Noto Nastaliq Urdu*
- **Icons:** `lucide-react`
- **Animations:** `framer-motion` (smooth transitions, modal popups, image zoom)
- **State Management:** `zustand` with `localStorage` persistence:
  - `useCartStore`: Cart items, quantity controls, PKR delivery fee calculation (Free delivery over Rs. 10,000)
  - `useAuthStore`: User profile, JWT token, admin authorization
  - `useWishlistStore`: Wishlist toggles and persistence
  - `useLanguageStore`: Dynamic English / Urdu (اردو) toggle with automatic RTL layout switching

---

## 📂 Project Directory Structure

```
dress-cloth/
├── package.json               # Root scripts to orchestrate backend and frontend
├── README.md                  # Complete documentation and setup manual
├── backend/
│   ├── package.json           # Backend dependencies and scripts
│   ├── .env                   # Backend environment configuration
│   ├── .env.example           # Example environment variables
│   ├── uploads/               # Stored payment proofs and dress design attachments
│   └── src/
│       ├── server.js          # Express application initialization & middleware
│       ├── config/
│       │   ├── db.js          # MongoDB connection handler
│       │   └── constants.js   # Pakistani cities, order states, embroidery crafts
│       ├── models/            # 12 Mongoose schemas
│       │   ├── User.js, Product.js, Category.js, Order.js, Cart.js, Wishlist.js,
│       │   ├── Review.js, Coupon.js, CustomOrder.js, Message.js, BlogPost.js,
│       │   └── Banner.js, Settings.js
│       ├── middleware/        # auth.js, error.js, upload.js
│       ├── services/          # emailService.js, invoiceService.js
│       ├── controllers/       # 13 REST API controllers
│       ├── routes/            # 13 Express route endpoints
│       └── seed/              # seedData.js (42+ authentic dresses) & seeder.js
└── frontend/
    ├── package.json           # Frontend dependencies
    ├── vite.config.js         # Vite configuration with API proxy
    ├── tailwind.config.js     # Royal Pakistani boutique color system
    ├── index.html             # SEO meta tags and Google fonts
    └── src/
        ├── main.jsx           # React DOM root entry
        ├── App.jsx            # React Router v6 route hierarchy & guards
        ├── index.css          # Tailwind directives & Urdu font styling
        ├── services/api.js    # Axios client with JWT interceptor
        ├── store/             # Zustand stores (Auth, Cart, Wishlist, Language)
        ├── utils/             # formatCurrency, pakistaniLocations, constants, translations
        ├── components/
        │   ├── common/        # Header, Footer, ProductCard, QuickViewModal, SizeGuideModal,
        │   │                  # Breadcrumbs, Pagination, WhatsAppFloating, SeoSchema, etc.
        │   ├── home/          # HeroSlider, FeaturedCategories, EmbroideryGrid, LookbookGallery,
        │   │                  # ProductStorySection, ArtisanCraftSection, Testimonials, Newsletter
        │   └── layout/        # Layout.jsx (Storefront) & AdminLayout.jsx (Admin Portal)
        └── pages/
            ├── Home.jsx, Shop.jsx, CategoryPage.jsx, ProductDetail.jsx
            ├── Cart.jsx, Checkout.jsx, OrderConfirmation.jsx, OrderTracking.jsx
            ├── Wishlist.jsx, CustomOrder.jsx, AboutUs.jsx, ContactUs.jsx
            ├── Blog.jsx, BlogPostDetail.jsx, FAQ.jsx, Policies.jsx, NotFound.jsx
            ├── Auth/          # Login.jsx, Register.jsx, ForgotPassword.jsx
            ├── Account/       # Profile.jsx, Orders.jsx, Addresses.jsx
            └── Admin/         # AdminDashboard, AdminProducts, AdminProductForm, AdminOrders,
                               # AdminOrderDetail, AdminCategories, AdminCustomers, AdminCoupons,
                               # AdminReviews, AdminCustomOrders, AdminMessages, AdminBlogs,
                               # AdminBanners, AdminSettings
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0 or higher recommended)
- MongoDB installed locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI

### 1. Install Dependencies
Run the install command from the project root:
```bash
# Install root, backend, and frontend packages
npm run install:all
```
*Alternatively, install individually:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables
Verify or edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/hand_embroidered_dresses
JWT_SECRET=super_secret_jwt_multani_handcrafted_token_key_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 3. Seed the Database
Populate 42+ luxury Pakistani hand-embroidered dresses, 8 categories, 4 discount coupons, hero banners, blog posts, store settings, and default Admin/Customer accounts:
```bash
npm run seed
```
*(Or inside `backend`: `npm run seed`)*

### 4. Start the Application
Run both backend and frontend concurrently:
```bash
npm run dev
```

Or start them in separate terminals:
- **Terminal 1 (Backend API):**
  ```bash
  cd backend
  npm run dev
  ```
  *Server starts on `http://localhost:5000`*

- **Terminal 2 (Frontend Client):**
  ```bash
  cd frontend
  npm run dev
  ```
  *Vite starts on `http://localhost:5173`*

Open **`http://localhost:5173`** in your browser!

---

## 🛍️ Storefront Highlights & Features

1. **42+ Authentic Pakistani Catalog Items:**
   - **Bridal Lehengas & Ghararas:** Pure Raw Silk Zardozi, Multani Aari Bridal, Banarsi Jamawar Gota.
   - **Party Wear & Formal:** Pure Chiffon Resham, Organza Mukaish Angrakha, Velvet Kaftan.
   - **Chikankari & Daily Lawn:** Multani hand-done Chikankari kurtis, Shadow work, Kashmiri Phulkari.
   - **Shawls & Dupattas:** Kashmiri Tilla Velvet Shawls, Multani Phulkari Chadar, Hand-painted Organza.
   - **Embroidered Maxis & Pishwas:** Hand-embellished Pakistani flared maxis, kalidar pishwas, and Anarkali gowns.
2. **Pakistani Checkout Flow:**
   - Cash on Delivery (COD) with automated delivery fee calculation.
   - Direct JazzCash / EasyPaisa / Bank Account details displayed with slip upload field.
   - Dropdown of all 8 Pakistani provinces and major cities.
3. **Bespoke Custom Tailoring Request (`/custom-order`):**
   - Customers submit custom dress specifications, embroidery choice, fabric preferences, full custom body measurements (Bust, Waist, Hip, Shoulder, Kurti Length, Lehenga Length), and photo sketches.
4. **Interactive Size Guide & Quick View Modal:**
   - Accurate standard measurements in inches and cm for XS through XXL, plus unstitched fabric guidelines.
5. **Urdu / English Language & RTL Mode:**
   - 1-click header switcher dynamically toggles between English and Urdu with authentic Noto Nastaliq Urdu typography and right-to-left layout adjustments.
6. **Direct WhatsApp Shopping Integration:**
   - Floating WhatsApp button pre-populates helpful inquiries to `+92 318 6229753`.
   - Every product page has a "Buy on WhatsApp" button including the product title, SKU, and direct link.

---

## 📊 Admin Dashboard Features (`/admin`)

- **Dashboard:** Revenue stats (in PKR), pending orders count, active customers, catalog size, monthly sales chart, and recent orders.
- **Product Catalog:** Create, edit, and delete dresses; image URLs management, color hex codes, embroidery type tags, fabric filters, sale price badge, and stock tracking.
- **Orders Management:** Update order statuses (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), view payment slips, tracking numbers, and 1-click printable PDF invoices.
- **Custom Tailoring Orders:** Review bespoke tailoring requests, download design images, update status (`Under Review`, `Approved`, `In Crafting`, `Completed`), and quote prices.
- **Discount Coupons:** Generate promo codes (e.g. `MULTAN10`, `BRIDAL20`, `EIDMUBARAK`), minimum purchase limits, and expiry dates.
- **Category Manager:** Manage categories, slug names, and hero image links.
- **Customer Inbox:** View contact form messages and reply directly via email or WhatsApp.
- **Heritage Blog & Sliders:** Manage blog articles on Multani embroidery history and customize homepage banner slides.
- **Store Settings:** Update phone numbers, physical address, free delivery thresholds, and social media handles.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new customer account | No |
| `POST` | `/api/auth/login` | Authenticate customer or admin | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update personal details / password | Yes |
| `GET` | `/api/products` | Query products (search, category, fabric, craft, sort, page) | No |
| `GET` | `/api/products/:slug` | Get single product by slug | No |
| `POST` | `/api/products` | Create new dress | Admin |
| `PUT` | `/api/products/:id` | Update dress details or stock | Admin |
| `DELETE` | `/api/products/:id` | Delete dress from catalog | Admin |
| `GET` | `/api/categories` | List all boutique categories | No |
| `POST` | `/api/orders` | Place new order (COD / Online) | No / Optional |
| `POST` | `/api/orders/:id/payment-proof` | Upload JazzCash/Bank transfer slip | No |
| `GET` | `/api/orders/my-orders` | Fetch current user's order history | Yes |
| `POST` | `/api/orders/track` | Track order by order number + phone | No |
| `GET` | `/api/orders/:id/invoice` | Printable HTML invoice & packing slip | No |
| `GET` | `/api/orders/admin/all` | Paginated admin order list with filters | Admin |
| `PUT` | `/api/orders/admin/:id/status` | Update order status and courier info | Admin |
| `POST` | `/api/custom-orders` | Submit bespoke tailoring order | No |
| `GET` | `/api/custom-orders` | List bespoke orders | Admin |
| `POST` | `/api/coupons/validate` | Check and apply promo code | No |
| `POST` | `/api/messages` | Send message from Contact Us form | No |
| `GET` | `/api/settings` | Get store contact and shipping configs | No |

---

## 🚢 Deployment Guide

### 1. Frontend (Vercel / Netlify)
1. Push this repository to GitHub.
2. In Vercel, set root directory to `frontend`.
3. Set build command: `npm run build` and output directory: `dist`.
4. Add environment variable:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. `https://your-api.onrender.com/api`).

### 2. Backend (Render / Railway / VPS)
1. In Render, create a Web Service and set root directory to `backend`.
2. Build command: `npm install` and start command: `npm start`.
3. Configure environment variables in Render:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/hand_embroidered_dresses?retryWrites=true&w=majority`
   - `JWT_SECRET`: A secure 64-character secret
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://handembroidered.vercel.app`)

---

## 📜 License & Copyright

© 2026 **Hand Embroidered Dresses**. All Rights Reserved.  
*Bata Wali, Hussain Agahi Main Chowk Bazar, Ghali Colony, near Firdouse Market, Inner City, Multan, Pakistan.*
