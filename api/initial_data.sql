-- ROOM_TYPE TABLE
INSERT INTO room_type (type, updated_at, rule)
VALUES
('dm', NOW(), '{}'),
('public', NOW(), '{}'),
('private', NOW(), '{}'),
('protected', NOW(), '{"passwordRequired": true}');

-- NOTIFICATION_TYPE TABLE
INSERT INTO notification_type(name, updated_at)
VALUES('notification', NOW())
