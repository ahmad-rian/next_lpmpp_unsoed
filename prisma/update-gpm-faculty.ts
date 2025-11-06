import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExistingGPM() {
  try {
    // Get all GPM yang belum punya facultyId
    const groups = await prisma.qualityAssuranceGroup.findMany({
      where: {
        facultyId: null,
      },
    });

    console.log(`Found ${groups.length} GPM records to update`);

    for (const group of groups) {
      // Cari fakultas berdasarkan nama
      const faculty = await prisma.faculty.findFirst({
        where: {
          OR: [
            { name: { contains: group.facultyName || '' } },
            { shortName: group.shortName || undefined },
          ],
        },
      });

      if (faculty) {
        await prisma.qualityAssuranceGroup.update({
          where: { id: group.id },
          data: { facultyId: faculty.id },
        });
        console.log(`✓ Updated GPM "${group.facultyName}" with faculty ID: ${faculty.name}`);
      } else {
        console.log(`⚠ No matching faculty found for: ${group.facultyName} (${group.shortName})`);
      }
    }

    console.log('\nUpdate complete!');
  } catch (error) {
    console.error('Error updating GPM:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingGPM();
