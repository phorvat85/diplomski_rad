CREATE TABLE IF NOT EXISTS role_entity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_entity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id BIGINT,
    FOREIGN KEY (role_id) REFERENCES role_entity(id)
);

INSERT INTO role_entity (name) VALUES
    ('ROLE_ADMIN'),
    ('ROLE_MANAGER'),
    ('ROLE_WORKER')

ON CONFLICT (name) DO NOTHING;

INSERT INTO user_entity (email, username, password, role_id) VALUES
    (
    'admin@example.com',
    'admin',
    '$2a$10$q9g/dU8L2ycbgAVOkD0rc.NabnVnGMZKtszBGEAXU5M8gl8rua3g6', -- BCrypt: 'admin123'
    (SELECT id FROM role_entity WHERE name = 'ROLE_ADMIN')
    );
