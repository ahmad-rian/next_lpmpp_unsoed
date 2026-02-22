import Link from "next/link";
import { Card, CardBody } from "@heroui/card";

export default function KepakaranIndexPage() {
  const menu = [
    { href: "/kepakaran/fasilitator-pekerti", title: "Pelatihan Pekerti/AA", desc: "Daftar fasilitator bersertifikat PEKERTI/AA." },
    { href: "/kepakaran/auditor-mutu-internal", title: "Pelatihan SPMI/AMI", desc: "Daftar auditor mutu internal SPMI/AMI." },
    { href: "/kepakaran/pelatihan-bahan-ajar", title: "Pelatihan Bahan Ajar", desc: "Daftar fasilitator pelatihan bahan ajar." },
    { href: "/kepakaran/pelatihan-lainnya", title: "Pelatihan Lainnya", desc: "Daftar fasilitator pelatihan lainnya." },
    { href: "/kepakaran/asesor-bkd", title: "Evaluasi BKD", desc: "Daftar asesor evaluasi Beban Kerja Dosen." },
    { href: "/kepakaran/asesor-serdos", title: "Sertifikasi Dosen", desc: "Daftar asesor sertifikasi dosen." },
  ];

  return (
    <div className="w-full space-y-8 px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          Layanan
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Pilih kategori untuk melihat daftar fasilitator, auditor, dan asesor dengan fitur pencarian serta pagination.
        </p>
        <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6"></div>
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {menu.map((m) => (
          <Link key={m.href} href={m.href} className="block">
            <Card className="shadow-md hover:shadow-lg transition border-l-4 border-red-500">
              <CardBody className="p-4">
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">{m.title}</p>
                <p className="text-sm text-default-500 mt-1">{m.desc}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}