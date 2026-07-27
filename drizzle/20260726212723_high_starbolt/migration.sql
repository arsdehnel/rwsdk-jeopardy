CREATE TABLE `categories` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`created_by` text NOT NULL,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	CONSTRAINT `fk_categories_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_categories_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_categories_deleted_by_users_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `clues` (
	`id` text PRIMARY KEY,
	`category_id` text NOT NULL,
	`text` text NOT NULL,
	`response` text NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`created_by` text,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	CONSTRAINT `fk_clues_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`),
	CONSTRAINT `fk_clues_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_clues_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_clues_deleted_by_users_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_idx` ON `categories` (`name`);--> statement-breakpoint
CREATE INDEX `clues_category_id_idx` ON `clues` (`category_id`);