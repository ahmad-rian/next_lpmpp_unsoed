/*
  Warnings:

  - You are about to drop the `SpmiContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `SpmiContent`;

-- CreateTable
CREATE TABLE `spmi_about` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'SPM Unsoed',
    `tujuan` LONGTEXT NOT NULL,
    `fungsi` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
