/*
  Warnings:

  - You are about to drop the column `moto` on the `SiteConfig` table. All the data in the column will be lost.
  - You are about to drop the `GPMLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spmi_about` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GPMLink` DROP FOREIGN KEY `GPMLink_groupId_fkey`;

-- AlterTable
ALTER TABLE `QualityAssuranceGroup` ADD COLUMN `directUrl` TEXT NULL;

-- AlterTable
ALTER TABLE `SiteConfig` DROP COLUMN `moto`;

-- DropTable
DROP TABLE `GPMLink`;

-- DropTable
DROP TABLE `spmi_about`;

-- CreateTable
CREATE TABLE `SpmiContent` (
    `id` VARCHAR(191) NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SpmiContent_section_key`(`section`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
