-- Custom SQL migration file, put your code below! --

INSERT OR IGNORE INTO users (id, username, role) VALUES ('5ba3314a-d1c4-424e-b64e-48517c1ce045', 'seed', 'ADMIN');
--> statement-breakpoint

INSERT OR IGNORE INTO categories (id, name, created_by) VALUES ('7f3a9c2e-1b4d-4e8f-a6c3-9d2b5e7f1a4c', 'Animal Kingdom', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint
INSERT OR IGNORE INTO clues (id, category_id, text, response, created_by) VALUES
  ('2d8b4f1e-7c3a-4b9d-8e2f-5a1c6d3b9e7f', '7f3a9c2e-1b4d-4e8f-a6c3-9d2b5e7f1a4c', 'This is the only mammal capable of true flight.', 'What is a bat?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('9e1c5a3f-4d7b-4e2a-b8f3-6c9d1e4a7b2c', '7f3a9c2e-1b4d-4e8f-a6c3-9d2b5e7f1a4c', 'This animal can sleep standing up and only needs about 3 hours of sleep per day.', 'What is a horse?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('4a7f2d9c-8b1e-4c6a-9f3d-2e5b8c1f4a7d', '7f3a9c2e-1b4d-4e8f-a6c3-9d2b5e7f1a4c', 'This bird is the fastest animal on Earth, reaching speeds over 240 mph when diving.', 'What is a peregrine falcon?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('b3e6c1a8-5f2d-4b7e-8c4a-1d9f3b6e2c5a', '7f3a9c2e-1b4d-4e8f-a6c3-9d2b5e7f1a4c', 'This marine animal has three hearts and blue blood.', 'What is an octopus?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('6c2f8e4b-9a1d-4f3c-7e8b-4a2d6f9c1e3b', '7f3a9c2e-1b4d-4e8f-a6c3-9d2b5e7f1a4c', 'This is the largest living land animal, weighing up to 14,000 pounds.', 'What is an elephant?', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint

INSERT OR IGNORE INTO categories (id, name, created_by) VALUES ('5c8e2b9f-4a1d-4e6c-7f3b-9d5a2c8e1b4f', 'Growing Up Healthy', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint
INSERT OR IGNORE INTO clues (id, category_id, text, response, created_by) VALUES
  ('2a6f9c3e-7b4d-4a1f-8e5c-3d9b2a6f4c7e', '5c8e2b9f-4a1d-4e6c-7f3b-9d5a2c8e1b4f', 'You should shower and use deodorant every day, especially after this activity that makes you sweaty.', 'What is exercise?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('7e1b5d8a-3c6f-4e2b-9a4d-6f1c7e3b5d2a', '5c8e2b9f-4a1d-4e6c-7f3b-9d5a2c8e1b4f', 'During puberty, your body produces more of these, which is why washing your face twice daily helps prevent acne.', 'What are oils?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('4f9a2c6e-8b1d-4f7a-5c3e-1d4b9f2a6c8e', '5c8e2b9f-4a1d-4e6c-7f3b-9d5a2c8e1b4f', 'This is the minimum number of hours of sleep that teens need each night for proper growth and brain development.', 'What is 8-10 hours?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('9c3e7b1f-5a2d-4c8e-4b6f-7a9d3c1e5b2f', '5c8e2b9f-4a1d-4e6c-7f3b-9d5a2c8e1b4f', 'A healthy relationship involves this quality where both people feel safe to share their thoughts and feelings honestly.', 'What is communication?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('1d5b8e4a-6f3c-4d2b-7e9a-5c1f8d4b6e3a', '5c8e2b9f-4a1d-4e6c-7f3b-9d5a2c8e1b4f', 'If a friend pressures you to do something that makes you uncomfortable, this two-letter word is a complete sentence.', 'What is no?', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint

INSERT OR IGNORE INTO categories (id, name, created_by) VALUES ('1e4b7d2f-9c3a-4e8b-6f1d-3a5c8e2b7f4d', 'Life Skills 101', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint
INSERT OR IGNORE INTO clues (id, category_id, text, response, created_by) VALUES
  ('8f2a5c1e-4b9d-4a7f-3c6e-9d1b4f7a2c5e', '1e4b7d2f-9c3a-4e8b-6f1d-3a5c8e2b7f4d', 'This is what you should do with 10-20% of any money you earn before spending on wants.', 'What is save it?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('3b6e9a4c-7f1d-4c2b-8e5a-2d7f3b6e9a1c', '1e4b7d2f-9c3a-4e8b-6f1d-3a5c8e2b7f4d', 'When you start driving, this is the one thing you should never do while behind the wheel, even at red lights.', 'What is use your phone?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('5d1f8b3e-2c6a-4d9f-7b4e-1a3c5f8d2b6e', '1e4b7d2f-9c3a-4e8b-6f1d-3a5c8e2b7f4d', 'This financial tool helps you track income and expenses so you don''t spend more than you have.', 'What is a budget?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('9a4c2e7f-1b5d-4a8c-6f3b-7e2d9a4c1f5b', '1e4b7d2f-9c3a-4e8b-6f1d-3a5c8e2b7f4d', 'When driving with friends in the car, you''re responsible for their safety, which is why this phrase means you can always say no to distractions.', 'What is my car, my rules?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('2c7f4b9e-6a1d-4f5c-8b3e-4d2a7f1c9b6e', '1e4b7d2f-9c3a-4e8b-6f1d-3a5c8e2b7f4d', 'Checking on a friend who seems down or helping a family member with chores without being asked shows this important quality.', 'What is empathy?', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint

INSERT OR IGNORE INTO categories (id, name, created_by) VALUES ('9b5e1f7d-2c4a-4b8e-6d3f-7a9c5b2e4f1d', 'Making Good Choices', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint
INSERT OR IGNORE INTO clues (id, category_id, text, response, created_by) VALUES
  ('4c8f2b6e-1a5d-4c9f-3e7b-6d4a2c8f5b1e', '9b5e1f7d-2c4a-4b8e-6d3f-7a9c5b2e4f1d', 'Before posting a photo or comment online, ask yourself if you would want this to still be visible in this many years.', 'What is 10 years?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('1e5a9d3f-7b2c-4e6a-8f4d-3c1b5e9a2d7f', '9b5e1f7d-2c4a-4b8e-6d3f-7a9c5b2e4f1d', 'If you make a mistake or hurt someone, this is the first step to making things right.', 'What is apologize?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('6f3c7e2b-4a8d-4f1c-5b9e-8d6a3f2c7e4b', '9b5e1f7d-2c4a-4b8e-6d3f-7a9c5b2e4f1d', 'This is what you should do if you see someone being bullied, even if you''re not the target.', 'What is speak up or tell an adult?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('2b8e4a7f-6c1d-4b3e-9a5f-1c2d8b4e7a6f', '9b5e1f7d-2c4a-4b8e-6d3f-7a9c5b2e4f1d', 'When you''re feeling peer pressure to do something risky, calling this person to pick you up is always the right choice.', 'What is a parent or trusted adult?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('7a1d6c9e-3f5b-4a4d-2c8e-5b7f1a3d6c9e', '9b5e1f7d-2c4a-4b8e-6d3f-7a9c5b2e4f1d', 'Before believing or sharing something you see online, you should always do this first to check if it''s true.', 'What is verify it or fact-check?', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint

INSERT OR IGNORE INTO categories (id, name, created_by) VALUES ('6e2f9a4c-1b7d-4e3f-8c5a-4b6d2e9f1a7c', 'Natural Wonders', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint
INSERT OR IGNORE INTO clues (id, category_id, text, response, created_by) VALUES
  ('3b7e1c5f-8a2d-4b6e-9f4c-2d7a3b1e5c8f', '6e2f9a4c-1b7d-4e3f-8c5a-4b6d2e9f1a7c', 'This natural light display is caused by solar particles colliding with Earth''s atmosphere, visible near the poles.', 'What is the Aurora Borealis?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('8a4c2e7f-3b6d-4a1c-5e9b-7f2d8a4c3e6b', '6e2f9a4c-1b7d-4e3f-8c5a-4b6d2e9f1a7c', 'This is the deepest point in Earth''s oceans, located in the Pacific at nearly 36,000 feet deep.', 'What is the Mariana Trench?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('5f1d9b3e-6c4a-4f8d-2b7e-9a5c1f3d6b4e', '6e2f9a4c-1b7d-4e3f-8c5a-4b6d2e9f1a7c', 'This coral reef system off the coast of Australia is the largest living structure on Earth.', 'What is the Great Barrier Reef?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('2e6b4f8a-9c1d-4e5b-7f3a-4c2d6e9b1f5a', '6e2f9a4c-1b7d-4e3f-8c5a-4b6d2e9f1a7c', 'This national park in Wyoming is home to over half of the world''s geysers, including Old Faithful.', 'What is Yellowstone National Park?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('7d3a8c1e-4f6b-4d2a-9e5c-1b7f3d8a4c6e', '6e2f9a4c-1b7d-4e3f-8c5a-4b6d2e9f1a7c', 'This waterfall on the border of Zambia and Zimbabwe is considered one of the Seven Natural Wonders.', 'What is Victoria Falls?', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint

INSERT OR IGNORE INTO categories (id, name, created_by) VALUES ('4e9b1d6f-3c7a-4b2e-8f5d-1a4c9e3b7f2d', 'World Geography', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
--> statement-breakpoint
INSERT OR IGNORE INTO clues (id, category_id, text, response, created_by) VALUES
  ('7a2e5c8f-4b1d-4e9a-6c3f-8d2b5e7a1c4f', '4e9b1d6f-3c7a-4b2e-8f5d-1a4c9e3b7f2d', 'This is the longest river in the world, flowing through 11 countries in Africa.', 'What is the Nile River?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('1f4d8b2e-9c6a-4f3d-7e1b-5a3c1f8d4b9e', '4e9b1d6f-3c7a-4b2e-8f5d-1a4c9e3b7f2d', 'This is the only continent that is also a country.', 'What is Australia?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('6b3e7a1c-5f2d-4b8e-9c4a-2d6f3b1e7a5c', '4e9b1d6f-3c7a-4b2e-8f5d-1a4c9e3b7f2d', 'The Ring of Fire, known for earthquakes and volcanoes, circles this ocean.', 'What is the Pacific Ocean?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('3f8c2e6b-1a4d-4c7f-5e9b-8d1a3f6c2e4b', '4e9b1d6f-3c7a-4b2e-8f5d-1a4c9e3b7f2d', 'This mountain range separates Europe from Asia and runs through Russia.', 'What are the Ural Mountains?', '5ba3314a-d1c4-424e-b64e-48517c1ce045'),
  ('8d1a4f7c-2e5b-4d9a-3f6c-1b8e4d2a7f5c', '4e9b1d6f-3c7a-4b2e-8f5d-1a4c9e3b7f2d', 'This desert is the largest hot desert in the world, covering much of North Africa.', 'What is the Sahara Desert?', '5ba3314a-d1c4-424e-b64e-48517c1ce045');
