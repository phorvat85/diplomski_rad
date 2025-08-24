-- Users (seed) — include booleans + failed attempts
INSERT INTO user_entity (
    email, username, password, role_id,
    enabled, account_non_expired, credentials_non_expired, account_non_locked,
    failed_login_attempts
) VALUES
      ('admin@example.com',   'admin',   '$2a$12$2PIgxcsgHZOcOM0uoUOWfeMdhLxaNrHFh85bfaOzBGr9HxKvLq7mi',
       (SELECT id FROM role_entity WHERE name = 'ROLE_ADMIN'),
       TRUE, TRUE, TRUE, TRUE, 0),
      ('manager@example.com', 'manager', '$2a$12$J3pDehdzuoNzK7hYhcosze7XZ2dGGzxTt/SFteACvdkvTcTquf0QO',
       (SELECT id FROM role_entity WHERE name = 'ROLE_MANAGER'),
       TRUE, TRUE, TRUE, TRUE, 0),
      ('worker@example.com',  'worker',  '$2a$12$XTxN0vblq/wxIrouAxpCceHY5rDGO4jQap7JMTHXEHGPIrN0XZW0m',
       (SELECT id FROM role_entity WHERE name = 'ROLE_WORKER'),
       TRUE, TRUE, TRUE, TRUE, 0),
      ('worker2@example.com', 'worker2', '$2a$12$XTxN0vblq/wxIrouAxpCceHY5rDGO4jQap7JMTHXEHGPIrN0XZW0m',
       (SELECT id FROM role_entity WHERE name = 'ROLE_WORKER'),
       TRUE, TRUE, TRUE, TRUE, 0),
      ('worker3@example.com', 'worker3', '$2a$12$XTxN0vblq/wxIrouAxpCceHY5rDGO4jQap7JMTHXEHGPIrN0XZW0m',
       (SELECT id FROM role_entity WHERE name = 'ROLE_WORKER'),
       TRUE, TRUE, TRUE, TRUE, 0)
    ON CONFLICT (username) DO NOTHING;
