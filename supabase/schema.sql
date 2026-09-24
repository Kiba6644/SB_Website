-- BMSCE IEEE Student Branch PRD v2.0 Schema
-- Run this in your Supabase SQL Editor

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

create table chapters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null,
  price numeric not null,
  description text
);

create table membership_config (
  id int primary key default 1,
  base_fee numeric not null,
  payee_vpa text not null,
  payee_name text not null
);

create table admins (
  id uuid primary key references auth.users(id),
  full_name text,
  role text default 'admin'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  base_fee numeric not null,
  total_amount numeric not null,
  status text not null default 'pending',
  payment_screenshot_url text,
  utr_reference text,
  order_reference text unique,
  created_at timestamptz default now(),
  verified_at timestamptz,
  verified_by uuid references admins(id),
  rejection_reason text
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) not null,
  chapter_id uuid references chapters(id) not null,
  price_at_purchase numeric not null
);

-- Note: Enable RLS and create Storage bucket 'public-assets' separately.
