CREATE TABLE `game_contestants` (
	`id` text PRIMARY KEY,
	`game_id` text NOT NULL,
	`session_id` text NOT NULL,
	`user_id` text,
	`score` integer,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`created_by` text NOT NULL,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	CONSTRAINT `fk_game_contestants_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`),
	CONSTRAINT `fk_game_contestants_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_game_contestants_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_game_contestants_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_game_contestants_deleted_by_users_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
ALTER TABLE `games` ADD `display_session_id` text;--> statement-breakpoint
ALTER TABLE `games` ADD `host_user_id` text REFERENCES users(id);--> statement-breakpoint
CREATE INDEX `game_contestants_game_id_idx` ON `game_contestants` (`game_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `game_contestants_game_id_session_id_idx` ON `game_contestants` (`game_id`,`session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `game_contestants_game_id_user_id_idx` ON `game_contestants` (`game_id`,`user_id`);