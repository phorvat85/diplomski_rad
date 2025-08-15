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

CREATE TABLE IF NOT EXISTS task_entity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(50) NOT NULL ,
    description VARCHAR(255) NOT NULL,
    assignee_id BIGINT,
    FOREIGN KEY (assignee_id) REFERENCES user_entity(id),
    estimation VARCHAR(255) NOT NULL,
);
