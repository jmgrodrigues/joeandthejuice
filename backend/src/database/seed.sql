-- Joe & The Juice Store Manager - Database Seed Data
-- This file contains realistic test data for stores and employees

-- Insert Stores
INSERT INTO store (name, address, city, country, phone, email, manager, "employeeCount", "monthlyRevenue", "performanceScore", "isActive", "createdAt", "updatedAt") VALUES
-- Denmark
('Copenhagen Central', 'Strøget 15', 'Copenhagen', 'Denmark', '+45 33 12 34 56', 'copenhagen.central@joe.dk', 'Emma Nielsen', 8, 65000, 95, true, NOW(), NOW()),
('Aarhus C', 'Ryesgade 30', 'Aarhus', 'Denmark', '+45 86 12 34 56', 'aarhus.c@joe.dk', 'Lars Andersen', 6, 48000, 89, true, NOW(), NOW()),
('Odense City', 'Vestergade 42', 'Odense', 'Denmark', '+45 66 12 34 56', 'odense.city@joe.dk', 'Maja Sørensen', 5, 42000, 87, true, NOW(), NOW()),

-- United Kingdom
('London Shoreditch', '45 Commercial Street', 'London', 'United Kingdom', '+44 20 7946 0958', 'london.shoreditch@joe.co.uk', 'James Smith', 7, 58000, 92, true, NOW(), NOW()),
('Manchester Arndale', '49 High Street', 'Manchester', 'United Kingdom', '+44 161 234 5678', 'manchester.arndale@joe.co.uk', 'Sophie Wilson', 6, 52000, 88, true, NOW(), NOW()),
('Birmingham Bull Ring', 'Bullring Shopping Centre', 'Birmingham', 'United Kingdom', '+44 121 234 5678', 'birmingham.bullring@joe.co.uk', 'Oliver Brown', 8, 58000, 86, true, NOW(), NOW()),

-- United States
('NYC Manhattan', '123 5th Avenue', 'New York', 'United States', '+1 212 555 0123', 'nyc.manhattan@joe.com', 'Sarah Connor', 10, 72000, 90, true, NOW(), NOW()),
('LA Beverly Hills', '456 Rodeo Drive', 'Los Angeles', 'United States', '+1 323 555 0456', 'la.beverlyhills@joe.com', 'Michael Rodriguez', 9, 68000, 88, true, NOW(), NOW()),

-- Sweden
('Stockholm Gamla Stan', 'Västerlånggatan 68', 'Stockholm', 'Sweden', '+46 8 123 456 78', 'stockholm.gamlastan@joe.se', 'Sofia Andersson', 6, 48000, 88, true, NOW(), NOW()),
('Gothenburg Center', 'Kungsgatan 25', 'Gothenburg', 'Sweden', '+46 31 123 456 78', 'gothenburg.center@joe.se', 'Erik Larsson', 5, 42000, 85, true, NOW(), NOW()),

-- Germany
('Berlin Mitte', 'Hackescher Markt 5', 'Berlin', 'Germany', '+49 30 123 456 78', 'berlin.mitte@joe.de', 'Lisa Mueller', 7, 52000, 85, true, NOW(), NOW()),
('Munich Marienplatz', 'Marienplatz 8', 'Munich', 'Germany', '+49 89 123 456 78', 'munich.marienplatz@joe.de', 'Thomas Weber', 6, 50000, 83, true, NOW(), NOW());

-- Insert Employees (using store IDs from the stores created above)
-- We'll need to get the actual store IDs after insertion, but for now we'll use placeholder logic

-- Copenhagen Central employees
INSERT INTO employee ("firstName", "lastName", email, phone, position, salary, "hireDate", "hoursWorked", "performanceScore", "isActive", "storeId", "createdAt", "updatedAt") VALUES
('Emma', 'Nielsen', 'emma.nielsen@joe.dk', '+45 50 12 34 56', 'Store Manager', 45000, '2023-01-15', 160, 98, true, (SELECT id FROM store WHERE name = 'Copenhagen Central'), NOW(), NOW()),
('Magnus', 'Hansen', 'magnus.hansen@joe.dk', '+45 50 23 45 67', 'Assistant Manager', 38000, '2023-02-20', 155, 94, true, (SELECT id FROM store WHERE name = 'Copenhagen Central'), NOW(), NOW()),
('Isabella', 'Pedersen', 'isabella.pedersen@joe.dk', '+45 50 34 56 78', 'Shift Leader', 32000, '2023-03-10', 150, 91, true, (SELECT id FROM store WHERE name = 'Copenhagen Central'), NOW(), NOW()),
('Viktor', 'Christensen', 'viktor.christensen@joe.dk', '+45 50 45 67 89', 'Barista', 28000, '2023-04-05', 140, 89, true, (SELECT id FROM store WHERE name = 'Copenhagen Central'), NOW(), NOW()),
('Alma', 'Johansen', 'alma.johansen@joe.dk', '+45 50 56 78 90', 'Barista', 28000, '2023-05-12', 145, 87, true, (SELECT id FROM store WHERE name = 'Copenhagen Central'), NOW(), NOW()),
('Oscar', 'Larsen', 'oscar.larsen@joe.dk', '+45 50 67 89 01', 'Barista', 27000, '2023-06-18', 135, 85, true, (SELECT id FROM store WHERE name = 'Copenhagen Central'), NOW(), NOW()),
('Frida', 'Møller', 'frida.moller@joe.dk', '+45 50 78 90 12', 'Barista', 29000, '2023-07-25', 148, 88, true, (SELECT id FROM store WHERE name = 'Copenhagen Central'), NOW(), NOW()),
('Noah', 'Poulsen', 'noah.poulsen@joe.dk', '+45 50 89 01 23', 'Barista', 26000, '2023-08-30', 130, 82, true, (SELECT id FROM store WHERE name = 'Copenhagen Central'), NOW(), NOW()),

