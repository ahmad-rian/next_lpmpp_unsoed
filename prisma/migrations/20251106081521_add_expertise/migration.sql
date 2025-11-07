-- CreateTable
CREATE TABLE `Expertise` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('FASILITATOR_PEKERTI', 'AUDITOR_SPMI', 'ASESOR_BKD') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Expertise_type_order_idx`(`type`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
