INSERT INTO users(name, email, password)
VALUES
('Eva Stanley','sebatianguerra@ymail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louisa Meyer','jacksonrose@hotmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dominic Parks','victoriablackwell@outlook.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES
(1, 'The Bodega', 'description', 'https://fakefake1', 'https://fakefake', 1000, 10, 10, 10, 'Canada', '123 fake street', 'Toronto', 'Ontario','L7A3G6', TRUE),
(2, 'The shizz', 'description', 'https://fakefake2', 'https://fakefake', 100, 10, 10, 10, 'Canada', '1234 fake street', 'Toronto', 'Ontario','L2A7G6', TRUE),
(3, 'The place', 'description', 'https://fakefake3', 'https://fakefake', 4000, 10, 10, 10, 'Canada', '12345 fake street', 'Toronto', 'Ontario','L7B3G5', TRUE);

INSERT INTO reservations(guest_id, property_id, start_date, end_date) 
VALUES 
(1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews(guest_id, property_id, reservation_id, rating, message)
VALUES
(1, 1, 1, 1, 'message'),
(2, 2, 2, 2, 'message'),
(3, 3, 3, 3, 'message');

