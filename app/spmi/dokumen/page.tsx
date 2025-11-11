"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

interface SpmiAbout {
  title: string;
  tujuan: string;
  fungsi: string;
}

interface Document {
  id: string;
  type: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  order: number;
  createdAt: string;
}

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export default function SpmiDokumenPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSpmi, setSearchSpmi] = useState("");
  const [searchAudit, setSearchAudit] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Documents
      const docsResponse = await fetch("/api/documents");
      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        setDocuments(docsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpmiDocs = documents
    .filter((doc) => doc.type === "SPMI")
    .filter((doc) =>
      doc.title.toLowerCase().includes(searchSpmi.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchSpmi.toLowerCase())
    );

  const filteredAuditDocs = documents
    .filter((doc) => doc.type === "AUDIT")
    .filter((doc) =>
      doc.title.toLowerCase().includes(searchAudit.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchAudit.toLowerCase())
    );

  if (loading) {
    return (
      <div className="w-full space-y-8 px-4">
        <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
          <Skeleton className="h-12 w-96 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-64 mx-auto rounded-lg" />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          Dokumen SPMI & Audit
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Sistem Penjaminan Mutu Internal Universitas Jenderal Soedirman
        </p>
        <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6"></div>
      </div>

      {/* Documents Section with Tabs */}
      <Card className="max-w-7xl mx-auto shadow-lg">
        <CardBody className="p-6">
          <Tabs aria-label="Dokumen SPMI" size="lg" color="danger" className="mb-6">
            <Tab
              key="spmi"
              title={
                <div className="flex items-center gap-2">
                  <DocumentIcon />
                  <span>Dokumen SPMI</span>
                  <Chip size="sm" variant="flat">{filteredSpmiDocs.length}</Chip>
                </div>
              }
            >
              {/* Search Bar untuk SPMI */}
              <div className="mb-6">
                <Input
                  placeholder="Cari dokumen SPMI..."
                  value={searchSpmi}
                  onChange={(e) => setSearchSpmi(e.target.value)}
                  startContent={<SearchIcon />}
                  size="lg"
                  variant="bordered"
                />
              </div>

              {/* SPMI Documents List */}
              <div className="space-y-4">
                {filteredSpmiDocs.length > 0 ? (
                  filteredSpmiDocs.map((doc) => (
                    <Card key={doc.id} className="border-2 hover:border-red-500 transition-all shadow-md">
                      <CardBody className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{doc.title}</h3>
                            <p className="text-default-600 text-sm mb-3">{doc.description}</p>
                            <div className="flex items-center gap-3 text-xs text-default-500">
                              <span className="flex items-center gap-1">
                                <DocumentIcon />
                                {doc.fileName}
                              </span>
                              <span>•</span>
                              <span>{new Date(doc.createdAt).toLocaleDateString('id-ID')}</span>
                            </div>
                          </div>
                          <Button
                            as="a"
                            href={doc.fileUrl}
                            download
                            color="danger"
                            variant="flat"
                            startContent={<DownloadIcon />}
                            className="whitespace-nowrap"
                          >
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-default-500">
                    {searchSpmi ? "Tidak ada dokumen yang sesuai dengan pencarian" : "Belum ada dokumen SPMI"}
                  </div>
                )}
              </div>
            </Tab>

            <Tab
              key="audit"
              title={
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>Dokumen Audit</span>
                  <Chip size="sm" variant="flat">{filteredAuditDocs.length}</Chip>
                </div>
              }
            >
              {/* Search Bar untuk Audit */}
              <div className="mb-6">
                <Input
                  placeholder="Cari dokumen audit..."
                  value={searchAudit}
                  onChange={(e) => setSearchAudit(e.target.value)}
                  startContent={<SearchIcon />}
                  size="lg"
                  variant="bordered"
                />
              </div>

              {/* Audit Documents List */}
              <div className="space-y-4">
                {filteredAuditDocs.length > 0 ? (
                  filteredAuditDocs.map((doc) => (
                    <Card key={doc.id} className="border-2 hover:border-red-500 transition-all shadow-md">
                      <CardBody className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{doc.title}</h3>
                            <p className="text-default-600 text-sm mb-3">{doc.description}</p>
                            <div className="flex items-center gap-3 text-xs text-default-500">
                              <span className="flex items-center gap-1">
                                <DocumentIcon />
                                {doc.fileName}
                              </span>
                              <span>•</span>
                              <span>{new Date(doc.createdAt).toLocaleDateString('id-ID')}</span>
                            </div>
                          </div>
                          <Button
                            as="a"
                            href={doc.fileUrl}
                            download
                            color="danger"
                            variant="flat"
                            startContent={<DownloadIcon />}
                            className="whitespace-nowrap"
                          >
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-default-500">
                    {searchAudit ? "Tidak ada dokumen yang sesuai dengan pencarian" : "Belum ada dokumen audit"}
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}