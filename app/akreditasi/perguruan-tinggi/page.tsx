"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

interface UniversityAccreditation {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  documents: AccreditationDocument[];
}

interface AccreditationDocument {
  id: string;
  title: string;
  documentUrl: string;
  documentName: string | null;
}

// Download Icon
const DownloadIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export default function AkreditasiPerguruanTinggiPage() {
  const [accreditations, setAccreditations] = useState<UniversityAccreditation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccreditations();
  }, []);

  const fetchAccreditations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/accreditation/university");
      const data = await response.json();
      setAccreditations(data);
    } catch (error) {
      console.error("Error fetching university accreditations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-default-600">Memuat data akreditasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-600 dark:text-red-400">
          Akreditasi Perguruan Tinggi
        </h1>
        <p className="text-default-600 text-lg max-w-2xl mx-auto">
          Informasi Akreditasi Institusi Universitas Jenderal Soedirman
        </p>
      </div>

      {/* Content */}
      {accreditations.length > 0 ? (
        <div className="space-y-12">
          {accreditations.map((accreditation, index) => (
            <div key={accreditation.id} className="space-y-6">
              {/* Image Section */}
              {accreditation.imageUrl && (
                <div className="relative w-full h-[400px] md:h-[500px]">
                  <Image
                    src={accreditation.imageUrl}
                    alt={accreditation.title}
                    className="object-contain w-full h-full p-6 md:p-12"
                    removeWrapper
                  />
                </div>
              )}

              {/* Content Section */}
              <Card>
                <CardBody className="p-6 md:p-8">
                  {/* Title with Icon */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-7 h-7 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                        {accreditation.title}
                      </h2>
                      <span className="inline-flex px-3 py-1.5 rounded-full bg-success/10 text-success-600 dark:text-success-400 text-sm font-semibold">
                        Terakreditasi
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {accreditation.description && (
                    <div
                      className="prose prose-sm md:prose-base max-w-none text-default-600 dark:text-default-400"
                      dangerouslySetInnerHTML={{ __html: accreditation.description }}
                    />
                  )}
                </CardBody>
              </Card>

              {/* Documents Section */}
              {accreditation.documents.length > 0 && (
                <Card>
                  <CardBody className="p-6 md:p-8">
                    {/* Documents Header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-1">
                        Dokumen Terkait
                      </h3>
                      <p className="text-sm text-default-500">
                        {accreditation.documents.length} dokumen tersedia
                      </p>
                    </div>

                    {/* Documents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {accreditation.documents.map((doc) => (
                        <Card 
                          key={doc.id} 
                          isPressable 
                          isHoverable 
                          className="border border-default-200 dark:border-default-100"
                        >
                          <CardBody className="p-4">
                            <div className="flex flex-col gap-3">
                              {/* Document Info */}
                              <div className="flex-1">
                                <p className="font-semibold text-sm mb-2 line-clamp-2">
                                  {doc.title}
                                </p>
                                {doc.documentName && (
                                  <p className="text-xs text-default-500 truncate mb-3">
                                    {doc.documentName}
                                  </p>
                                )}
                                
                                {/* Download Button */}
                                <Button
                                  as={Link}
                                  href={doc.documentUrl}
                                  target="_blank"
                                  size="sm"
                                  color="primary"
                                  variant="flat"
                                  className="w-full"
                                  startContent={<DownloadIcon />}
                                >
                                  Unduh Dokumen
                                </Button>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Divider between accreditations */}
              {index < accreditations.length - 1 && (
                <Divider className="my-8" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-16">
            <div className="text-6xl mb-6">📜</div>
            <h3 className="text-2xl font-bold mb-3">
              Informasi Segera Hadir
            </h3>
            <p className="text-default-600 max-w-md mx-auto">
              Data akreditasi perguruan tinggi sedang dalam proses pengisian oleh admin.
              Silakan kembali lagi nanti.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}