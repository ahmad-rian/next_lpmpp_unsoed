"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";

interface UniversityRanking {
  id: string;
  institution: string;
  year: number;
  rankNational: number | null;
  rankWorld: number | null;
  rankAsia: number | null;
  score: number | null;
  badge: string | null;
  description: string | null;
  sourceUrl: string | null;
  logoUrl: string | null;
  isActive: boolean;
}

const INSTITUTIONS = [
  {
    key: "WEBOMETRICS",
    label: "Webometrics",
    fullName: "Webometrics Ranking of World Universities",
    color: "primary",
    description:
      "Webometrics memberikan pemeringkatan berdasarkan kehadiran web, dampak, keterbukaan, dan keunggulan perguruan tinggi.",
    website: "https://www.webometrics.info/",
  },
  {
    key: "QS",
    label: "QS WUR",
    fullName: "QS World University Rankings",
    color: "secondary",
    description:
      "QS World University Rankings mengevaluasi universitas berdasarkan reputasi akademik, reputasi pemberi kerja, rasio fakultas/mahasiswa, dan sitasi.",
    website: "https://www.topuniversities.com/",
  },
  {
    key: "APPLIEDHE",
    label: "AppliedHE",
    fullName: "AppliedHE Private University Rankings",
    color: "success",
    description:
      "AppliedHE menyediakan pemeringkatan untuk universitas swasta berdasarkan berbagai indikator kualitas pendidikan.",
    website: "https://appliedhe.com/",
  },
  {
    key: "THE_WUR",
    label: "THE WUR",
    fullName: "Times Higher Education World University Rankings",
    color: "warning",
    description:
      "THE WUR menilai universitas berdasarkan pengajaran, penelitian, sitasi, pendapatan industri, dan outlook internasional.",
    website: "https://www.timeshighereducation.com/",
  },
  {
    key: "SCOPUS",
    label: "Scopus",
    fullName: "Scopus (Scimago Institutions Rankings)",
    color: "danger",
    description:
      "Scimago Institutions Rankings menggunakan data Scopus untuk mengukur output penelitian, inovasi, dan dampak sosial.",
    website: "https://www.scimagoir.com/",
  },
];

// Icons
const TrophyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228M18.75 4.236V2.721M12 14.25a7.5 7.5 0 00.981-3.172m-.981 3.172V17.25m0-6.168a7.5 7.5 0 01-.981-3.172"
    />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
    />
  </svg>
);

const FlagIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
    />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

const getInstitutionInfo = (key: string) => {
  return INSTITUTIONS.find((i) => i.key === key);
};

const getInstitutionColor = (key: string) => {
  return (INSTITUTIONS.find((i) => i.key === key)?.color || "default") as
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "default";
};

