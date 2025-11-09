-- AlterTable
ALTER TABLE `SiteConfig` ADD COLUMN `gambarInformasi` TEXT NULL,
    ADD COLUMN `gambarPartner` TEXT NULL,
    ADD COLUMN `gambarSlogan` TEXT NULL,
    ADD COLUMN `gambarStaff` TEXT NULL,
    ADD COLUMN `gambarTambahan` TEXT NULL,
    ADD COLUMN `gambarTeam` TEXT NULL,
    ADD COLUMN `informasiLayanan` TEXT NULL,
    ADD COLUMN `layananKami` TEXT NULL,
    ADD COLUMN `pelatihan` TEXT NULL,
    ADD COLUMN `pembelajaran` TEXT NULL,
    ADD COLUMN `penjaminanMutu` TEXT NULL;

-- CreateTable
CREATE TABLE `DataBuku` (
    `id` VARCHAR(191) NOT NULL,
    `judul` TEXT NOT NULL,
    `deskripsi` TEXT NULL,
    `gambar` TEXT NULL,
    `link` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DataBuku_order_idx`(`order`),
    INDEX `DataBuku_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataGaleri` (
    `id` VARCHAR(191) NOT NULL,
    `judul` TEXT NULL,
    `gambar` TEXT NOT NULL,
    `deskripsi` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DataGaleri_order_idx`(`order`),
    INDEX `DataGaleri_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TautanLayanan` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `gambar` TEXT NULL,
    `link` TEXT NOT NULL,
    `deskripsi` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TautanLayanan_order_idx`(`order`),
    INDEX `TautanLayanan_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
