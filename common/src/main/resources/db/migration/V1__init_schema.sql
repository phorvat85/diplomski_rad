-- Roles
CREATE TABLE IF NOT EXISTS role_entity (
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Users
CREATE TABLE IF NOT EXISTS user_entity (
    id                         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email                      VARCHAR(255) NOT NULL,
    username                   VARCHAR(50)  NOT NULL UNIQUE,
    password                   VARCHAR(255) NOT NULL,
    role_id                    BIGINT,
    enabled                    BOOLEAN      NOT NULL DEFAULT TRUE,
    account_non_expired        BOOLEAN      NOT NULL DEFAULT TRUE,
    credentials_non_expired    BOOLEAN      NOT NULL DEFAULT TRUE,
    account_non_locked         BOOLEAN      NOT NULL DEFAULT TRUE,
    failed_login_attempts      INT,
    CONSTRAINT fk_user_role
    FOREIGN KEY (role_id) REFERENCES role_entity(id)
);

-- Tasks
CREATE TABLE IF NOT EXISTS task_entity (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task_key    VARCHAR(255) UNIQUE,
    title       VARCHAR(50)  NOT NULL,
    description VARCHAR(255) NOT NULL,
    assignee_id BIGINT,
    estimation  VARCHAR(255) NOT NULL,
    CONSTRAINT fk_task_assignee
    FOREIGN KEY (assignee_id) REFERENCES user_entity(id)
    ON UPDATE RESTRICT ON DELETE SET NULL
);