-- London Shoreditch employees
('James', 'Smith', 'james.smith@joe.co.uk', '+44 77 1234 5678', 'Store Manager', 42000, '2023-03-20', 160, 96, true, (SELECT id FROM store WHERE name = 'London Shoreditch'), NOW(), NOW()),
('Emily', 'Johnson', 'emily.johnson@joe.co.uk', '+44 77 2345 6789', 'Assistant Manager', 36000, '2023-04-15', 155, 92, true, (SELECT id FROM store WHERE name = 'London Shoreditch'), NOW(), NOW()),
('Charlie', 'Williams', 'charlie.williams@joe.co.uk', '+44 77 3456 7890', 'Shift Leader', 30000, '2023-05-10', 150, 89, true, (SELECT id FROM store WHERE name = 'London Shoreditch'), NOW(), NOW()),
('Olivia', 'Brown', 'olivia.brown@joe.co.uk', '+44 77 4567 8901', 'Barista', 26000, '2023-06-05', 140, 87, true, (SELECT id FROM store WHERE name = 'London Shoreditch'), NOW(), NOW()),
('Harry', 'Jones', 'harry.jones@joe.co.uk', '+44 77 5678 9012', 'Barista', 26000, '2023-07-12', 145, 84, true, (SELECT id FROM store WHERE name = 'London Shoreditch'), NOW(), NOW()),
('Amelia', 'Garcia', 'amelia.garcia@joe.co.uk', '+44 77 6789 0123', 'Barista', 25000, '2023-08-18', 135, 82, true, (SELECT id FROM store WHERE name = 'London Shoreditch'), NOW(), NOW()),
('George', 'Martinez', 'george.martinez@joe.co.uk', '+44 77 7890 1234', 'Barista', 27000, '2023-09-25', 148, 86, true, (SELECT id FROM store WHERE name = 'London Shoreditch'), NOW(), NOW()),

-- NYC Manhattan employees
('Sarah', 'Connor', 'sarah.connor@joe.com', '+1 646 555 0123', 'Store Manager', 55000, '2023-02-10', 160, 93, true, (SELECT id FROM store WHERE name = 'NYC Manhattan'), NOW(), NOW()),
('Michael', 'Johnson', 'michael.johnson@joe.com', '+1 646 555 0234', 'Assistant Manager', 48000, '2023-03-15', 155, 94, true, (SELECT id FROM store WHERE name = 'NYC Manhattan'), NOW(), NOW()),
('Jessica', 'Davis', 'jessica.davis@joe.com', '+1 646 555 0345', 'Shift Leader', 42000, '2023-04-20', 150, 90, true, (SELECT id FROM store WHERE name = 'NYC Manhattan'), NOW(), NOW()),
('David', 'Wilson', 'david.wilson@joe.com', '+1 646 555 0456', 'Barista', 35000, '2023-05-25', 140, 88, true, (SELECT id FROM store WHERE name = 'NYC Manhattan'), NOW(), NOW()),
('Ashley', 'Taylor', 'ashley.taylor@joe.com', '+1 646 555 0567', 'Barista', 35000, '2023-06-30', 145, 86, true, (SELECT id FROM store WHERE name = 'NYC Manhattan'), NOW(), NOW()),
('Christopher', 'Anderson', 'christopher.anderson@joe.com', '+1 646 555 0678', 'Barista', 34000, '2023-07-05', 135, 84, true, (SELECT id FROM store WHERE name = 'NYC Manhattan'), NOW(), NOW()),
('Amanda', 'Thomas', 'amanda.thomas@joe.com', '+1 646 555 0789', 'Barista', 36000, '2023-08-10', 148, 87, true, (SELECT id FROM store WHERE name = 'NYC Manhattan'), NOW(), NOW()),
('Joshua', 'Jackson', 'joshua.jackson@joe.com', '+1 646 555 0890', 'Barista', 33000, '2023-09-15', 130, 83, true, (SELECT id FROM store WHERE name = 'NYC Manhattan'), NOW(), NOW()),
('Stephanie', 'White', 'stephanie.white@joe.com', '+1 646 555 0901', 'Barista', 37000, '2023-10-20', 152, 89, true, (SELECT id FROM store WHERE name = 'NYC Manhattan'), NOW(), NOW()),
('Daniel', 'Harris', 'daniel.harris@joe.com', '+1 646 555 1012', 'Barista', 32000, '2023-11-25', 125, 81, true, (SELECT id FROM store WHERE name = 'NYC Manhattan'), NOW(), NOW()),

