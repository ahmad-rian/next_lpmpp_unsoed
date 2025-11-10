import { Metadata } from "next";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
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
            links: {
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
      <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          Dokumen GPM Fakultas
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Gugus Penjaminan Mutu Fakultas
        </p>
        <p className="text-sm md:text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto px-4">
          Universitas Jenderal Soedirman
        </p>
        <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6"></div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {faculties.length > 0 ? (
          <div className="space-y-8">
            {faculties.map((faculty) => (
              <Card key={faculty.id} className="shadow-md">
                <CardHeader className="flex gap-3 md:gap-4 p-4 md:p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {faculty.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="primary">
                        {faculty.shortName || "Fakultas"}
                      </Chip>
                      <span className="text-xs text-gray-500">
                        {faculty.qualityAssuranceGroups.length} GPM
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="p-4 md:p-6">
                  {faculty.qualityAssuranceGroups.length > 0 ? (
                    <div className="space-y-6">
                      {faculty.qualityAssuranceGroups.map((gpm) => (
                        <div key={gpm.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Gugus Penjaminan Mutu {faculty.name}
                            </h3>
                            {gpm.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {gpm.description}
                              </p>
                            )}
                            {gpm.contactInfo && (
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                Kontak: {gpm.contactInfo}
                              </p>
                            )}
                            {gpm.directUrl && (
                              <div className="mt-3">
                                <a
                                  href={gpm.directUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                  </svg>
                                  Kunjungi Halaman GPM
                                </a>
                              </div>
                            )}
                          </div>

                          {gpm.links.length > 0 ? (
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Link GPM:
                              </h4>
                              <div className="grid gap-3">
                                {gpm.links.map((link) => (
                                  <div
                                    key={link.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="flex items-center justify-center w-8 h-8 rounded bg-red-100 dark:bg-red-900/20">
                                        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                        </svg>
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                          {link.title}
                                        </p>
                                        {link.description && (
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {link.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <Link
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                      </svg>
                                      Buka
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <div className="text-gray-400 mb-2">
                                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                </svg>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Belum ada link GPM untuk fakultas ini.
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Belum Ada GPM
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Gugus Penjaminan Mutu untuk fakultas ini belum tersedia.
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-md">
            <CardBody className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Belum Ada Data Fakultas
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
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
