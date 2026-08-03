-- One-time local fix for invalid UUIDs in seed data.
-- Run with: npx wrangler d1 execute <DB_NAME> --local --file=fix-local-seed-uuids.sql
-- Safe to delete after running.

PRAGMA foreign_keys = OFF;

-- -------------------------------------------------------------------------
-- 3 category IDs with invalid variant bits (4th group must start with 8/9/a/b)
-- -------------------------------------------------------------------------
UPDATE categories SET id = '5c8e2b9f-4a1d-4e6c-8f3b-9d5a2c8e1b4f' WHERE id = '5c8e2b9f-4a1d-4e6c-7f3b-9d5a2c8e1b4f'; -- Growing Up Healthy
UPDATE categories SET id = '1e4b7d2f-9c3a-4e8b-9f1d-3a5c8e2b7f4d' WHERE id = '1e4b7d2f-9c3a-4e8b-6f1d-3a5c8e2b7f4d'; -- Life Skills 101
UPDATE categories SET id = '9b5e1f7d-2c4a-4b8e-8d3f-7a9c5b2e4f1d' WHERE id = '9b5e1f7d-2c4a-4b8e-6d3f-7a9c5b2e4f1d'; -- Making Good Choices

-- Cascade to clues
UPDATE clues SET category_id = '5c8e2b9f-4a1d-4e6c-8f3b-9d5a2c8e1b4f' WHERE category_id = '5c8e2b9f-4a1d-4e6c-7f3b-9d5a2c8e1b4f';
UPDATE clues SET category_id = '1e4b7d2f-9c3a-4e8b-9f1d-3a5c8e2b7f4d' WHERE category_id = '1e4b7d2f-9c3a-4e8b-6f1d-3a5c8e2b7f4d';
UPDATE clues SET category_id = '9b5e1f7d-2c4a-4b8e-8d3f-7a9c5b2e4f1d' WHERE category_id = '9b5e1f7d-2c4a-4b8e-6d3f-7a9c5b2e4f1d';

-- Cascade to game_stage_categories
UPDATE game_stage_categories SET category_id = '5c8e2b9f-4a1d-4e6c-8f3b-9d5a2c8e1b4f' WHERE category_id = '5c8e2b9f-4a1d-4e6c-7f3b-9d5a2c8e1b4f';
UPDATE game_stage_categories SET category_id = '1e4b7d2f-9c3a-4e8b-9f1d-3a5c8e2b7f4d' WHERE category_id = '1e4b7d2f-9c3a-4e8b-6f1d-3a5c8e2b7f4d';
UPDATE game_stage_categories SET category_id = '9b5e1f7d-2c4a-4b8e-8d3f-7a9c5b2e4f1d' WHERE category_id = '9b5e1f7d-2c4a-4b8e-6d3f-7a9c5b2e4f1d';

-- -------------------------------------------------------------------------
-- 17 clue IDs with invalid variant bits — replace with SQLite-generated UUIDs
-- -------------------------------------------------------------------------
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '6c2f8e4b-9a1d-4f3c-7e8b-4a2d6f9c1e3b';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '4f9a2c6e-8b1d-4f7a-5c3e-1d4b9f2a6c8e';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '9c3e7b1f-5a2d-4c8e-4b6f-7a9d3c1e5b2f';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '1d5b8e4a-6f3c-4d2b-7e9a-5c1f8d4b6e3a';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '8f2a5c1e-4b9d-4a7f-3c6e-9d1b4f7a2c5e';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '5d1f8b3e-2c6a-4d9f-7b4e-1a3c5f8d2b6e';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '9a4c2e7f-1b5d-4a8c-6f3b-7e2d9a4c1f5b';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '4c8f2b6e-1a5d-4c9f-3e7b-6d4a2c8f5b1e';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '6f3c7e2b-4a8d-4f1c-5b9e-8d6a3f2c7e4b';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '7a1d6c9e-3f5b-4a4d-2c8e-5b7f1a3d6c9e';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '8a4c2e7f-3b6d-4a1c-5e9b-7f2d8a4c3e6b';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '5f1d9b3e-6c4a-4f8d-2b7e-9a5c1f3d6b4e';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '2e6b4f8a-9c1d-4e5b-7f3a-4c2d6e9b1f5a';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '7a2e5c8f-4b1d-4e9a-6c3f-8d2b5e7a1c4f';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '1f4d8b2e-9c6a-4f3d-7e1b-5a3c1f8d4b9e';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '3f8c2e6b-1a4d-4c7f-5e9b-8d1a3f6c2e4b';
UPDATE clues SET id = lower(hex(randomblob(4)))||'-'||lower(hex(randomblob(2)))||'-4'||substr(lower(hex(randomblob(2))),2)||'-'||substr('89ab',abs(random())%4+1,1)||substr(lower(hex(randomblob(2))),2)||'-'||lower(hex(randomblob(6))) WHERE id = '8d1a4f7c-2e5b-4d9a-3f6c-1b8e4d2a7f5c';

PRAGMA foreign_keys = ON;