-- Stockholm Gamla Stan employees
('Sofia', 'Andersson', 'sofia.andersson@joe.se', '+46 70 123 45 67', 'Store Manager', 41000, '2023-03-05', 160, 94, true, (SELECT id FROM store WHERE name = 'Stockholm Gamla Stan'), NOW(), NOW()),
('Erik', 'Johansson', 'erik.johansson@joe.se', '+46 70 234 56 78', 'Assistant Manager', 35000, '2023-04-10', 155, 91, true, (SELECT id FROM store WHERE name = 'Stockholm Gamla Stan'), NOW(), NOW()),
('Astrid', 'Karlsson', 'astrid.karlsson@joe.se', '+46 70 345 67 89', 'Shift Leader', 29000, '2023-05-15', 150, 88, true, (SELECT id FROM store WHERE name = 'Stockholm Gamla Stan'), NOW(), NOW()),
('Oliver', 'Nilsson', 'oliver.nilsson@joe.se', '+46 70 456 78 90', 'Barista', 25000, '2023-06-20', 140, 86, true, (SELECT id FROM store WHERE name = 'Stockholm Gamla Stan'), NOW(), NOW()),
('Elsa', 'Blomberg', 'elsa.blomberg@joe.se', '+46 70 567 89 01', 'Barista', 25000, '2023-07-25', 145, 84, true, (SELECT id FROM store WHERE name = 'Stockholm Gamla Stan'), NOW(), NOW()),
('Gustav', 'Lundberg', 'gustav.lundberg@joe.se', '+46 70 678 90 12', 'Barista', 24000, '2023-08-30', 135, 82, true, (SELECT id FROM store WHERE name = 'Stockholm Gamla Stan'), NOW(), NOW()),

-- Berlin Mitte employees
('Lisa', 'Mueller', 'lisa.mueller@joe.de', '+49 176 123 456 78', 'Store Manager', 39000, '2023-04-01', 160, 91, true, (SELECT id FROM store WHERE name = 'Berlin Mitte'), NOW(), NOW()),
('Max', 'Schmidt', 'max.schmidt@joe.de', '+49 176 234 567 89', 'Assistant Manager', 33000, '2023-05-06', 155, 88, true, (SELECT id FROM store WHERE name = 'Berlin Mitte'), NOW(), NOW()),
('Anna', 'Fischer', 'anna.fischer@joe.de', '+49 176 345 678 90', 'Shift Leader', 27000, '2023-06-11', 150, 85, true, (SELECT id FROM store WHERE name = 'Berlin Mitte'), NOW(), NOW()),
('Leon', 'Weber', 'leon.weber@joe.de', '+49 176 456 789 01', 'Barista', 23000, '2023-07-16', 140, 83, true, (SELECT id FROM store WHERE name = 'Berlin Mitte'), NOW(), NOW()),
('Mia', 'Wagner', 'mia.wagner@joe.de', '+49 176 567 890 12', 'Barista', 23000, '2023-08-21', 145, 81, true, (SELECT id FROM store WHERE name = 'Berlin Mitte'), NOW(), NOW()),
('Felix', 'Becker', 'felix.becker@joe.de', '+49 176 678 901 23', 'Barista', 22000, '2023-09-26', 135, 79, true, (SELECT id FROM store WHERE name = 'Berlin Mitte'), NOW(), NOW()),
('Lena', 'Schulz', 'lena.schulz@joe.de', '+49 176 789 012 34', 'Barista', 24000, '2023-10-31', 148, 82, true, (SELECT id FROM store WHERE name = 'Berlin Mitte'), NOW(), NOW());

-- Update store employee counts based on actual employees inserted
UPDATE store SET "employeeCount" = (
    SELECT COUNT(*) FROM employee WHERE employee."storeId" = store.id
); 