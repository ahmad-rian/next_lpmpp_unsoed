"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import { Chip } from "@heroui/chip";

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

export default function SpmiPage() {
  const [spmiData, setSpmiData] = useState<SpmiAbout | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSpmi, setSearchSpmi] = useState("");
  const [searchAudit, setSearchAudit] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch SPMI About
      const spmiResponse = await fetch("/api/admin/spmi");
      if (spmiResponse.ok) {
        const spmiData = await spmiResponse.json();
        setSpmiData(spmiData);
      }

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{spmiData?.title || "SPMI UNSOED"}</h1>
        <p className="text-default-600">
          Sistem Penjaminan Mutu Internal Universitas Jenderal Soedirman
        </p>
      </div>

      {/* Tujuan & Fungsi Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardBody className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              TUJUAN
            </h2>
            <div className="text-default-700 whitespace-pre-line">{spmiData?.tujuan}</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-secondary flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              FUNGSI SPMI
            </h2>
            <div className="text-default-700 whitespace-pre-line">{spmiData?.fungsi}</div>
          </CardBody>
        </Card>
      </div>

      {/* Documents Section with Tabs */}
      <Card>
        <CardBody className="p-6">
          <Tabs aria-label="Dokumen SPMI" size="lg" color="primary" className="mb-6">
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
                    <Card key={doc.id} className="border-2 hover:border-primary transition-all">
                      <CardBody className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
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
                          <a
                            href={doc.fileUrl}
                            download
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                          >
                            <DownloadIcon />
                            <span className="hidden sm:inline">Download</span>
                          </a>
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
                    <Card key={doc.id} className="border-2 hover:border-secondary transition-all">
                      <CardBody className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
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
                          <a
                            href={doc.fileUrl}
                            download
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors whitespace-nowrap"
                          >
                            <DownloadIcon />
                            <span className="hidden sm:inline">Download</span>
                          </a>
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
