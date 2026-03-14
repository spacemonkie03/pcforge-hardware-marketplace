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

CREATE TYPE payment_method_type AS ENUM (
  'CARD',
  'UPI',
  'NET_BANKING',
  'WALLET',
  'COD',
  'BANK_TRANSFER'
);

CREATE TYPE payment_method_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED');

CREATE TABLE address (
  id uuid PRIMARY KEY,
  "userId" uuid REFERENCES "user"(id) ON DELETE CASCADE,
  "fullName" varchar(255) NOT NULL,
  "phoneNumber" varchar(255) NOT NULL,
  line1 varchar(255) NOT NULL,
  line2 varchar(255),
  city varchar(255) NOT NULL,
  state varchar(255) NOT NULL,
  "postalCode" varchar(255) NOT NULL,
  country varchar(255) NOT NULL DEFAULT 'India',
  landmark varchar(255),
  label varchar(255),
  "isDefault" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

CREATE TABLE payment_method (
  id uuid PRIMARY KEY,
  "userId" uuid REFERENCES "user"(id) ON DELETE CASCADE,
  type payment_method_type NOT NULL,
  provider varchar(255) NOT NULL,
  label varchar(255) NOT NULL,
  status payment_method_status NOT NULL DEFAULT 'ACTIVE',
  "isDefault" boolean NOT NULL DEFAULT false,
  details jsonb,
  metadata jsonb,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

CREATE TABLE "order" (
  id uuid PRIMARY KEY,
  "userId" uuid REFERENCES "user"(id) ON DELETE CASCADE,
  "shippingAddressId" uuid REFERENCES address(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'PENDING',
  "paymentStatus" payment_status NOT NULL DEFAULT 'PENDING',
  currency varchar(16) NOT NULL DEFAULT 'INR',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  "shippingAmount" numeric(10,2) NOT NULL DEFAULT 0,
  "taxAmount" numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  "paymentMethodType" varchar(64),
  "paymentProvider" varchar(255),
  "paymentMethodLabel" varchar(255),
  "paymentMetadata" jsonb,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

CREATE TABLE order_item (
  id uuid PRIMARY KEY,
  "orderId" uuid REFERENCES "order"(id) ON DELETE CASCADE,
  "productId" uuid REFERENCES product(id) ON DELETE SET NULL,
  name varchar(255) NOT NULL,
  brand varchar(255) NOT NULL,
  category varchar(64) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  "unitPrice" numeric(10,2) NOT NULL,
  "lineTotal" numeric(10,2) NOT NULL,
  "productSnapshot" jsonb,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

CREATE TYPE cart_item_type AS ENUM ('PRODUCT', 'LISTING');

CREATE TABLE cart_item (
  id uuid PRIMARY KEY,
  "userId" uuid REFERENCES "user"(id) ON DELETE CASCADE,
  "itemType" cart_item_type NOT NULL,
  "productId" uuid REFERENCES product(id) ON DELETE SET NULL,
  "listingId" integer REFERENCES listings(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  snapshot jsonb,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

CREATE TABLE listings (
  id serial PRIMARY KEY,
  gpu_id integer NOT NULL,
  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
  price integer NOT NULL,
  condition text,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE listing_images (
  id serial PRIMARY KEY,
  listing_id integer NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0
);

