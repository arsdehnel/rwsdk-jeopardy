PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_clues` (
	`id` text PRIMARY KEY,
	`category_id` text NOT NULL,
	`text` text NOT NULL,
	`response` text NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`created_by` text NOT NULL,
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
INSERT INTO `__new_clues`(`id`, `category_id`, `text`, `response`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) SELECT `id`, `category_id`, `text`, `response`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by` FROM `clues`;--> statement-breakpoint
DROP TABLE `clues`;--> statement-breakpoint
ALTER TABLE `__new_clues` RENAME TO `clues`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `clues_category_id_idx` ON `clues` (`category_id`);