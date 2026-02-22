-- Migration: Rename ExpertiseType enum values and add new ones
-- This script should be run AFTER the Prisma migration adds the new enum values
-- but BEFORE removing the old enum values.

-- Step 1: Add new enum values (Prisma migration handles this)
-- ALTER TABLE `Expertise` MODIFY COLUMN `type` ENUM(...new values...);

-- Step 2: Migrate existing data from old type values to new ones
UPDATE `Expertise` SET `type` = 'PELATIHAN_PEKERTI_AA' WHERE `type` = 'FASILITATOR_PEKERTI';
UPDATE `Expertise` SET `type` = 'PELATIHAN_SPMI_AMI' WHERE `type` = 'AUDITOR_SPMI';
UPDATE `Expertise` SET `type` = 'EVALUASI_BKD' WHERE `type` = 'ASESOR_BKD';
UPDATE `Expertise` SET `type` = 'SERTIFIKASI_DOSEN' WHERE `type` = 'ASESOR_SERDOS';

-- Verify migration
SELECT `type`, COUNT(*) as count FROM `Expertise` GROUP BY `type`;
