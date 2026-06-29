-- =====================================================================
-- Supabase setup for dynamic-e-commerce-portfolio-site
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================
-- This script creates all tables/enums that src/db/schema.ts expects
-- (Drizzle will not create them automatically — Supabase needs them
-- in the public schema first).
-- =====================================================================

-- Enable UUID generation just in case (not used directly, but safe)
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------
do $$ begin
  create type product_category as enum ('pen', 'watch', 'table', 'nameplate');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_category as enum ('custom_orders', 'corporate_gifts', 'flooring');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('user', 'admin');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- USERS  (note: do NOT use Supabase's built-in auth.users here — this
-- app stores its own users with bcrypt-hashed passwords, separate from
-- Supabase Auth so it can keep working with its own JWT cookies)
-- ---------------------------------------------------------------------
create table if not exists users (
  id          serial primary key,
  name        varchar(255) not null,
  email       varchar(255) not null unique,
  password    text         not null,
  phone       varchar(20),
  address     text,
  role        user_role    not null default 'user',
  created_at  timestamp    not null default now(),
  updated_at  timestamp    not null default now()
);

-- ---------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------
create table if not exists products (
  id                  serial primary key,
  name                varchar(255) not null,
  description         text,
  price               decimal(10, 2) not null,
  category            product_category not null,
  image_url           text,
  image_public_id     text,
  stock               integer not null default 0,
  featured            boolean not null default false,
  active              boolean not null default true,
  related_product_ids text         default '',
  created_at          timestamp    not null default now(),
  updated_at          timestamp    not null default now()
);

-- ---------------------------------------------------------------------
-- PORTFOLIO
-- ---------------------------------------------------------------------
create table if not exists portfolio (
  id              serial primary key,
  title           varchar(255) not null,
  description     text,
  image_url       text         not null,
  image_public_id text,
  category        varchar(100),
  featured        boolean      not null default false,
  sort_order      integer      not null default 0,
  created_at      timestamp    not null default now()
);

-- ---------------------------------------------------------------------
-- SERVICES
-- ---------------------------------------------------------------------
create table if not exists services (
  id              serial primary key,
  title           varchar(255) not null,
  description     text,
  category        service_category not null,
  image_url       text,
  image_public_id text,
  features        text         default '',
  active          boolean      not null default true,
  sort_order      integer      not null default 0,
  created_at      timestamp    not null default now(),
  updated_at      timestamp    not null default now()
);

-- ---------------------------------------------------------------------
-- CART ITEMS
-- ---------------------------------------------------------------------
create table if not exists cart_items (
  id         serial primary key,
  user_id    integer references users(id)   on delete cascade,
  session_id varchar(255),
  product_id integer references products(id) on delete cascade not null,
  quantity   integer not null default 1,
  created_at timestamp not null default now()
);

-- ---------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------
create table if not exists orders (
  id               serial primary key,
  user_id          integer references users(id) on delete set null,
  status           order_status not null default 'pending',
  total_amount     decimal(10, 2) not null,
  shipping_address text,
  notes            text,
  created_at       timestamp not null default now(),
  updated_at       timestamp not null default now()
);

-- ---------------------------------------------------------------------
-- ORDER ITEMS
-- ---------------------------------------------------------------------
create table if not exists order_items (
  id                serial primary key,
  order_id          integer references orders(id)   on delete cascade not null,
  product_id        integer references products(id) on delete set null,
  quantity          integer not null,
  price_at_purchase decimal(10, 2) not null,
  product_name      varchar(255) not null,
  created_at        timestamp not null default now()
);

-- ---------------------------------------------------------------------
-- HERO SETTINGS (single-row config table for the homepage video)
-- ---------------------------------------------------------------------
create table if not exists hero_settings (
  id              serial primary key,
  video_url       text,
  video_public_id text,
  headline        varchar(255) default 'Crafted With Precision',
  subheadline     text         default 'Premium engraved products for every occasion',
  cta_text        varchar(100) default 'Shop Now',
  updated_at      timestamp    not null default now()
);

-- Insert the single hero row if it doesn't exist yet
insert into hero_settings (id, headline, subheadline, cta_text)
values (1, 'Crafted With Precision', 'Premium engraved products for every occasion', 'Shop Now')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- INDEXES (helpful for common queries)
-- ---------------------------------------------------------------------
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_active   on products(active);
create index if not exists idx_portfolio_featured on portfolio(featured);
create index if not exists idx_cart_items_user    on cart_items(user_id);
create index if not exists idx_orders_user        on orders(user_id);
create index if not exists idx_orders_status      on orders(status);

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
-- Your Next.js backend talks to Supabase using the postgres role
-- (DATABASE_URL). RLS is on by default in Supabase. The postgres role
-- bypasses RLS, so your server has full access — that's what we want.
-- No policies needed here; just turn RLS on for hygiene.
-- ---------------------------------------------------------------------
alter table users         enable row level security;
alter table products      enable row level security;
alter table portfolio     enable row level security;
alter table services      enable row level security;
alter table cart_items    enable row level security;
alter table orders        enable row level security;
alter table order_items   enable row level security;
alter table hero_settings enable row level security;

-- =====================================================================
-- DONE. Next steps:
--   1. Copy your Supabase DATABASE_URL into .env.local
--   2. Run:  npm run dev
--   3. Hit:  POST http://localhost:3000/api/admin/seed
--      (creates the admin from ADMIN_EMAIL / ADMIN_PASSWORD in .env)
--   4. Login at /login with those credentials.
-- =====================================================================