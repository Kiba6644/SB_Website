# BMSCE IEEE Student Branch Website

Official website for the **IEEE Student Branch at B.M.S. College of Engineering (Branch 06261, Region 10)**. Built with Next.js 15 (App Router), Tailwind CSS v4, and Supabase for the 2026 Annual Membership Drive.

---

## 🌟 Key Features

### 🎓 1. Multi-Step Student Membership Flow
- **Minimal Initial Sign-Up** (`/membership/register`): Email, password, and confirm password with an email verification gate.
- **Academic & Personal Profile** (`/membership/profile`): Full Name, USN, Department, Year of Study, Contact Info, and optional IEEE Member ID with auto-fill sample testing helper.
- **Dynamic Chapters Shopping Cart** (`/membership/chapters`):
  - Fixed Base Branch Membership fee.
  - Interactive add/remove for all 5 technical chapters (Computer Society, PES, PELS/IES, WIE, SSIT) with real-time total calculation.
- **Dynamic UPI QR Checkout** (`/membership/checkout`):
  - Client-side generated UPI payment QR code (`qrcode.react`) encoding the exact total and a unique order reference (`BMSCE-XXXXXX`).
  - **Copy UPI ID** & **Copy Amount** buttons for mobile users paying on the same device.
  - **Download QR Code** image button.
  - Payment proof screenshot upload & UTR/transaction reference input.
- **Member Dashboard** (`/account`):
  - Real-time status tracking (`Pending Verification`, `Verified`, or `Rejected`).
  - **Interactive Resubmission**: If an application is rejected with admin feedback, students can resubmit a clear screenshot and correct their UTR directly without re-ordering.

---

### 🛡️ 2. Executive Admin Verification Portal
- **Admin Sign-In** (`/admin/login`): Gated login with quick 1-click demo credentials for branch chairs and executives.
- **Orders Verification Dashboard** (`/admin/orders`):
  - **KPI Metrics**: Total Orders, Pending Reviews, Verified Members, and Total Funds Collected.
  - **Search & Filters**: Instant filter by status (`All`, `Pending`, `Verified`, `Rejected`) and search by USN, Student Name, Order Ref, or UTR.
  - **Payment Proof Viewer**: Full modal image preview of uploaded transaction screenshots.
  - **Verification Controls**: One-click **Verify** (triggers automated receipt email) and **Reject** (with reason prompt).
  - **Ledger Export**: One-click **Export to CSV** for offline administrative recordkeeping.
- **Global Announcement Banner Manager** (`/admin/announcement`):
  - Live preview and toggle for the sitewide announcement bar.

---

### 🏛️ 3. Society Chapters & Affinity Groups
Interactive Bento grid showcasing:
1. **IEEE Computer Society (CS)** — Software Architectures, Algorithms, AI Systems & IEEEXtreme.
2. **IEEE Power & Energy Society (PES)** — Clean Tech, Microgrids & Smart Energy.
3. **IEEE PELS & IES Joint Chapter** — PCB Fabrication, Power Drives & Industrial Automation.
4. **IEEE Women in Engineering (WIE)** — Mentorship, Leadership & STEM Advancement.
5. **IEEE Social Implications of Technology (SSIT)** — Tech Ethics, AI Governance & Humanitarian Engineering.

---

### 📱 4. Responsive & Accessible Design
- **Dark Theme Palette**: Sampled directly from the official BMSCE IEEE brand logo:
  - Primary Orange: `#F26625`
  - Orange Accent: `#FF5300`
  - Primary Navy: `#00377E`
  - Deep Navy: `#004993`
  - Sky Blue: `#18A4FE`
  - Dark Surfaces: `#0A0F1A` / `#12192B`
- Mobile hamburger navigation drawer with quick links to registration, chapters, member portal, and admin portal.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Kiba6644/SB_Website.git
cd SB_Website
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demo & Testing Credentials

The application includes built-in offline/demo sessions, allowing complete testing without waiting for database provisioning:

| Portal | URL | Demo Email | Demo Password | Quick Action |
|---|---|---|---|---|
| **Member Registration** | `/membership/register` | `test@bmsce.ac.in` | `password123` | Click **"Quick Demo Login"** |
| **Executive Admin** | `/admin/login` | `admin@bmsce.ac.in` | `adminpassword` | Click **"Demo Login"** |

---

## 🗄️ Database Setup (Supabase)

When connecting your live Supabase project:
1. Execute the DDL in `supabase/schema.sql` inside your Supabase SQL Editor.
2. Create a storage bucket named `public-assets` with public/authenticated read access for payment screenshots.
3. Update `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Transactional Receipt Email (Nodemailer SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=ieee@bmsce.ac.in
SMTP_PASS=your-app-password
```

---

## 📦 Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **QR Generation**: `qrcode.react`
- **Email**: Nodemailer
- **Database / Auth**: Supabase (PostgreSQL, Supabase Auth, Storage)
- **Deployment**: Vercel

---

## 📄 License
Maintained by **BMSCE IEEE Student Branch** (Branch 06261, Region 10).
