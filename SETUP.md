# BazarDor Setup Checklist

## 1. Install

```bash
npm install
```

## 2. Environment

Create `.env.local` in the project root:

```env
BETTER_AUTH_SECRET=local-development-secret-change-this
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=https://api.api-store.workers.dev/api/bazardor
```

For local development, **DATABASE_URL can be left empty**. The project automatically uses a local `database.sqlite` file for Better Auth.

For production, set `DATABASE_URL` to a PostgreSQL database and set a strong `BETTER_AUTH_SECRET`.

## 3. Create Better Auth tables

Run once after `npm install`:

```bash
npm run auth:migrate
```

This creates the Better Auth tables in the local SQLite database.

## 4. Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## 5. OAuth (optional)

Google/GitHub buttons need their OAuth credentials. Email/password Sign Up and Sign In work without those social credentials.

Local callbacks:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

## 6. Deploy

For Vercel/production, use PostgreSQL by setting `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` in the deployment environment. Do not commit `.env.local` or OAuth secrets.
