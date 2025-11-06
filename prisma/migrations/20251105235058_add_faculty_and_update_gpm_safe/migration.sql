/*
  Warnings:

  - You are about to drop the column `facultyName` on the `QualityAssuranceGroup` table. All the data in the column will be lost.
  - You are about to drop the column `shortName` on the `QualityAssuranceGroup` table. All the data in the column will be lost.
  - Added the required column `facultyId` to the `QualityAssuranceGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `QualityAssuranceGroup` DROP COLUMN `facultyName`,
    DROP COLUMN `shortName`,
    ADD COLUMN `facultyId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Faculty` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(191) NULL,
    `code` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Faculty_name_key`(`name`),
    UNIQUE INDEX `Faculty_code_key`(`code`),
    INDEX `Faculty_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `QualityAssuranceGroup_facultyId_idx` ON `QualityAssuranceGroup`(`facultyId`);

-- AddForeignKey
ALTER TABLE `QualityAssuranceGroup` ADD CONSTRAINT `QualityAssuranceGroup_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
