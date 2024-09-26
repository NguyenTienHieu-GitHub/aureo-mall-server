
-- Bảng users (Người dùng)
CREATE TABLE users (
    user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Bảng roles (Vai trò)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);
CREATE TABLE user_roles (
  user_id UUID,
  role_id INT,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE

);
CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "numberPhone" VARCHAR(10),
    province VARCHAR(255),
    district VARCHAR(255),
    ward VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



-- Bảng permissions (Quyền)
CREATE TABLE permissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action VARCHAR(100) NOT NULL, -- Ví dụ: read, create, update, delete
  resource VARCHAR(100) NOT NULL, -- Ví dụ: users, products, orders
  description TEXT
);

-- Bảng role_permissions (Quyền của vai trò)
CREATE TABLE role_permissions (
  role_id BIGINT,
  permission_id BIGINT,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);



CREATE TABLE products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    handle VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vendor VARCHAR(255),
    type VARCHAR(255),
    tags TEXT[],  -- Array of text
    price DECIMAL(10, 2),
    price_min DECIMAL(10, 2),
    price_max DECIMAL(10, 2),
    available BOOLEAN,
    price_varies BOOLEAN,
    compare_at_price DECIMAL(10, 2),
    compare_at_price_min DECIMAL(10, 2),
    compare_at_price_max DECIMAL(10, 2),
    compare_at_price_varies BOOLEAN,
    featured_image VARCHAR(255),
    url VARCHAR(255)
);


CREATE TABLE product_variants (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    option1 VARCHAR(255),
    option2 VARCHAR(255),
    option3 VARCHAR(255),
    sku VARCHAR(255),
    requires_shipping BOOLEAN,
    taxable BOOLEAN,
    available BOOLEAN,
    name VARCHAR(255),
    public_title VARCHAR(255),
    options TEXT[],
    price DECIMAL(10, 2),
    weight DECIMAL(10, 2),
    compare_at_price DECIMAL(10, 2),
    inventory_management VARCHAR(255),
    barcode VARCHAR(255),
    requires_selling_plan BOOLEAN,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE variants_featured_image (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL,
    variant_id BIGINT NOT NULL,
    position INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    alt TEXT,
    width INT,
    height INT,
    src TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE variant_featured_image_variants (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    variant_featured_image_id BIGINT NOT NULL,
    variant_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variant_featured_image_id) REFERENCES variants_featured_image(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE variants_featured_media (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    variant_id BIGINT NOT NULL,
    alt VARCHAR(255),
    position INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE product_media (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL,
    media_type VARCHAR(255),
    src VARCHAR(255) NOT NULL,
    position INT DEFAULT 1,
    aspect_ratio DECIMAL(10, 2),
    height INT,
    width INT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL,
    src VARCHAR(255) NOT NULL,
    position INT DEFAULT 1,
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_options (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    position INT DEFAULT 1,
    values TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE preview_image (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    featured_media_id BIGINT NOT NULL,
    media_id BIGINT NOT NULL,
    aspect_ratio DECIMAL(10, 2),
    height INT,
    width INT,
    src VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (featured_media_id) REFERENCES variants_featured_media(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES product_media(id) ON DELETE CASCADE
);

CREATE TABLE product_selling_plan_allocations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL,
    variant_id BIGINT NOT NULL,
    start_date DATE,
    end_date DATE,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);




INSERT INTO roles (role_name, description)
VALUES 
    ('Admin', 'Administrator role'),
    ('Seller', 'Seller role'),
    ('Standard Seller', 'Standard Seller role'),
    ('Logistic', 'Logistic role'),
    ('Customer', 'Customer role');

INSERT INTO permissions (action, resource, description)
VALUES
    ('create', 'users', 'Create user'),
    ('delete', 'users', 'Delete user'),
    ('update', 'users', 'Update user'),
    ('read', 'users', 'Read user');

-- Quyền của Admin (được phép tất cả)
INSERT INTO role_permissions (role_id, permission_id)
VALUES
    (1, 1), -- Admin có quyền Create
    (1, 2), -- Admin có quyền Read
    (1, 3), -- Admin có quyền Update
    (1, 4); -- Admin có quyền Delete

-- Quyền của Customer (chỉ được phép đọc)
INSERT INTO role_permissions (role_id, permission_id)
VALUES
    (5, 2); -- Customer có quyền Read