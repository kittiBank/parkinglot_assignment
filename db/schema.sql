CREATE TABLE car_size (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(5) NOT NULL UNIQUE,
    description VARCHAR(50)
);

-- Insert data
INSERT INTO car_size (code, description)
VALUES ('S', 'Small'), ('M', 'Medium'), ('L', 'Large');

CREATE TABLE parking_lots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_id VARCHAR(5) NOT NULL UNIQUE,
    is_reserved BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_at DATETIME DEFAULT NULL
);

-- Insert data
INSERT INTO parking_lots (slot_id, is_reserved, created_at)
VALUES 
    ('001', 0, NOW()), ('002', 0, NOW()),('003', 0, NOW()),('004', 0, NOW()),('005', 0, NOW()),
    ('006', 0, NOW()),('007', 0, NOW()),('008', 0, NOW()),('009', 0, NOW()),('010', 0, NOW());

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL,
    car_size_code VARCHAR(5) NOT NULL, 
    slot_id VARCHAR(5) NOT NULL, 
    active BOOLEAN DEFAULT TRUE, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    leave_at DATETIME DEFAULT NULL
);
