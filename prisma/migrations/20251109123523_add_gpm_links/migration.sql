-- CreateTable
CREATE TABLE `GPMLink` (
    `id` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `description` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `GPMLink_groupId_order_idx`(`groupId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GPMLink` ADD CONSTRAINT `GPMLink_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `QualityAssuranceGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
