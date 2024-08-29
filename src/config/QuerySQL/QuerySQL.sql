
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
    CHECK (
        password ~ '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$'
    ),
    role_id INT DEFAULT 4 REFERENCES roles(id),
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


INSERT INTO roles (role_name)
VALUES 
    ('Admin'),
    ('Manager'),
    ('Editor'),
    ('Viewer'),
    ('Guest');

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
('admin@gmail.com', '0123456255', 'Hieu@123', 1),
('user1@gmail.com', '0123456789', 'User@123', 2);