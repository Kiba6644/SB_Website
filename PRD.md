# PRD — BMSCE IEEE Student Branch Website Redesign

**Prepared for:** BMSCE IEEE Student Branch (Branch 06261, Region 10)
**Current site:** https://sb-website-theta.vercel.app/
**Repo:** https://github.com/Kiba6644/SB_Website (migrated to Next.js in Phase 1)
**Target ship date:** 27 September 2026 (hard deadline — membership drive)
**Doc status:** v2.0 — supersedes v1.0. **The membership flow below replaces what was built in Phase 1** (Phase 1 implemented a simple direct-insert form; that is now the wrong shape — see §9).

---

## 1. Background & Goal

The branch is running a **membership drive** and needs the website to convert visitors into registered, *paid* members before **27 Sept 2026**.

**Primary objective (P0, must ship by deadline):**
A full membership flow: visitor **registers with an account (email)** → fills in personal/academic details → **adds chapters to a cart** (each chapter + base membership carries a fee) → **checkout** shows a **dynamically generated UPI QR** for the exact cart total → visitor **pays via any UPI app and uploads a payment screenshot** → order is created with **status = pending** → visitor can **log back in** to check status → **branch admin verifies the payment** from a backend dashboard → on verification, status flips to **verified** and an **automated receipt email** is sent.

**Secondary objectives:** same as v1.0 — dark theme on the logo palette, accurate Chapters/Events/About content, Exec Committee, Sponsors, Alumni, Achievements sections, admin-editable announcement banner, past-events archive.

---

## 2. Users

| User | Needs |
|---|---|
| Prospective member | Create an account, register personal details, choose which chapters to join, pay via UPI, upload proof, track verification status |
| Verified member | Log in and see their membership is confirmed; hold onto the confirmation/receipt email |
| Branch admin | Log in to a protected dashboard, review pending orders (details + payment screenshot), mark **Verified** or **Rejected**, trigger the receipt email, manage events/announcement/content sections |
| Current member / event attendee | Browse events (photo/specs/external form link), unaffected by the membership flow |

Note: the branch will separately create official accounts on the IEEE.org website for verified members and share those credentials directly — this site's login is only for tracking *this site's* membership/payment status, not an IEEE.org account.

---

## 3. Scope

