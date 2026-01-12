import { Metadata } from "next";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dokumen GPM Fakultas - LPMPP UNSOED",
  description: "Dokumen Gugus Penjaminan Mutu Fakultas UNSOED",
};

async function getGpmData() {
  try {
    const faculties = await prisma.faculty.findMany({
      where: {
        isActive: true,
      },
      include: {
        qualityAssuranceGroups: {
          where: {
            isActive: true,
          },
          include: {
            documents: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });
    return faculties;
  } catch (error) {
    console.error("Error fetching GPM data:", error);
    return [];
  }
}

export default async function GpmFakultasPage() {
  const faculties = await getGpmData();

  return (
    <div className="w-full px-4 pb-12">
      {/* Hero Header */}
      <div className="text-center mb-8 md:mb-12 space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          Dokumen GPM Fakultas
        </h1>
        <p className="text-base md:text-xl text-default-600 max-w-3xl mx-auto px-4">
          Gugus Penjaminan Mutu Fakultas
        </p>
        <p className="text-sm md:text-base text-default-500 max-w-2xl mx-auto px-4">
          Universitas Jenderal Soedirman
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {faculties.length > 0 ? (
          <div className="space-y-6">
            {faculties.map((faculty) => (
              <Card key={faculty.id}>
                <CardHeader className="flex gap-3 md:gap-4 p-4 md:p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-50 dark:bg-red-950/30">
                    <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <h2 className="text-xl md:text-2xl font-bold">
                      {faculty.name}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip size="sm" variant="flat" color="primary">
                        {faculty.shortName || "Fakultas"}
                      </Chip>
                      {faculty.qualityAssuranceGroups.length > 0 && (
                        <span className="text-xs text-default-500">
                          {faculty.qualityAssuranceGroups.length} GPM Tersedia
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="p-4 md:p-6">
                  {faculty.qualityAssuranceGroups.length > 0 ? (
                    <div className="space-y-6">
                      {faculty.qualityAssuranceGroups.map((gpm) => (
                        <div key={gpm.id} className="space-y-4">
                          {/* GPM Info */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              {gpm.name || `Gugus Penjaminan Mutu ${faculty.name}`}
                            </h3>
                            {gpm.ketuaGpm && (
                              <p className="text-sm text-default-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                <span><strong>Ketua GPM:</strong> {gpm.ketuaGpm}</span>
                              </p>
                            )}
                            {gpm.description && (
                              <p className="text-sm text-default-600 mb-3">
                                {gpm.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-3">
                              {gpm.contactInfo && (
                                <Link
                                  href={`mailto:${gpm.contactInfo}`}
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                  </svg>
                                  <span>Kontak: {gpm.contactInfo}</span>
                                </Link>
                              )}
                              
                              {gpm.directUrl && (
                                <Button
                                  as={Link}
                                  href={gpm.directUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  color="danger"
                                  variant="flat"
                                  size="sm"
                                  startContent={
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                  }
                                >
                                  Kunjungi Halaman GPM
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Documents */}
                          {gpm.documents.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-default-700">
                                Dokumen GPM:
                              </h4>
                              <div className="grid gap-3">
                                {gpm.documents.map((doc) => (
                                  <Card
                                    key={doc.id}
                                    isPressable
                                    isHoverable
                                    className="border border-default-200"
                                  >
                                    <CardBody className="p-4">
                                      <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">
                                              {doc.title}
                                            </p>
                                            {doc.fileName && (
                                              <p className="text-xs text-default-500 truncate">
                                                {doc.fileName}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        <Button
                                          as={Link}
                                          href={doc.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          size="sm"
                                          color="primary"
                                          variant="flat"
                                          isIconOnly
                                        >
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                          </svg>
                                        </Button>
                                      </div>
                                    </CardBody>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-default-100 mb-4">
                        <svg className="w-8 h-8 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Belum Ada GPM
                      </h3>
                      <p className="text-sm text-default-500">
                        Gugus Penjaminan Mutu untuk fakultas ini belum tersedia.
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-default-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-default-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Belum Ada Data Fakultas
                  </h3>
                  <p className="text-default-500">
                    Data fakultas dan GPM belum tersedia saat ini.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}