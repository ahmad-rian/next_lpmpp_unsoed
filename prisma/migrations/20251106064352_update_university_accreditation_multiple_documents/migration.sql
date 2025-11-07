-- CreateTable
CREATE TABLE `InternationalAccreditation` (
    `id` VARCHAR(191) NOT NULL,
    `facultyName` VARCHAR(191) NOT NULL,
    `programName` VARCHAR(191) NOT NULL,
    `agency` TEXT NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `InternationalAccreditation_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudyProgramAccreditation` (
    `id` VARCHAR(191) NOT NULL,
    `programName` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `skNumber` VARCHAR(191) NULL,
    `skYear` INTEGER NULL,
    `rating` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StudyProgramAccreditation_level_order_idx`(`level`, `order`),
    INDEX `StudyProgramAccreditation_rating_idx`(`rating`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UniversityAccreditation` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `imageUrl` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UniversityAccreditationDocument` (
    `id` VARCHAR(191) NOT NULL,
    `accreditationId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `documentUrl` TEXT NOT NULL,
    `documentName` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UniversityAccreditationDocument_accreditationId_order_idx`(`accreditationId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UniversityAccreditationDocument` ADD CONSTRAINT `UniversityAccreditationDocument_accreditationId_fkey` FOREIGN KEY (`accreditationId`) REFERENCES `UniversityAccreditation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
