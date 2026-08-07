ALTER TABLE `clues` ADD `position` integer;--> statement-breakpoint
UPDATE clues
SET position = ABS(300 + RANDOM() % 3600);
CREATE UNIQUE INDEX `clues_category_id_position_idx` ON `clues` (`category_id`,`position`) WHERE "deleted_at" IS NULL;