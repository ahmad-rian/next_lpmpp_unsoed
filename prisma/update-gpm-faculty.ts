import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExistingGPM() {
  try {
    // This script is now obsolete since facultyId is required on QualityAssuranceGroup
    // Kept for backwards compatibility with the prisma config
    console.log('Migration script is no longer needed - facultyId is now a required field');
    console.log('No updates necessary.');
  } catch (error) {
    console.error('Error updating GPM:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingGPM();