### 3.1 In scope — Membership flow (P0, rebuilt)
1. **User accounts**: Supabase Auth (email + password, or magic link — builder's choice) for prospective/verified members. Separate from the `admins` role.
2. **Registration form** (post sign-up, or same step): Full Name, USN, Institutional Email, Department, Year of Study, Phone (optional), IEEE Member ID (optional) — saved to a `profiles` table keyed to the auth user.
3. **Chapter cart ("shopping interface")**: base membership fee is a fixed line item; the 5 chapters (CS, PES, PELS/IES, WIE, SSIT) are addable/removable cart items, each with its own price. Cart shows a running total.
4. **Checkout**: generates a **UPI deep-link QR code client-side** (`upi://pay?pa=<branch VPA>&pn=<payee name>&am=<cart total>&cu=INR&tn=<order reference>`) — no payment gateway needed, no gateway fees, works with any UPI app.
5. **Proof of payment**: user uploads a payment screenshot (Supabase Storage) and optionally enters a UPI transaction reference/UTR. Submitting creates an `orders` row with `status = 'pending'`.
6. **Status tracking**: authenticated user can log back in (e.g. `/account`) and see their order status: Pending / Verified / Rejected.
7. **Admin verification**: admin dashboard lists pending orders with member details + screenshot; admin marks Verified or Rejected.
8. **Automated receipt email**: on marking an order Verified, an email is sent to the member's registered email confirming membership + chapters + amount paid. Requires a transactional email provider (see §5 and §10 — branch needs to supply/approve one, e.g. Resend or SendGrid; Supabase Auth's built-in email is for auth flows only and isn't meant for this).

### 3.2 In scope — everything else (unchanged from v1.0)
Dark theme + logo palette, Chapters (static, unchanged content), Events (photo/specs/external-form-link cards, upcoming + past archive), About/Heritage rewrite, Exec Committee, Sponsors, Alumni, Achievements, admin-editable announcement banner, admin analytics (visitor + registration counts, admin-only).

### 3.3 Out of scope
Payment gateway integration (UPI is handled via self-generated QR + manual verification, not an automated payment processor), WhatsApp/Slack notifications, Google Sheets sync, public-facing analytics, creating the members' official IEEE.org accounts (branch does this separately, offline).

---

## 4. Information Architecture

```
/                        → Home (single-page scroll)
  #hero
  #chapters              (static, 5 chapters)
  #events                (upcoming — photo/specs/form-link cards)
  #past-events           (archive)
  #about
  #exec-committee
  #sponsors
  #alumni
  #achievements
  #membership             → CTA into the flow below

/membership/register      → Sign up (email/password or magic link) + profile details form
/membership/chapters      → Cart / shopping interface (base fee + chapter add-ons)
/membership/checkout      → Dynamic UPI QR + screenshot upload + UTR field → submit
/account                  → Logged-in member's status page (Pending / Verified / Rejected, order summary)

/admin/login              → Admin sign-in
/admin                    → Dashboard
  /admin/orders            → Review pending orders, view screenshots, Verify / Reject
  /admin/announcement
  /admin/events
  /admin/analytics
```

---

## 5. Tech Stack (unchanged, +1 addition)

Next.js (App Router) + Tailwind CSS + Supabase (Postgres, Auth, Storage), deployed on Vercel.

**New for this revision:** a transactional email provider for the automated receipt (e.g. **Resend** — integrates cleanly with a Supabase Edge Function or a Next.js API route triggered on order verification). Needs an API key from whichever provider the branch approves; flagged as an open item in §10.

**QR generation:** any client-side QR library (e.g. `qrcode.react` or `qrcode`) encoding the UPI intent string — no backend/gateway call required.

---

## 6. Visual Design

Unchanged from v1.0 — dark theme, palette sampled from the logo:

| Role | Hex |
|---|---|
| Primary Orange | `#F26625` |
| Orange accent | `#FF5300` |
| Primary Navy | `#00377E` |
| Deep Navy | `#004993` |
| Sky Blue accent | `#18A4FE` |
| Background | `#0A0F1A` (suggested) |
| Surface/card | `#12192B` (suggested) |
| Body text | `#E7ECF5` (suggested) |
| Muted text | `#8B95A8` (suggested) |

---

## 7. Data Model (Supabase / Postgres) — revised

```sql
-- Member profile, linked 1:1 to a Supabase Auth user
create table profiles (
  id uuid primary key references auth.users(id),
  full_name text not null,
  usn text not null,
  email text not null,
  department text not null,
  year_of_study text,
  phone text,
  ieee_member_id text,
  created_at timestamptz default now()
);

-- The 5 fixed chapters, now carrying a price for the cart
create table chapters (
  id uuid primary key default gen_random_uuid(),
  name text not null,             -- 'Computer Society', 'Power & Energy Society', etc.
  code text not null,             -- 'CS' / 'PES' / 'PELS-IES' / 'WIE' / 'SSIT'
  price numeric not null,
  description text
);

-- Base membership fee as a single-row config (so it's editable without a code change)
create table membership_config (
  id int primary key default 1,
  base_fee numeric not null,
  payee_vpa text not null,        -- branch's UPI ID, e.g. bmsceieee@okhdfcbank
  payee_name text not null
);

-- One order per checkout attempt
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  base_fee numeric not null,
  total_amount numeric not null,
  status text not null default 'pending',   -- 'pending' | 'verified' | 'rejected'
  payment_screenshot_url text,
  utr_reference text,
  order_reference text unique,               -- shown in the UPI 'tn' field, used to reconcile payment
  created_at timestamptz default now(),
  verified_at timestamptz,
  verified_by uuid references admins(id),
  rejection_reason text
);

-- Chapters selected within an order (base membership is implicit on every order, not a row here)
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) not null,
  chapter_id uuid references chapters(id) not null,
  price_at_purchase numeric not null
);

-- Admin users (unchanged from v1.0)
create table admins (
  id uuid primary key references auth.users(id),
  full_name text,
  role text default 'admin'
);
```

**RLS:** `profiles`/`orders`/`order_items` — a user can `select`/`insert` only rows tied to their own `auth.uid()`; `update` of `orders.status` restricted to `admins`. `chapters` and `membership_config` are public `select`, admin-only `update`. Storage bucket for payment screenshots should **not** be public-read — restrict to owner + admins (signed URLs for admin viewing).

---

## 8. Key Flows — revised

**Membership registration & payment (P0):**
1. Visitor clicks "Become a Member" → `/membership/register`.
2. Creates an account (email/password or magic link) and fills profile details → saved to `profiles`.
3. Redirected to `/membership/chapters`: sees base membership fee (fixed, always included) and the 5 chapters as addable cards with prices. Adds/removes chapters; running total updates live.
4. Proceeds to `/membership/checkout`: an `orders` row is drafted (or created as `pending` at this point) with a unique `order_reference`; a UPI QR is generated client-side encoding the exact total and that reference.
5. Visitor scans and pays in their own UPI app, then uploads a screenshot (and optionally the UTR) and submits.
6. `orders.status = 'pending'`; user sees a "We'll verify your payment shortly" confirmation and can return to `/account` anytime to check status.

**Admin verification:**
1. Admin logs in, opens `/admin/orders`, sees pending orders with member details, chapters selected, amount, and the uploaded screenshot.
2. Cross-checks against actual UPI payments received, then marks **Verified** or **Rejected** (with an optional reason).
3. On **Verified**: `verified_at`/`verified_by` set, and a receipt email is triggered to the member's email (membership confirmed, chapters, amount, order reference).
4. On **Rejected**: member sees the rejected status and reason at `/account` and can resubmit (re-upload a screenshot / start a new order — builder's call on whether to allow editing the same order or requiring a new one).

**Event discovery** — unchanged from v1.0 (photo/specs/external form link, no in-site registration).

---

## 9. Phasing & Rework Note

**What Phase 1 built:** account-less direct insert into a flat `members` table on form submit. **This must be reworked** to the account + cart + payment-proof + verification flow above. Concretely, from the Phase 1 walkthrough:
- `MembershipForm.tsx` needs to be split into the multi-step flow (`/membership/register` → `/membership/chapters` → `/membership/checkout`) and gated behind Supabase Auth instead of being a single anonymous insert.
- The flat `members` table is replaced by `profiles` + `chapters` + `membership_config` + `orders` + `order_items` (§7). If any real signups already landed in the old `members` table, migrate them into `profiles`/`orders` before dropping it — otherwise safe to drop and recreate.
- Everything else from Phase 1 (Next.js scaffold, Tailwind palette, nav/layout, `EventCard.tsx`, events section) stays as-is.

**Revised phase order to hit 27 Sept:**

**Phase 1.5 (must-have, replaces old membership piece):**
- Supabase Auth wired up for members (separate from admin auth).
- `profiles`, `chapters`, `membership_config`, `orders`, `order_items` tables + RLS.
- `/membership/register` → `/membership/chapters` → `/membership/checkout` flow, screenshot upload to Storage, dynamic UPI QR.
- `/account` status page.

**Phase 2:**
- Admin `/admin/orders` verification screen (Verify/Reject).
- Automated receipt email on verification (needs email provider — see §10).
- Admin auth + announcement editing + event CRUD + past-events archive (as in v1.0).

**Phase 3 (can trail the deadline):**
- Exec Committee, Sponsors, Alumni, Achievements sections.
- Rewritten About/Heritage copy.
- Custom domain cutover.

---

## 10. Open Items for the Branch to Supply

- **Base membership fee** and **price per chapter** (same across all 5, or different?).
- **UPI VPA (payee ID)** and **payee display name** for the QR.
- Which **transactional email provider** to use for the receipt email (e.g. Resend) and its API key.
- Whether a **rejected** order lets the member resubmit the same order or must start a new one.
- Real upcoming event details, About/Heritage copy, Exec Committee/Sponsors/Alumni/Achievements content (unchanged asks from v1.0).
- Admin access list (names/emails) for the `admins` table.

---

## 11. Acceptance Criteria (P0, revised)

- [ ] A visitor can create an account, fill in profile details, add/remove chapters in a cart, and see a live running total including the base fee.
- [ ] Checkout generates a UPI QR that encodes the correct total and a unique order reference.
- [ ] Visitor can upload a payment screenshot and submit; an `orders` row is created with `status = 'pending'`.
- [ ] Logged-in visitor can revisit `/account` and see their current status.
- [ ] Admin can log in, view pending orders with screenshots, and mark them Verified or Rejected.
- [ ] Marking an order Verified sends an automated receipt email to the member.
- [ ] Dark theme + logo palette applied site-wide; old per-event registration modal remains removed; events show photo/specs/external form link as in v1.0.