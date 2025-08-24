INSERT INTO role_entity (name) VALUES
    ('ROLE_ADMIN'),
    ('ROLE_MANAGER'),
    ('ROLE_WORKER')
ON CONFLICT (name) DO NOTHING;
