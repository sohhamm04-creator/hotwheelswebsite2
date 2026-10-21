# Hot Wheels Miniature Garage — Full-stack Vercel project

This is a continuation of the uploaded single-file storefront. It keeps the dark racing look, category filters, search, wishlist, cart drawer and INR prices, and adds Vercel serverless backend endpoints.

## What's included

- Responsive storefront (`index.html`)
- Product API: `GET /api/products`
- Newsletter API: `POST /api/newsletter`
- Order-request API: `POST /api/orders`
- Cart and wishlist persist in the visitor's browser using `localStorage`
- Supabase database schema for saving newsletter subscribers and order requests
- Local miniature-car image assets under `public/images/`

## Important image note

The included car visuals are miniature die-cast/toy-style illustrative crops, not verified official product photographs of specific Mattel Hot Wheels SKU/packaging. Before selling products, replace these with your own licensed photos or photos you have permission to use. This is an independent fan-style demo; it is not an official Mattel/Hot Wheels store.

## Run locally

1. Install Node.js 18 or newer.
2. Install Vercel CLI: `npm install -g vercel`
3. Open this folder in a terminal.
4. Run `vercel dev` and follow the prompts.
5. Open the local URL printed by Vercel.

`index.html` can be previewed directly for the frontend only, but API endpoints require `vercel dev` or deployment.

## Connect the backend database (Supabase)

The product catalogue comes from `products.json`. Newsletter signups and order requests are saved in Supabase.

1. Create a project at https://supabase.com/.
2. Open **SQL Editor** and run the contents of `supabase-schema.sql`.
3. In Supabase project settings, copy the project URL and the **service_role** secret key. Never expose this key in browser code or commit it to Git.
4. For local testing, create a `.env.local` file in the project root (do not commit it):

   ```env
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_SECRET
   ```

5. Restart `vercel dev`.
6. Test:
   - Visit `/api/products` — should return product JSON.
   - Subscribe with the newsletter form — check `newsletter_subscribers`.
   - Add a car to cart, submit the checkout form — check `orders`.

The checkout is an **order request only**. It does not take payment, calculate shipping/tax, reserve stock, or send confirmation emails. Add a payment provider (for example, Stripe or a supported Indian payment gateway) and proper order fulfilment before using it as a real store.

## Deploy on Vercel

### Method A — GitHub import (recommended)

1. Unzip this project.
2. Create a GitHub repository and upload all files/folders from this project. Include `index.html`, `products.json`, `api/`, `public/`, `package.json`, `vercel.json`, and `supabase-schema.sql`.
3. Go to https://vercel.com/ and sign in.
4. Click **Add New → Project**, then **Import** the GitHub repository.
5. Framework preset: choose **Other** if asked. No build command is required; leave the output directory blank/default. Vercel will serve `index.html` and deploy the `/api` functions.
6. In the Vercel project, open **Settings → Environment Variables** and add:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service-role secret
   Select Production (and Preview/Development if needed).
7. Click **Deploy**. If you add or change environment variables after deployment, redeploy.
8. Open the generated `https://your-project.vercel.app` URL and test product loading, newsletter, cart and order request.

### Method B — Vercel CLI

1. Install Node.js 18+ and run `npm install -g vercel`.
2. Open a terminal in this project folder.
3. Run `vercel login`.
4. Run `vercel` and answer the setup prompts.
5. Add environment variables in the Vercel dashboard under **Settings → Environment Variables**.
6. Run `vercel --prod` to publish production.

## Before public launch

- Replace illustrative images with genuine licensed Hot Wheels miniature product photography.
- Configure payment, shipping, taxes, order emails, inventory, returns and privacy policy.
- Add rate limiting / bot protection to public form endpoints.
- Do not commit `.env.local` or service-role keys.
- The prices, product data and stock counts are demo catalogue data, not live inventory.

## Project structure

```text
hotwheels-fullstack/
├── api/
│   ├── products.js
│   ├── newsletter.js
│   └── orders.js
├── public/
│   └── images/
├── index.html
├── products.json
├── package.json
├── vercel.json
├── supabase-schema.sql
├── .gitignore
└── SETUP.md
```
