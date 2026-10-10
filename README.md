# 🛒 বাজার দর — BazarDor

**বাজার দর** is a responsive Next.js web application for checking current prices of essential products in Bangladesh. It shows product prices, percentage changes, category-based lists, market-wise details and user authentication in one place.

## Technologies

- Next.js App Router
- TypeScript
- Tailwind CSS + DaisyUI
- Better Auth
- PostgreSQL
- React Hot Toast
- REST API

## Key Features

1. Responsive home page with price ticker and product sections.
2. Category pages with numeric price sorting.
3. Protected product detail pages with market-wise price tables.
4. Better Auth email/password + Google/GitHub social login support.
5. User profile and profile-name update feature.
6. Loading skeletons, toast messages and custom 404 page.
7. Vercel-friendly dynamic App Router routes.

## API

Primary API: `https://api.api-store.workers.dev/api/bazardor`

Alternative API: `https://api.abcz.workers.dev/api/bazardor`

## Local Setup

```bash
npm install
cp .env.example .env.local
```

Add your PostgreSQL connection and Better Auth secret to `.env.local`.

Generate/migrate the Better Auth tables:

```bash
npm run auth:migrate
```

Then start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## OAuth Redirect URLs

For local development use:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

For production, replace the domain with your deployed Vercel URL.
