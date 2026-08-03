CREATE TABLE `game_stage_categories` (
	`id` text PRIMARY KEY,
	`game_stage_id` text NOT NULL,
	`category_id` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`created_by` text NOT NULL,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	CONSTRAINT `fk_game_stage_categories_game_stage_id_game_stages_id_fk` FOREIGN KEY (`game_stage_id`) REFERENCES `game_stages`(`id`),
	CONSTRAINT `fk_game_stage_categories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`),
	CONSTRAINT `fk_game_stage_categories_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_game_stage_categories_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_game_stage_categories_deleted_by_users_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_stages` (
	`id` text PRIMARY KEY,
	`game_id` text NOT NULL,
	`stage` text DEFAULT 'SINGLE' NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`created_by` text NOT NULL,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	CONSTRAINT `fk_game_stages_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`),
	CONSTRAINT `fk_game_stages_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_game_stages_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_game_stages_deleted_by_users_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` text PRIMARY KEY,
	`phase` text DEFAULT 'SETUP' NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`created_by` text NOT NULL,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	CONSTRAINT `fk_games_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_games_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_games_deleted_by_users_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE INDEX `game_stage_categories_game_stage_id_idx` ON `game_stage_categories` (`game_stage_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `game_stage_categories_game_stage_id_category_id_idx` ON `game_stage_categories` (`game_stage_id`,`category_id`) WHERE "deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `game_stage_categories_game_stage_id_position_idx` ON `game_stage_categories` (`game_stage_id`,`position`) WHERE "deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX `game_stages_game_id_idx` ON `game_stages` (`game_id`);