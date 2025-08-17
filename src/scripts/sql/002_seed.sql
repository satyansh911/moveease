-- Seed initial data for local development

INSERT INTO units (name, type, status, location) VALUES
('Unit 07 — Patrol Car', 'Patrol Car', 'Available', '5th & Pine'),
('Unit 12 — Motorbike', 'Motorbike', 'On Scene', 'Main & 2nd'),
('Unit 21 — Patrol Car', 'Patrol Car', 'Available', 'Broadway & Oak'),
('Tow 03 — Tow Truck', 'Tow Truck', 'Unavailable', 'Depot'),
('Supervisor 1', 'Supervisor', 'Available', 'HQ');

INSERT INTO incidents (type, severity, location, status, reported_at, assigned_unit_id) VALUES
('Accident', 'High', 'I-405 S @ Exit 12', 'Open', DATE_SUB(UTC_TIMESTAMP(), INTERVAL 15 MINUTE), NULL),
('Breakdown', 'Medium', 'Main & 2nd', 'In Progress', DATE_SUB(UTC_TIMESTAMP(), INTERVAL 45 MINUTE), 2),
('Roadwork', 'Low', '3rd Ave', 'Open', DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 HOUR), NULL);

INSERT INTO alerts (title, detail, level, created_at) VALUES
('Multi-vehicle collision', 'I-405 S at Exit 12: left two lanes blocked.', 'Critical', DATE_SUB(UTC_TIMESTAMP(), INTERVAL 8 MINUTE)),
('Roadwork started', '3rd Ave maintenance — expect delays.', 'Warning', DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 MINUTE)),
('Heavy rain', 'Reduced visibility reported in downtown.', 'Advisory', DATE_SUB(UTC_TIMESTAMP(), INTERVAL 65 MINUTE));

INSERT INTO cameras (name, status, img) VALUES
('Cam 12 — 5th & Pine', 'Online', '/traffic-camera-intersection.png'),
('Cam 27 — I-90 EB', 'Online', '/highway-traffic-camera.png'),
('Cam 03 — Downtown', 'Offline', '/offline-city-camera.png'),
('Cam 45 — Stadium', 'Online', '/stadium-traffic-camera.png');

INSERT INTO intersections (name, state) VALUES
('5th & Pine', 'Green'),
('Broadway & Oak', 'Red'),
('I-90 On-Ramp', 'Green'),
('Stadium Blvd', 'Yellow'),
('Main & 2nd', 'Red');
