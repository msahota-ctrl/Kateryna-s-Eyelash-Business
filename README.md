# Kateryna's Laser & Lash Salon — Eyelash Booking App

A production-ready eyelash booking web app built with Next.js 14, TypeScript, Tailwind CSS, Stripe Checkout, and SQLite.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (rose-gold theme, Google Fonts)
- **Payments**: Stripe Checkout (hosted payment page)
- **Database**: SQLite via `better-sqlite3`

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | Your app's URL (e.g. `http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | From [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard → Webhooks |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Set up Stripe webhooks (local development)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook signing secret it shows and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

## Pages

| Route | Description |
|---|---|
| `/` | Booking wizard (multi-step) |
| `/success` | Booking confirmation page |
| `/admin` | Admin dashboard (password: `kateryna2024`) |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/checkout` | POST | Creates a Stripe Checkout session |
| `/api/webhook` | POST | Stripe webhook — saves confirmed bookings |
| `/api/bookings/slots` | GET | Returns booked slots for a date (`?date=YYYY-MM-DD`) |
| `/api/admin/bookings` | GET | Returns all bookings (requires `x-admin-password` header) |

## Database

SQLite database is stored at `data/bookings.db` (auto-created on first run).

Table: `bookings`

| Column | Type | Description |
|---|---|---|
| `id` | INTEGER | Auto-increment primary key |
| `stripe_session_id` | TEXT | Stripe checkout session ID |
| `service_name` | TEXT | Name of service booked |
| `service_price` | INTEGER | Price in dollars |
| `appointment_date` | TEXT | Date (YYYY-MM-DD) |
| `appointment_time` | TEXT | Time (HH:00) |
| `client_name` | TEXT | Full name |
| `client_email` | TEXT | Email address |
| `client_phone` | TEXT | Phone number |
| `status` | TEXT | `pending` or `confirmed` |
| `created_at` | TEXT | Timestamp |

## Deployment

### Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Add your production URL as a Stripe webhook endpoint: `https://yourdomain.com/api/webhook`
5. Add the webhook secret to Vercel environment variables

**Note**: Vercel's serverless functions don't persist files, so for production you should migrate to a hosted database (e.g., PlanetScale, Supabase, or Turso for SQLite-compatible).

### Self-hosted (Node.js)

```bash
npm run build
npm start
```

The SQLite database will persist in the `data/` directory.
