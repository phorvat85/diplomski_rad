INSERT INTO task_entity (title, description, assignee_id, estimation)
VALUES
    ('Implement login form', 'Create the frontend login form.', 1, '2h'),
    ('Create admin dashboard', 'UI for managing users and tasks.', 1, '4h'),
    ('Write unit tests', 'Tests for authentication module.', 2, '3h'),
    ('Fix role-based access', 'Ensure proper authorization rules.', 3, '1h');

-- Update key field to "KFK-{id}" for all tasks
UPDATE task_entity
SET task_key = CONCAT('KFK-', id)
WHERE task_key IS NULL;