export default function PeringkatPTPage() {
  const [rankings, setRankings] = useState<UniversityRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>("all");

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch("/api/university-rankings");
        if (response.ok) {
          const data = await response.json();
          setRankings(data);
        }
      } catch (error) {
        console.error("Error fetching rankings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const filteredRankings =
    selectedTab === "all"
      ? rankings
      : rankings.filter((r) => r.institution === selectedTab);

  // Get latest ranking for each institution
  const latestByInstitution = INSTITUTIONS.map((inst) => {
    const instRankings = rankings.filter((r) => r.institution === inst.key);
    if (instRankings.length === 0) return null;
    const latestYear = Math.max(...instRankings.map((r) => r.year));
    return instRankings.find((r) => r.year === latestYear);
  }).filter(Boolean) as UniversityRanking[];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrophyIcon className="w-10 h-10 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">
            Peringkat Perguruan Tinggi
          </h1>
        </div>
        <p className="text-default-600 max-w-2xl mx-auto">
          Capaian peringkat Universitas Jenderal Soedirman berdasarkan berbagai
          lembaga pemeringkat internasional dan nasional.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {INSTITUTIONS.map((inst) => {
              const latest = latestByInstitution.find(
                (r) => r.institution === inst.key
              );
              return (
                <Card
                  key={inst.key}
                  className="bg-gradient-to-br from-default-50 to-default-100 dark:from-default-100 dark:to-default-50 border-none shadow-md hover:shadow-lg transition-shadow"
                  isPressable
                  onPress={() => setSelectedTab(inst.key)}
                >
                  <CardBody className="p-4">
                    <div className="flex flex-col items-center text-center gap-2">
                      <Chip
                        color={getInstitutionColor(inst.key)}
                        variant="flat"
                        size="sm"
                      >
                        {inst.label}
                      </Chip>
                      <div className="mt-2">
                        {latest ? (
                          <>
                            <p className="text-3xl font-bold text-primary">
                              {latest.rankNational
                                ? `#${latest.rankNational}`
                                : latest.rankWorld
                                  ? `#${latest.rankWorld}`
                                  : "-"}
                            </p>
                            <p className="text-xs text-default-500">
                              {latest.rankNational ? "Nasional" : "Dunia"} (
                              {latest.year})
                            </p>
                          </>
                        ) : (
                          <p className="text-default-400 text-sm">
                            Belum ada data
                          </p>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Tabs */}
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            aria-label="Filter berdasarkan lembaga"
            color="primary"
            variant="bordered"
            classNames={{
              tabList: "flex-wrap",
            }}
          >
            <Tab key="all" title="Semua" />
            {INSTITUTIONS.map((inst) => (
              <Tab key={inst.key} title={inst.label} />
            ))}
          </Tabs>

          {/* Rankings List */}
          <div className="mt-8 space-y-6">
            {filteredRankings.length === 0 ? (
              <Card className="bg-default-50">
                <CardBody className="py-10 text-center">
                  <p className="text-default-500">
                    Belum ada data peringkat untuk lembaga ini.
                  </p>
                </CardBody>
              </Card>
            ) : (
              filteredRankings.map((ranking) => {
                const instInfo = getInstitutionInfo(ranking.institution);
                return (
                  <Card
                    key={ranking.id}
                    className="bg-default-50 overflow-hidden"
                  >
                    <CardHeader className="flex-col sm:flex-row gap-4 items-start sm:items-center bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 pb-4">
                      <div className="flex items-center gap-4">
                        {ranking.logoUrl && (
                          <div className="relative w-16 h-16 bg-white rounded-lg p-2 shadow-sm">
                            <Image
                              src={ranking.logoUrl}
                              alt={instInfo?.label || ""}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold">
                            {instInfo?.fullName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Chip
                              color={getInstitutionColor(ranking.institution)}
                              variant="flat"
                              size="sm"
                            >
                              {ranking.year}
                            </Chip>
                            {ranking.badge && (
                              <Chip variant="bordered" size="sm">
                                {ranking.badge}
                              </Chip>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        {ranking.rankNational && (
                          <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                            <FlagIcon className="w-8 h-8 text-primary" />
                            <div>
                              <p className="text-sm text-default-500">
                                Peringkat Nasional
                              </p>
                              <p className="text-2xl font-bold text-primary">
                                #{ranking.rankNational}
                              </p>
                            </div>
                          </div>
                        )}
                        {ranking.rankWorld && (
                          <div className="flex items-center gap-3 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                            <GlobeIcon className="w-8 h-8 text-success" />
                            <div>
                              <p className="text-sm text-default-500">
                                Peringkat Dunia
                              </p>
                              <p className="text-2xl font-bold text-success">
                                #{ranking.rankWorld}
                              </p>
                            </div>
                          </div>
                        )}
                        {ranking.rankAsia && (
                          <div className="flex items-center gap-3 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                            <MapPinIcon className="w-8 h-8 text-warning" />
                            <div>
                              <p className="text-sm text-default-500">
                                Peringkat Asia
                              </p>
                              <p className="text-2xl font-bold text-warning">
                                #{ranking.rankAsia}
                              </p>
                            </div>
                          </div>
                        )}
                        {ranking.score && (
                          <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                            <TrophyIcon className="w-8 h-8 text-secondary" />
                            <div>
                              <p className="text-sm text-default-500">Skor</p>
                              <p className="text-2xl font-bold text-secondary">
                                {ranking.score}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {ranking.description && (
                        <p className="text-default-600 mb-4">
                          {ranking.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {ranking.sourceUrl && (
                          <Link
                            href={ranking.sourceUrl}
                            isExternal
                            showAnchorIcon
                            className="text-primary"
                          >
                            Lihat Sumber Data
                          </Link>
                        )}
                        {instInfo?.website && (
                          <Link
                            href={instInfo.website}
                            isExternal
                            className="text-default-500 flex items-center gap-1"
                          >
                            <ExternalLinkIcon className="w-4 h-4" />
                            {instInfo.label} Website
                          </Link>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>

          {/* Institution Info Section */}
          {selectedTab !== "all" && (
            <Card className="mt-8 bg-default-50">
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Tentang {getInstitutionInfo(selectedTab)?.fullName}
                </h3>
                <p className="text-default-600">
                  {getInstitutionInfo(selectedTab)?.description}
                </p>
                {getInstitutionInfo(selectedTab)?.website && (
                  <Link
                    href={getInstitutionInfo(selectedTab)?.website}
                    isExternal
                    showAnchorIcon
                    className="mt-4 inline-block"
                  >
                    Kunjungi Website Resmi
                  </Link>
                )}
              </CardBody>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
