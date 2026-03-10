-- Minimal schema representing TypeORM entities. In practice, TypeORM synchronize handles it.
CREATE TYPE user_role AS ENUM ('USER', 'SELLER', 'ADMIN');
CREATE TYPE seller_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE product_category AS ENUM (
  'GPU',
  'CPU',
  'MOTHERBOARD',
  'RAM',
  'STORAGE',
  'PSU',
  'COOLER',
  'CASE',
  'FAN',
  'ACCESSORY'
);

CREATE TABLE "user" (
  id uuid PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  "passwordHash" varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'USER',
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

CREATE TABLE seller (
  id uuid PRIMARY KEY,
  name varchar(255) NOT NULL,
  status seller_status NOT NULL DEFAULT 'PENDING',
  "userId" uuid REFERENCES "user"(id),
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

CREATE TABLE product (
  id uuid PRIMARY KEY,
  name varchar(255) NOT NULL,
  brand varchar(255) NOT NULL,
  category product_category NOT NULL,
  price numeric(10,2) NOT NULL,
  images text[],
  specs jsonb,
  compatibility jsonb,
  "inStock" boolean DEFAULT true,
  rating double precision DEFAULT 0,
  "ratingCount" integer DEFAULT 0,
  "sellerId" uuid REFERENCES seller(id),
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

CREATE TABLE price_history (
  id uuid PRIMARY KEY,
  "productId" uuid REFERENCES product(id),
  price numeric(10,2) NOT NULL,
  "recordedAt" timestamptz NOT NULL,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

CREATE TABLE review (
  id uuid PRIMARY KEY,
  "userId" uuid REFERENCES "user"(id),
  "productId" uuid REFERENCES product(id),
  rating integer NOT NULL,
  comment text NOT NULL,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

