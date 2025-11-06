-- CreateTable
CREATE TABLE `Staff` (
    `id` VARCHAR(191) NOT NULL,
    `position` ENUM('SUB_COORDINATOR', 'GENERAL_STAFF', 'PROGRAM_DATA_INFO_STAFF', 'DRIVER', 'OFFICE_ASSISTANT') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `title` TEXT NULL,
    `photo` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Staff_position_order_idx`(`position`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
