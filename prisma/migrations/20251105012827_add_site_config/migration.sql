-- CreateTable
CREATE TABLE `SiteConfig` (
    `id` VARCHAR(191) NOT NULL,
    `logoUnsoed` TEXT NULL,
    `logoApp` TEXT NULL,
    `siteName` VARCHAR(191) NOT NULL DEFAULT 'LPMPP UNSOED',
    `visi` TEXT NULL,
    `misi` TEXT NULL,
    `tugas` TEXT NULL,
    `fungsi` TEXT NULL,
    `alamat` TEXT NULL,
    `email` VARCHAR(191) NULL,
    `instagramUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
