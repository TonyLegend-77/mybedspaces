# USOConnect Homes — MVP

Rental marketplace connecting tenants and landlords directly, with mandatory
landlord ID verification and per-listing ownership checks before anything
goes public.

## What's built

- Auth: email/password via NextAuth, roles (TENANT, LANDLORD, ADMIN)
- Property CRUD with filters (state, city, price, bedrooms, furnished)
- Landlord verification gate: no listing can be created until an admin
  approves the landlord's submitted ID
- Privacy-masked messaging: landlord sees "First L." until either party
  explicitly shares contact details on that thread
- Reporting: any listing or landlord can be reported; admin queue sorts by
  repeat-report count
- Admin panel: user suspend/reinstate, verification review, listing
  approve/reject, report resolution, basic analytics

## What's stubbed or missing (be aware before treating this as production-ready)

- No email verification on signup, no password reset flow
- No rate limiting on any API route
- Image uploads go straight to Cloudinary client-side base64, fine for MVP
  volume, not efficient at scale
- No automated tests
- ID document viewing in the admin listings page currently uses the direct
  Cloudinary URL. The `getSignedIdDocumentUrl` helper in `lib/cloudinary.ts`
  is written but not wired into the admin UI yet, wire it in before handling
  real ID documents so links expire after 10 minutes instead of staying
  permanently accessible
- No pagination anywhere (admin lists, property browse) — fine at low
  volume, will need it before this scales past a few hundred listings

## Local setup

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL, NEXTAUTH_SECRET, CLOUDINARY_* in .env
npx prisma db push
npm run dev
```

Visit `http://localhost:3000`. Register a landlord account, then manually
promote yourself to ADMIN in the database to test the review flows:

```bash
npx prisma studio
# find your user row, change role to ADMIN, save
```

## Deploy: Railway (database) + Vercel (app)

### 1. Database on Railway

1. Go to railway.app, create a project, add a **PostgreSQL** service.
2. Open the Postgres service, go to **Connect**, copy the
   `DATABASE_URL` (the "Postgres Connection URL").

### 2. Push your code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to vercel.com, **New Project**, import the GitHub repo.
2. In **Environment Variables**, add:
   - `DATABASE_URL` — from Railway
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your Vercel domain, e.g. `https://usoconnect-homes.vercel.app`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3. Deploy.

### 4. Push the schema to the live database

Run this once, locally, pointed at the Railway `DATABASE_URL`:

```bash
DATABASE_URL="<railway-url>" npx prisma db push
```

### 5. Promote your first admin

Same as local: use `npx prisma studio` pointed at the Railway URL, or connect
with `psql` and run:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'you@example.com';
```

## After deploying, test this exact path before calling it live

1. Register a landlord account. Confirm you're blocked from
   `/landlord/properties/new`.
2. Submit verification. Log in as admin, approve it.
3. Add a property as the landlord. Confirm it doesn't show on `/properties`
   until admin approves it.
4. Approve the listing as admin.
5. Register a tenant account, message the landlord from the property page.
6. Confirm the landlord sees "First L.", not the tenant's full name, until
   someone taps "share contact."
7. File a report on the listing, confirm it shows up in `/admin/reports`.

If all seven steps work, the core loop is real. Everything past that is
polish.
