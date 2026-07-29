PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_credentials` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`credential_id` text NOT NULL UNIQUE,
	`public_key` blob NOT NULL,
	`counter` integer DEFAULT 0 NOT NULL,
	`name` text,
	`last_used_at` text,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`created_by` text NOT NULL,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text,
	CONSTRAINT `fk_credentials_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_credentials_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_credentials_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_credentials_deleted_by_users_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_credentials`(`id`, `user_id`, `credential_id`, `public_key`, `counter`, `name`, `last_used_at`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) SELECT `id`, `user_id`, `credential_id`, `public_key`, `counter`, `name`, `last_used_at`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by` FROM `credentials`;--> statement-breakpoint
DROP TABLE `credentials`;--> statement-breakpoint
ALTER TABLE `__new_credentials` RENAME TO `credentials`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS `credentials_credential_id_idx`;--> statement-breakpoint
CREATE INDEX `credentials_user_id_idx` ON `credentials` (`user_id`);--> statement-breakpoint
CREATE INDEX `credentials_user_credential_idx` ON `credentials` (`user_id`,`credential_id`);