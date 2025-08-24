INSERT INTO task_entity (title, description, assignee_id, estimation) VALUES
    ('Implement login form',   'Create the frontend login form.',
    (SELECT id FROM user_entity WHERE username = 'admin'),   '2h'),
    ('Create admin dashboard', 'UI for managing users and tasks.',
    (SELECT id FROM user_entity WHERE username = 'admin'),   '4h'),
    ('Write unit tests',       'Tests for authentication module.',
    (SELECT id FROM user_entity WHERE username = 'manager'), '3h'),
    ('Fix role-based access',  'Ensure proper authorization rules.',
    (SELECT id FROM user_entity WHERE username = 'worker'),  '1h');

UPDATE task_entity
SET task_key = 'KFK-' || id::text
WHERE task_key IS NULL;
