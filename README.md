# M&F Tattoo Studio Manager

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL (Supabase)
- NextAuth (credentials)

## Local dev
1. Create a free Supabase project (https://supabase.com) and copy the connection string.
2. `npm install`
3. Copy `.env.example` to `.env`, set `DATABASE_URL` and `NEXTAUTH_SECRET`.
4. `npx prisma migrate dev --name init`
5. `npm run dev`
6. Open http://localhost:3000

## Deploy (Vercel)
1. Push to GitHub.
2. Import in Vercel.
3. Set env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (your Vercel URL).
4. Build command: `prisma generate && next build` (already in vercel.json).
5. Run migrations: `npx prisma migrate deploy` (via Vercel build or locally with prod DB).

## Cloud sync
All devices share the same Supabase PostgreSQL database, so data syncs automatically.

## Admin account
Create via: `node scripts/seed-admin.js` (edit credentials first) or register through the app.
