import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dokumen SPMI - LPMPP UNSOED",
    description: "Dokumen Sistem Penjaminan Mutu Internal UNSOED",
};

export default function DokumenSpmiLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">{children}</section>;
}
