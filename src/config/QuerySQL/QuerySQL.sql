
-- Bảng roles (Vai trò)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);
-- Bảng users (Người dùng)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role_id INT DEFAULT 5 REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    user_id INT REFERENCES users(id),
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


-- Bảng permissions (Quyền)
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    permission_name VARCHAR(50) NOT NULL UNIQUE
);

-- Bảng role_permissions (Quyền của vai trò)
CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(id),
    permission_id INT REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);


CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    description TEXT,
    published_at TIMESTAMP,
    created_at TIMESTAMP,
    vendor TEXT,
    type TEXT,
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
    featured_image TEXT,
    url TEXT UNIQUE
);


CREATE TABLE product_variants (
    id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    option1 TEXT,
    option2 TEXT,
    option3 TEXT,
    sku TEXT,
    requires_shipping BOOLEAN,
    taxable BOOLEAN,
    featured_image TEXT,
    available BOOLEAN,
    name TEXT,
    public_title TEXT,
    options TEXT[],
    price DECIMAL(10, 2),
    weight DECIMAL(10, 2),
    compare_at_price DECIMAL(10, 2),
    inventory_management TEXT,
    barcode TEXT,
    requires_selling_plan BOOLEAN,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE variants_featured_image (
    id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    variant_ids BIGINT NOT NULL,
    position INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    alt TEXT,
    width INT,
    height INT,
    src TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_ids) REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
    id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url TEXT NOT NULL,
    position INT DEFAULT 1,
    alt_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_options (
    id SERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    option_name TEXT NOT NULL,
    option_value TEXT NOT NULL,
    position INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_media (
    id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    media_type TEXT,
    media_url TEXT NOT NULL,
    position INT DEFAULT 1,
    aspect_ratio DECIMAL(10, 2),
    height INT,
    width INT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


INSERT INTO roles (role_name)
VALUES 
    ('Admin'),
    ('Seller'),
    ('Standard Seller'),
    ('Logistic'),
    ('Customer');

INSERT INTO permissions (permission_name)
VALUES
    ('Create'),
    ('Read'),
    ('Update'),
    ('Delete');

-- Quyền của Admin (được phép tất cả)
INSERT INTO role_permissions (role_id, permission_id)
VALUES
    (1, 1), -- Admin có quyền Create
    (1, 2), -- Admin có quyền Read
    (1, 3), -- Admin có quyền Update
    (1, 4); -- Admin có quyền Delete

-- Quyền của Manager (chỉ được phép đọc và cập nhật)
INSERT INTO role_permissions (role_id, permission_id)
VALUES
    (2, 2), -- Manager có quyền Read
    (2, 3); -- Manager có quyền Update

-- Quyền của Editor (chỉ được phép cập nhật)
INSERT INTO role_permissions (role_id, permission_id)
VALUES
    (3, 3); -- Editor có quyền Update

-- Quyền của Viewer (chỉ được phép đọc)
INSERT INTO role_permissions (role_id, permission_id)
VALUES
    (4, 2); -- Viewer có quyền Read

-- Quyền của Guest (chỉ được phép đọc)
INSERT INTO role_permissions (role_id, permission_id)
VALUES
    (5, 2); -- Guest có quyền Read

INSERT INTO users (email, phone, password, role_id)
VALUES
('admin@gmail.com', '0123456255', 'Hieu@12345678', 1),
('user1@gmail.com', '0123456789', 'User@12345678', 2);