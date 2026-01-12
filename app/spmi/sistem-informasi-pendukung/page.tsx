import { Metadata } from "next";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sistem Informasi Pendukung SPMI - LPMPP UNSOED",
  description: "Daftar sistem informasi yang mendukung Sistem Penjaminan Mutu Internal UNSOED",
};

const ComputerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

async function getSystems() {
  try {
    const systems = await prisma.spmiInformationSystem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return systems;
  } catch (error) {
    console.error("Error fetching systems:", error);
    return [];
  }
}

// Get unique categories from systems
function getCategories(systems: any[]) {
  const categorySet = new Set(systems.map(s => s.category).filter(Boolean));
  return Array.from(categorySet) as string[];
}

export default async function SistemInformasiPage() {
  const systems = await getSystems();
  const categories = getCategories(systems);

  return (
    <div className="w-full px-4 pb-12">
      {/* Hero Header */}
      <div className="text-center mb-8 md:mb-12 space-y-3">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
            <ComputerIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          Sistem Informasi Pendukung SPMI
        </h1>
        <p className="text-base md:text-xl text-default-600 max-w-3xl mx-auto px-4">
          Daftar sistem informasi yang mendukung Sistem Penjaminan Mutu Internal
        </p>
        <p className="text-sm md:text-base text-default-500 max-w-2xl mx-auto px-4">
          Universitas Jenderal Soedirman
        </p>
      </div>

      {/* Statistics */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-red-500">
            <CardBody className="p-4">
              <p className="text-xs text-default-500">Total Sistem</p>
              <p className="text-3xl font-bold text-red-600">{systems.length}</p>
            </CardBody>
          </Card>
          {categories.slice(0, 3).map(cat => (
            <Card key={cat} className="border-l-4 border-blue-500">
              <CardBody className="p-4">
                <p className="text-xs text-default-500">{cat}</p>
                <p className="text-3xl font-bold text-blue-600">
                  {systems.filter(s => s.category === cat).length}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Systems Grid */}
      <div className="max-w-6xl mx-auto">
        {systems.length > 0 ? (
          <>
            {/* Group by category */}
            {categories.length > 0 ? (
              <div className="space-y-8">
                {categories.map(category => (
                  <div key={category}>
                    <h2 className="text-xl font-semibold mb-4 text-default-800 flex items-center gap-2">
                      <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                      {category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {systems
                        .filter(s => s.category === category)
                        .map(system => (
                          <Card
                            key={system.id}
                            className="hover:shadow-lg transition-shadow duration-200 border border-default-200"
                          >
                            <CardBody className="p-5">
                              <div className="flex items-start gap-4">
                                {/* Logo */}
                                <div className="flex-shrink-0">
                                  {system.logoUrl ? (
                                    <div className="w-16 h-16 relative rounded-xl overflow-hidden border border-default-200 bg-white">
                                      <Image
                                        src={system.logoUrl}
                                        alt={system.name}
                                        fill
                                        className="object-contain p-1"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-16 h-16 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                                      <ComputerIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                                    </div>
                                  )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h3 className="font-semibold text-default-900 line-clamp-1">
                                        {system.name}
                                      </h3>
                                      {system.shortName && (
                                        <p className="text-xs text-default-500">
                                          ({system.shortName})
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {system.description && (
                                    <p className="text-sm text-default-600 mt-2 line-clamp-2">
                                      {system.description}
                                    </p>
                                  )}

                                  {system.websiteUrl && (
                                    <Button
                                      as={Link}
                                      href={system.websiteUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      size="sm"
                                      color="danger"
                                      variant="flat"
                                      className="mt-3"
                                      startContent={<ExternalLinkIcon className="w-4 h-4" />}
                                    >
                                      Kunjungi
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}

                {/* Systems without category */}
                {systems.filter(s => !s.category).length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-default-800 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gray-500 rounded-full"></div>
                      Lainnya
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {systems
                        .filter(s => !s.category)
                        .map(system => (
                          <Card
                            key={system.id}
                            className="hover:shadow-lg transition-shadow duration-200 border border-default-200"
                          >
                            <CardBody className="p-5">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  {system.logoUrl ? (
                                    <div className="w-16 h-16 relative rounded-xl overflow-hidden border border-default-200 bg-white">
                                      <Image
                                        src={system.logoUrl}
                                        alt={system.name}
                                        fill
                                        className="object-contain p-1"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-16 h-16 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                                      <ComputerIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-default-900 line-clamp-1">
                                    {system.name}
                                  </h3>
                                  {system.shortName && (
                                    <p className="text-xs text-default-500">
                                      ({system.shortName})
                                    </p>
                                  )}
                                  {system.description && (
                                    <p className="text-sm text-default-600 mt-2 line-clamp-2">
                                      {system.description}
                                    </p>
                                  )}
                                  {system.websiteUrl && (
                                    <Button
                                      as={Link}
                                      href={system.websiteUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      size="sm"
                                      color="danger"
                                      variant="flat"
                                      className="mt-3"
                                      startContent={<ExternalLinkIcon className="w-4 h-4" />}
                                    >
                                      Kunjungi
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* No categories, show all in grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systems.map(system => (
                  <Card
                    key={system.id}
                    className="hover:shadow-lg transition-shadow duration-200 border border-default-200"
                  >
                    <CardBody className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {system.logoUrl ? (
                            <div className="w-16 h-16 relative rounded-xl overflow-hidden border border-default-200 bg-white">
                              <Image
                                src={system.logoUrl}
                                alt={system.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                              <ComputerIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-default-900 line-clamp-1">
                            {system.name}
                          </h3>
                          {system.shortName && (
                            <p className="text-xs text-default-500">
                              ({system.shortName})
                            </p>
                          )}
                          {system.description && (
                            <p className="text-sm text-default-600 mt-2 line-clamp-2">
                              {system.description}
                            </p>
                          )}
                          {system.websiteUrl && (
                            <Button
                              as={Link}
                              href={system.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="sm"
                              color="danger"
                              variant="flat"
                              className="mt-3"
                              startContent={<ExternalLinkIcon className="w-4 h-4" />}
                            >
                              Kunjungi
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <Card className="max-w-md mx-auto">
            <CardBody className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-default-100 flex items-center justify-center">
                <ComputerIcon className="w-10 h-10 text-default-400" />
              </div>
              <h3 className="text-lg font-semibold text-default-700 mb-2">
                Belum Ada Data
              </h3>
              <p className="text-default-500">
                Sistem informasi pendukung SPMI akan ditampilkan di sini.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
