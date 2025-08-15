INSERT INTO user_entity (email, username, password, role_id) VALUES
(
    'admin@example.com',
    'admin',
    '$2a$12$2PIgxcsgHZOcOM0uoUOWfeMdhLxaNrHFh85bfaOzBGr9HxKvLq7mi', -- BCrypt: 'admin123'
    (SELECT id FROM role_entity WHERE name = 'ROLE_ADMIN')
);