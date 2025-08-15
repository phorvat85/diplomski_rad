INSERT INTO user_entity (email, username, password, role_id) VALUES
    ('admin@example.com', 'admin', '$2a$12$2PIgxcsgHZOcOM0uoUOWfeMdhLxaNrHFh85bfaOzBGr9HxKvLq7mi',
    (SELECT id FROM role_entity WHERE name = 'ROLE_ADMIN')),
    ('manager@example.com', 'manager', '$2a$12$J3pDehdzuoNzK7hYhcosze7XZ2dGGzxTt/SFteACvdkvTcTquf0QO',
    (SELECT id FROM role_entity WHERE name = 'ROLE_MANAGER')),
    ('worker@example.com', 'worker', '$2a$12$XTxN0vblq/wxIrouAxpCceHY5rDGO4jQap7JMTHXEHGPIrN0XZW0m',
    (SELECT id FROM role_entity WHERE name = 'ROLE_WORKER')),
    ('worker2@example.com', 'worker2', '$2a$12$XTxN0vblq/wxIrouAxpCceHY5rDGO4jQap7JMTHXEHGPIrN0XZW0m',
    (SELECT id FROM role_entity WHERE name = 'ROLE_WORKER')),
    ('worker3@example.com', 'worker3', '$2a$12$XTxN0vblq/wxIrouAxpCceHY5rDGO4jQap7JMTHXEHGPIrN0XZW0m',
    (SELECT id FROM role_entity WHERE name = 'ROLE_WORKER'));

