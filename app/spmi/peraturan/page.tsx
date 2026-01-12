import { Metadata } from "next";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Peraturan SPMI - LPMPP UNSOED",
  description: "Peraturan Sistem Penjaminan Mutu Internal UNSOED",
};

async function getRegulationDocuments() {
  try {
    const documents = await prisma.document.findMany({
      where: {
        type: "REGULATION",
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });
    return documents;
  } catch (error) {
    console.error("Error fetching regulation documents:", error);
    return [];
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getDocumentIcon(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return (
        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case 'doc':
    case 'docx':
      return (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 18.75h-8.5A1.125 1.125 0 015.25 18V5.625c0-.621.504-1.125 1.125-1.125h8.5c.621 0 1.125.504 1.125 1.125V18c0 .621-.504 1.125-1.125 1.125z" />
        </svg>
      );
    case 'xls':
    case 'xlsx':
      return (
        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
  }
}

export default async function PeraturanPage() {
  const documents = await getRegulationDocuments();

  return (
    <div className="w-full px-4 pb-12">
      {/* Hero Header */}
      <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          Peraturan SPMI
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Peraturan Sistem Penjaminan Mutu Internal
        </p>
        <p className="text-sm md:text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto px-4">
          Universitas Jenderal Soedirman
        </p>
        <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6"></div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {documents.length > 0 ? (
          <div className="grid gap-6 md:gap-8">
            {documents.map((document, index) => (
              <Card key={document.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex gap-3 md:gap-4 p-4 md:p-6">
                  <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <svg className="w-7 h-7 md:w-8 md:h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h14.25c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                        {document.title}
                      </h2>
                      <Chip size="sm" variant="flat" color="secondary" className="shrink-0">
                        #{index + 1}
                      </Chip>
                    </div>
                    {document.description && (
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                        {document.description}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="p-4 md:p-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                        {getDocumentIcon(document.fileName)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                          {document.fileName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            Peraturan SPMI
                          </span>
                          {document.fileSize && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {formatFileSize(document.fileSize)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Unduh
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-md">
            <CardBody className="p-8 md:p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h14.25c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Belum Ada Peraturan
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Dokumen peraturan SPMI belum tersedia saat ini. Silakan cek kembali nanti.
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
