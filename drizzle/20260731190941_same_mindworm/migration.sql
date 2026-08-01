ALTER TABLE `games` ADD `owner_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `games_owner_id_idx` ON `games` (`owner_id`);