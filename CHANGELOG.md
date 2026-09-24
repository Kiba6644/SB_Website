# Changelog

All notable changes to the **BMSCE IEEE Student Branch Website** will be documented in this file.

---

## [2.1.0] - 2026-09-25

### Added
- **Legal & Trust Pages**:
  - `/privacy`: Official student privacy policy detailing data usage, USN/email storage, and security.
  - `/terms`: Membership eligibility, IEEE code of ethics, and duration rules.
  - `/refund`: Dues policy for verified orders, duplicate UPI charge resolution, and rejection resubmission terms.
  - Linked in global footer across all pages.
- **Documentation Suite**:
  - `.env.example`: Full template of environment variables for Supabase and Nodemailer.
  - `CONTENT_CHECKLIST.md`: Non-technical checklist for executive committee members to supply remaining text and assets.
  - `ADMIN_GUIDE.md`: Walkthrough for student volunteers verifying payments and managing announcements.
  - `DEPLOYMENT.md`: Vercel setup instructions and custom domain DNS cutover guide.
  - `CHANGELOG.md`: Dated phase-by-phase version history.

---

## [2.0.0] - 2026-09-25 (Phase 2 & Mobile Polish)

### Added
- **Responsive Mobile Navigation (`Navbar.tsx`)**:
  - Slide-down drawer with animated hamburger toggle for mobile devices.
  - Direct shortcuts to membership registration, chapter verticals, member dashboard, and admin portal.
- **Interactive Payment Resubmission Flow (`/account`)**:
  - Modal allowing students to re-upload clear transaction screenshots and corrected UTR references for rejected orders.
  - Automatically resets order status back to `Pending Verification`.
- **Checkout Polish (`/membership/checkout`)**:
  - Single-click **Copy UPI ID** and **Copy Amount** buttons for mobile payment execution.
  - Single-click **Download QR Code** button converting vector QR to high-resolution PNG.
- **Rich Chapters Bento Grid (`src/app/page.tsx`)**:
  - Asymmetrical card layout highlighting IEEE Computer Society (CS), PES, PELS/IES, WIE, and SSIT with badges, icons, and focus tracks.
- **Executive Admin Verification Portal (`/admin/orders`)**:
  - KPI metric cards: Total Orders, Pending Reviews, Verified Members, and Verified Funds (₹).
  - Search by USN, student name, order reference, or UTR, with status tab filters.
  - Modal image viewer for uploaded payment screenshots.
  - One-click **Verify** button triggering automated receipt email dispatch.
  - One-click **Reject** modal prompting for specific feedback.
  - **Export to CSV** button generating a clean registration ledger.
- **Announcement Banner System (`/admin/announcement` & `AnnouncementBar.tsx`)**:
  - Executive management interface with live site preview and toggle.
  - Dynamic top announcement banner across all public pages with dismissal support.

---

## [1.5.0] - 2026-09-25 (Phase 1.5 - PRD v2.0 Architecture)

### Added
- **Multi-Step Membership Flow**:
  - `/membership/register`: Minimal signup (Email, Password, Confirm Password) with email verification holding screen.
  - `/membership/profile`: Personal and academic profiling with auto-fill sample testing helper.
  - `/membership/chapters`: Dynamic chapter shopping cart calculating running totals with base membership fee.
  - `/membership/checkout`: Dynamic client-side UPI intent string generation (`upi://pay?pa=...`) and QR rendering via `qrcode.react`.
  - `/account`: Member portal for tracking verification progress (`Pending`, `Verified`, `Rejected`).
- **Nodemailer Transactional Receipt Route (`/api/send-receipt`)**:
  - Automated HTML email dispatch upon payment verification.
- **Database Architecture (`supabase/schema.sql`)**:
  - DDL for `profiles`, `chapters`, `membership_config`, `admins`, `orders`, and `order_items`.
- **Local Testing & Offline Suite**:
  - Pre-configured demo credentials (`test@bmsce.ac.in` / `password123` and `admin@bmsce.ac.in` / `adminpassword`).
  - Graceful fallback preventing `"Failed to fetch"` network crashes when Supabase is unconfigured.

---

## [1.0.0] - 2026-09-25 (Phase 1 - Scaffold & Theming)

### Added
- Scaffolding of Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript.
- Configured official brand palette sampled from BMSCE IEEE logo:
  - Primary Orange (`#F26625`), Navy (`#00377E`), Sky Blue (`#18A4FE`), and Dark Surfaces (`#0A0F1A`, `#12192B`).
- Clean archival of legacy HTML/CSS/JS files into `legacy/`.
