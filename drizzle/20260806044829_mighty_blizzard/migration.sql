CREATE TABLE `verifications` (
	`id` text PRIMARY KEY,
	`categoryId` text,
	`clueId` text,
	`createdAt` text NOT NULL,
	`createdBy` text NOT NULL,
	`updatedAt` text,
	`updatedBy` text,
	`deletedAt` text,
	`deletedBy` text,
	CONSTRAINT `fk_verifications_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_verifications_clueId_clues_id_fk` FOREIGN KEY (`clueId`) REFERENCES `clues`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_verifications_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_verifications_updatedBy_users_id_fk` FOREIGN KEY (`updatedBy`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_verifications_deletedBy_users_id_fk` FOREIGN KEY (`deletedBy`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
ALTER TABLE `categories` ADD `last_verified_at` text;--> statement-breakpoint
ALTER TABLE `clues` ADD `last_verified_at` text;--> statement-breakpoint
CREATE INDEX `verifications_category_id_idx` ON `verifications` (`categoryId`);--> statement-breakpoint
CREATE INDEX `verifications_clue_id_idx` ON `verifications` (`clueId`);