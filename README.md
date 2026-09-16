# QuickEcommerce --- AI-Powered Quick Commerce Platform

A full-stack, Blinkit-style quick-commerce application combining a React
storefront, Django REST API, a separately deployed FastAPI/LangGraph
shopping assistant, PostgreSQL, Supabase Storage, Stripe Checkout, and
map/geolocation functionality.

> **Deployment snapshot:** React frontend on Vercel; Django API and
> FastAPI AI service on Render; PostgreSQL and product/category image
> storage on Supabase. Some integrations remain under verification. See
> [Known Issues & Next Steps](#known-issues--next-steps).

## Contents

-   [Overview](#overview)
-   [Architecture](#architecture)
-   [Tech Stack](#tech-stack)
-   [Features](#features)
-   [Maps and Geolocation](#maps-and-geolocation)
-   [Order and Payment Flow](#order-and-payment-flow)
-   [AI Shopping Assistant](#ai-shopping-assistant)
-   [Database and Storage](#database-and-storage)
-   [Repository Structure](#repository-structure)
-   [Deployment](#deployment)
-   [Local Setup](#local-setup)
-   [Environment Variables](#environment-variables)
-   [API Documentation](#api-documentation)
-   [Security](#security)
-   [Known Issues & Next Steps](#known-issues--next-steps)

## Overview

QuickEcommerce is a multi-role e-commerce/quick-commerce project with a
customer storefront, account and order APIs, admin/rider areas,
inventory and delivery modules, map-based location functionality, and an
AI shopping chat.

Django owns core commerce data and APIs. The separate AI service calls
into Django for commerce-related data and actions.

## Architecture

``` text
React + Vite (Customer / Admin / Rider UI)
  ├── Leaflet.js + OpenStreetMap (interactive map)
  └── HTTPS / REST
          │
          ▼
    Django + DRF API ───────────── Stripe Checkout
          │                              │
          ▼                              ▼
  Supabase PostgreSQL              Stripe Webhook
          │
          └── Supabase Storage (product/category images)

React AI chat → FastAPI → LangGraph workflow/tools → Django REST API

Django geolocation logic → GeoPy → Nominatim
```

### Deployed services

  ----------------------------------------------------------------------------------------------------
  Component               Hosting                 URL
  ----------------------- ----------------------- ----------------------------------------------------
  Frontend                Vercel                  https://ai-powered-quick-ecommerce-ql4d.vercel.app

  Django API              Render                  https://ai-powered-quick-ecommerce.onrender.com

  FastAPI AI              Render                  https://quickai-ai.onrender.com

  Database                Supabase                Managed PostgreSQL

  Images                  Supabase Storage        Public `product-images` bucket
  ----------------------------------------------------------------------------------------------------

Render free services may spin down while idle and take time to wake.
Render's local filesystem is ephemeral and should not be used for
durable production media storage.

## Tech Stack

### Frontend

-   React
-   Vite
-   React Router
-   Zustand (state management)
-   Axios/API client
-   Leaflet.js (interactive map display)
-   OpenStreetMap (map tiles/data)

### Backend

-   Python
-   Django
-   Django REST Framework (DRF)
-   SimpleJWT (JWT authentication)
-   GeoPy (Python geocoding library)
-   Nominatim (OpenStreetMap-based geocoding service)

### AI service

-   FastAPI
-   Uvicorn
-   LangGraph
-   Groq model API

### Database, storage, and infrastructure

-   PostgreSQL hosted on Supabase
-   PostGIS for spatial/geographic database capabilities, if enabled in
    the deployed database
-   Supabase Storage for product/category images
-   `django-storages` with a custom S3-compatible storage backend
-   Stripe Checkout and webhook integration
-   Vercel, Render, and Supabase

## Features

### Customer experience

-   Product catalog and product details.
-   Product search/sorting UI and category browsing.
-   Deals/promotional pages.
-   Cart add/update/remove operations.
-   Address API and order creation/history/detail flows.
-   Profile retrieval and update.
-   Wallet and wallet-transaction endpoints exist in the account API.

### Accounts and roles

-   Custom Django user model based on `AbstractUser`.
-   Email-based authentication (`USERNAME_FIELD = "email"`), unique
    phone, and full name.
-   JWT access/refresh authentication.
-   Role-based users including customer, admin, and rider.
-   General profile serializer keeps role read-only; public signup
    should create customer accounts only.

### Operations

-   Django apps cover products/categories, orders, inventory, delivery,
    notifications, accounts, and AI integration.
-   Admin and rider frontend areas exist.
-   Admin-driven user/rider management requires end-to-end verification
    before assuming every UI action is fully wired.

## Maps and Geolocation

The map-related technologies are used for different responsibilities:

  -----------------------------------------------------------------------
  Technology              Layer                   Responsibility
  ----------------------- ----------------------- -----------------------
  Leaflet.js              Frontend                Renders interactive
                                                  maps, markers, and map
                                                  controls.

  OpenStreetMap (OSM)     Map data/tiles          Supplies map data and
                                                  tiles displayed through
                                                  Leaflet.

  GeoPy                   Backend                 Python geocoding
                                                  library used to work
                                                  with geocoding
                                                  providers.

  Nominatim               Geocoding service       Supports address
                                                  search/geocoding and
                                                  reverse geocoding using
                                                  OpenStreetMap data.

  PostgreSQL              Backend/database        Stores application
                                                  records, including
                                                  address/location
                                                  fields.

  PostGIS                 Database extension      Provides spatial data
                                                  types and spatial
                                                  queries if the
                                                  extension is installed
                                                  and used.
  -----------------------------------------------------------------------

Typical geolocation workflow:

1.  A user selects or enters a location in the frontend map/address UI.
2.  Leaflet displays the map and location marker using OpenStreetMap
    tiles.
3.  The backend can use GeoPy with Nominatim to convert between
    addresses and coordinates.
4.  Application location data is stored with the relevant
    address/order/rider records.
5.  If PostGIS is configured and used, it can support spatial queries
    such as distance or proximity calculations.

**Note:** PostgreSQL and PostGIS are not the same thing. Keep PostGIS
listed as an implemented technology only if the project actually enabled
and used the extension. Nominatim's public service has usage policies
and rate limits; check those before production-scale use.

## Order and Payment Flow

### Order creation

1.  Customer signs in and receives JWT tokens.
2.  Customer adds or updates cart items.
3.  Frontend submits the order-creation request to Django.
4.  Django creates the order and associated order items.
5.  Frontend initiates the selected payment flow.

### Stripe Checkout

1.  Frontend asks Django to create a payment record.
2.  Frontend requests a Stripe Checkout session for that payment.
3.  Django creates the session and returns a redirect URL.
4.  Customer completes payment on Stripe-hosted Checkout.
5.  Stripe redirects to the frontend success route with `session_id`.
6.  The success page uses that session ID to retrieve the related order.
7.  Stripe's signed webhook is intended to update payment/order status
    after `checkout.session.completed`.

**Payment state should be trusted from the verified webhook---not merely
from the browser redirect.** The success page should display the result,
not independently prove payment.

### API paths represented in the frontend API client

  --------------------------------------------------------------------------------------
  Purpose                             Method and path
  ----------------------------------- --------------------------------------------------
  Cart                                `GET /api/orders/cart/`

  Add item                            `POST /api/orders/cart/add/`

  Update item                         `PATCH /api/orders/cart/update/`

  Remove item                         `DELETE /api/orders/cart/remove/`

  List orders                         `GET /api/orders/order/`

  Create order                        `POST /api/orders/order/create/`

  Order detail                        `GET /api/orders/order/{id}/`

  Create payment                      `POST /api/orders/payment/create-payment/`

  Stripe Checkout                     `POST /api/orders/payment/{id}/stripe-checkout/`

  Order by Stripe session             `GET /api/orders/payment/session/{session_id}/`

  Addresses                           `GET /api/accounts/addresses/`
  --------------------------------------------------------------------------------------

Exact route prefixes depend on Django URL/router configuration; confirm
through the live API schema.

## AI Shopping Assistant

The AI chat is a separate FastAPI application.

``` text
React chat
  → FastAPI /chat
  → JWT/user context
  → LangGraph routing/workflow
  → product search, recommendation, cart and memory tools
  → Django REST API as needed
  → chat response
```

The frontend stores the JWT access token in `localStorage` under
`access`. The AI service configuration includes provider/model settings
and a Django backend base URL. AI availability depends on provider
credentials, quota, and backend availability; Groq rate limits have
previously affected chat requests.

## Database and Storage

-   Production relational database: Supabase PostgreSQL.
-   Django database settings are environment-driven.
-   Project models/features include users, products/categories, cart,
    orders/order items, payments, inventory, suppliers/customers,
    purchase invoices/items, delivery, and notifications. Refer to
    current models and migrations for the authoritative schema.
-   PostgreSQL `vector` extension has been enabled in the `extensions`
    schema:

``` sql
create extension if not exists vector with schema extensions;
```

### Supabase Storage

-   Public bucket: `product-images`.
-   Product and category image objects are organized in bucket folders.
-   Django's custom S3-compatible storage class returns public Supabase
    object URLs.
-   A product/category image update run reported 100 product records
    updated, 144 product images and 11 category images updated, with
    zero failed images. These counts describe that run, not a guarantee
    of current database totals.

## Repository Structure

``` text
AI-Powered-Quick-Ecommerce-/
├── accounts/          # Authentication, profiles, addresses, wallet
├── ai_engine/         # Django-side AI integration
├── delivery/          # Rider/delivery functionality
├── frontend/          # React + Vite application
├── inventory/         # Inventory functionality
├── main/              # Django project settings/shared utilities/storage
├── notifications/     # Notifications
├── orders/             # Cart, orders, payments, Stripe endpoints
├── pgvector/           # Vector-related integration
├── products/           # Products and categories
├── quickai_ai/         # Separate FastAPI + LangGraph service
├── media/              # Local media directory (not durable on ephemeral hosting)
├── manage.py
├── requirements.txt
└── db.sqlite3          # Local development artifact; production uses PostgreSQL
```

## Deployment

### Frontend --- Vercel

Set the Vercel project root to `frontend/` and configure:

``` env
VITE_API_BASE_URL=https://ai-powered-quick-ecommerce.onrender.com
VITE_AI_API_URL=https://quickai-ai.onrender.com
```

Vite variables are embedded at build time; redeploy after changing them.

### Django API --- Render

Deploy the Django project from the repository root. Configure Django,
database, storage, and Stripe variables in Render's environment
settings. Set `FRONTEND_URL` to the deployed Vercel origin so Stripe
redirects to the correct frontend.

### FastAPI AI --- Render

Deploy `quickai_ai/` as a separate service, using the correct working
directory and Uvicorn module path for the current layout.

Previously used local command:

``` bash
python -m uvicorn app.main:app --reload --port 8001
```

## Local Setup

### 1. Clone the repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd AI-Powered-Quick-Ecommerce-
```

### 2. Create a Python environment

Windows PowerShell:

``` powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:

``` bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install backend dependencies and migrate

``` bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Set required environment variables before starting Django.

### 4. Start the frontend

``` bash
cd frontend
npm install
npm run dev
```

Local `frontend/.env`:

``` env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_AI_API_URL=http://127.0.0.1:8001
```

### 5. Start the AI service

Install the AI service dependencies in its environment, configure its
variables, and run from the matching service directory:

``` bash
python -m uvicorn app.main:app --reload --port 8001
```

Check the current AI service dependency file and module path before
running.

## Environment Variables

Use `.env` files locally and deployment environment settings in hosting
dashboards. **Never commit real credentials.** These are known
variables; verify the current settings/code for any additional required
values.

### Django / Render

``` env
DJANGO_SECRET_KEY=replace-with-a-long-random-secret
DEBUG=False
ALLOWED_HOSTS=your-render-host.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app

DB_NAME=postgres
DB_USER=your-supabase-database-user
DB_PASSWORD=your-database-password
DB_HOST=your-supabase-pooler-host
DB_PORT=5432

SUPABASE_PUBLIC_STORAGE_URL=https://your-project.supabase.co/storage/v1/object/public/product-images

STRIPE_SECRET_KEY=replace-with-secret-key
STRIPE_WEBHOOK_SECRET=replace-with-webhook-signing-secret
```

`STRIPE_WEBHOOK_SECRET` must be the Stripe endpoint signing secret
(normally begins with `whsec_`), not the Stripe API secret key.

### FastAPI AI service

``` env
GROQ_API_KEY=replace-with-provider-key
MODEL_NAME=your-configured-model-name
TEMPERATURE=0.2
MAX_TOKENS=your-configured-token-limit
BACKEND_BASE_URL=https://ai-powered-quick-ecommerce.onrender.com
```

Additional variables may be required by the current AI service
configuration.

### React / Vite

``` env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_AI_API_URL=http://127.0.0.1:8001
```

Use the deployed service URLs for production builds.

## API Documentation

-   **Django Swagger docs:**
    https://ai-powered-quick-ecommerce.onrender.com/api/docs/

The API root may return 404 if no root route is configured; check
`/api/docs/` or a known endpoint to verify the service.

## Security

-   Keep database, Django, Stripe, Supabase, and AI-provider secrets out
    of source control and frontend bundles.
-   Never expose Supabase service-role credentials or Stripe secret keys
    in React.
-   Do not allow public signup to assign privileged roles.
-   Verify Stripe webhook signatures and use webhook-confirmed payment
    state.
-   Review permissive CORS settings and restrict allowed origins before
    production use.
-   Use durable storage for uploads; Render's local filesystem is
    ephemeral.
-   Follow Nominatim usage policies and avoid sending excessive
    geocoding requests.
-   Add/verify rate limits, permissions, validation, logging, and error
    handling before handling real customer traffic.

## Known Issues & Next Steps

These items were observed during development/deployment and should be
rechecked against the current code:

-   [ ] Ensure every Stripe success route uses `session_id` and the
    session-to-order lookup; remove legacy `payment_id` success flow.
-   [ ] Debug the deployed notifications list endpoint, which returned
    HTTP 500 during testing.
-   [ ] Verify Stripe webhook URL, `whsec_` signing secret, event
    delivery, and payment/order updates end-to-end.
-   [ ] Review order lifecycle so unpaid orders remain pending until
    payment is confirmed.
-   [ ] Review when inventory is decremented, especially for abandoned
    unpaid checkouts.
-   [ ] Confirm currency consistency between payment records, Stripe
    Checkout, and storefront display.
-   [ ] Finish and test admin user/rider management UI/API wiring.
-   [ ] Remove remaining hardcoded localhost API/image URLs.
-   [ ] Add/verify Vercel SPA rewrite for direct refresh of client-side
    routes such as `/ai-chat`.
-   [ ] Review CORS, `ALLOWED_HOSTS`, static files, and persistent media
    configuration.
-   [ ] Confirm whether PostGIS is installed and actively used; document
    only the implemented spatial features.
-   [ ] Handle AI provider quota/rate-limit errors gracefully; memory
    extraction previously contributed to Groq quota exhaustion.
-   [ ] Add automated tests for authentication, permissions, cart/order
    lifecycle, payment/webhook processing, geolocation, and AI tool
    integration.

------------------------------------------------------------------------

## Project Goal

Bring together a conventional commerce platform and a conversational AI
shopping assistant, supporting a customer-to-order-to-delivery workflow
with role-based operational dashboards and location-aware delivery
functionality.
