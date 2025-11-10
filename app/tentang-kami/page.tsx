"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";

interface SiteConfig {
  id: string;
  logoUnsoed: string | null;
  logoApp: string | null;
  logoDescription: string | null;
  siteName: string;
  moto: string | null;
  visi: string | null;
  misi: string | null;
  visiUnsoed: string | null;
  misiUnsoed: string | null;
  tugas: string | null;
  fungsi: string | null;
  alamat: string | null;
  email: string | null;
  instagramUrl: string | null;
}

export default function TentangKamiPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteConfig();
  }, []);

  const fetchSiteConfig = async () => {
    try {
      const response = await fetch("/api/site-config");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("Error fetching site config:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-8 px-4">
        <Skeleton className="h-16 w-full max-w-md mx-auto rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-12">
      {/* Hero Header - Clean and Simple */}
      <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          Tentang Kami
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Lembaga Pengembangan Pembelajaran dan Penjaminan Mutu
        </p>
        <p className="text-sm md:text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto px-4">
          Universitas Jenderal Soedirman
        </p>
        <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6"></div>
      </div>

      {/* Moto Section with Quote Design */}
      {config?.moto && (
        <Card className="mb-8 md:mb-12 border-l-4 border-red-500 shadow-md bg-white dark:bg-gray-900">
          <CardBody className="p-6 md:p-10">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="text-4xl md:text-6xl text-red-500 font-serif leading-none">"</div>
              <div className="flex-1 pt-1 md:pt-2">
                <p className="text-lg md:text-2xl font-medium text-gray-800 dark:text-gray-100 italic leading-relaxed">
                  {config.moto}
                </p>
                <div className="flex items-center gap-2 mt-3 md:mt-4">
                  <div className="h-0.5 w-8 md:w-12 bg-red-500"></div>
                  <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Moto LPMPP UNSOED
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* UNSOED Section */}
      {(config?.visiUnsoed || config?.misiUnsoed) && (
        <Card className="mb-6 md:mb-8 shadow-md border-l-4 border-red-500">
          <CardHeader className="flex gap-3 md:gap-4 p-4 md:p-6">
            {config?.logoUnsoed && (
              <Image
                src={config.logoUnsoed}
                alt="Logo UNSOED"
                width={60}
                height={60}
                className="object-contain md:w-[70px] md:h-[70px]"
              />
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Universitas Jenderal Soedirman
              </h3>
              <Chip size="sm" variant="flat" color="primary">
                Institusi Induk
              </Chip>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {config?.visiUnsoed && (
                <div>
                  <h4 className="text-base md:text-lg font-bold text-red-600 dark:text-red-400 mb-2 md:mb-3">
                    Visi
                  </h4>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {config.visiUnsoed}
                  </p>
                </div>
              )}
              
              {config?.misiUnsoed && (
                <div>
                  <h4 className="text-base md:text-lg font-bold text-rose-600 dark:text-rose-400 mb-2 md:mb-3">
                    Misi
                  </h4>
                  <div className="space-y-2">
                    {config.misiUnsoed.split('\n').map((item, index) => {
                      const trimmedItem = item.trim();
                      const cleanedItem = trimmedItem.replace(/^\d+\.\s*/, '');
                      return cleanedItem ? (
                        <div key={index} className="flex gap-2 md:gap-3">
                          <span className="text-red-500 font-semibold min-w-[1.2rem] md:min-w-[1.5rem] text-sm md:text-base">
                            {index + 1}.
                          </span>
                          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                            {cleanedItem}
                          </p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* LPMPP Section */}
      {(config?.visi || config?.misi) && (
        <Card className="mb-8 md:mb-12 shadow-md border-l-4 border-rose-500">
          <CardHeader className="flex gap-3 md:gap-4 p-4 md:p-6">
            {config?.logoApp && (
              <Image
                src={config.logoApp}
                alt="Logo LPMPP"
                width={60}
                height={60}
                className="object-contain md:w-[70px] md:h-[70px]"
              />
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-xl md:text-2xl font-bold text-red-700 dark:text-red-300">
                {config?.siteName || "LPMPP UNSOED"}
              </h3>
              <Chip size="sm" variant="flat" color="danger">
                Lembaga Pengembangan
              </Chip>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {config?.visi && (
                <div>
                  <h4 className="text-base md:text-lg font-bold text-red-600 dark:text-red-400 mb-2 md:mb-3">
                    Visi
                  </h4>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {config.visi}
                  </p>
                </div>
              )}
              
              {config?.misi && (
                <div>
                  <h4 className="text-base md:text-lg font-bold text-rose-600 dark:text-rose-400 mb-2 md:mb-3">
                    Misi
                  </h4>
                  <div className="space-y-2">
                    {config.misi.split('\n').map((item, index) => {
                      const trimmedItem = item.trim();
                      const cleanedItem = trimmedItem.replace(/^\d+\.\s*/, '');
                      return cleanedItem ? (
                        <div key={index} className="flex gap-2 md:gap-3">
                          <span className="text-red-500 font-semibold min-w-[1.2rem] md:min-w-[1.5rem] text-sm md:text-base">
                            {index + 1}.
                          </span>
                          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                            {cleanedItem}
                          </p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Logo Philosophy - Clean Grid */}
      <Card className="mb-12 shadow-md border-t-4 border-red-500">
        <CardHeader className="bg-red-50 dark:bg-red-950/20 p-6">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Filosofi Logo</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Makna di balik setiap elemen logo LPMPP UNSOED
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Logo Display */}
            <div className="p-10 bg-gray-50 dark:bg-gray-900 flex items-center justify-center border-r border-divider">
              {config?.logoApp && (
                <Image
                  src={config.logoApp}
                  alt="Logo LPMPP"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              )}
            </div>

            {/* Philosophy Points */}
            <div className="lg:col-span-2 p-8 space-y-5">
              {[
                {
                  num: "01",
                  title: "Nuansa Merah Putih",
                  desc: "Semangat inovasi dalam bingkai kepentingan bangsa"
                },
                {
                  num: "02",
                  title: "Tiga Bingkai Pembelajaran",
                  desc: "Sikap, Pengetahuan, dan Keterampilan sebagai capaian holistik"
                },
                {
                  num: "03",
                  title: "Sistem Penjaminan Mutu",
                  desc: "SPMI, SPME dan Pangkalan Data terintegrasi"
                },
                {
                  num: "04",
                  title: "Dimensi Visi UNSOED",
                  desc: "Merdeka, Maju, dan Mendunia"
                },
                {
                  num: "05",
                  title: "Proses Berkelanjutan",
                  desc: "Perbaikan, Pembiasaan, dan Berkelanjutan"
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="text-2xl font-bold text-red-500 opacity-40 group-hover:opacity-100 transition-opacity min-w-[3rem]">
                    {item.num}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tugas & Fungsi - Clean Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {config?.tugas && (
          <Card className="shadow-md border-l-4 border-red-500">
            <CardHeader className="p-6 bg-red-50 dark:bg-red-950/20">
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">Tugas</h3>
            </CardHeader>
            <Divider />
            <CardBody className="p-6">
              <div className="space-y-3">
                {config.tugas.split('\n').map((item, index) => {
                  const trimmedItem = item.trim();
                  return trimmedItem ? (
                    <div key={index} className="flex gap-3 items-start">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                        {trimmedItem}
                      </p>
                    </div>
                  ) : null;
                })}
              </div>
            </CardBody>
          </Card>
        )}

        {config?.fungsi && (
          <Card className="shadow-md border-l-4 border-rose-500">
            <CardHeader className="p-6 bg-rose-50 dark:bg-rose-950/20">
              <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">Fungsi</h3>
            </CardHeader>
            <Divider />
            <CardBody className="p-6">
              <div className="space-y-3">
                {config.fungsi.split('\n').map((item, index) => {
                  const trimmedItem = item.trim();
                  return trimmedItem ? (
                    <div key={index} className="flex gap-3 items-start">
                      <span className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                        {trimmedItem}
                      </p>
                    </div>
                  ) : null;
                })}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Contact Section - Clean Layout */}
      <Card className="shadow-md border-t-4 border-red-500">
        <CardHeader className="bg-red-50 dark:bg-red-950/20 p-6">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Hubungi Kami</h3>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Contact Info */}
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Alamat</h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Gedung LPMPP Unsoed<br />
                      Jl. Kampus No.1, Grendeng<br />
                      Purwokerto Utara, Kabupaten Banyumas<br />
                      Jawa Tengah 53122
                    </p>
                  </div>
                </div>

                {config?.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Email</h4>
                      <p className="text-gray-600 dark:text-gray-400">{config.email}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  as="a"
                  href="https://www.google.com/maps/place/H6WW%2BR9M,+Dukuhbandong,+Grendeng,+Kec.+Purwokerto+Utara,+Kabupaten+Banyumas,+Jawa+Tengah+53122"
                  target="_blank"
                  color="danger"
                  variant="flat"
                  startContent={
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Lihat di Google Maps
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="h-96 border-l border-divider">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.8!2d109.2456!3d-7.4257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjUnMzIuNSJTIDEwOcKwMTQnNDQuMiJF!5e0!3m2!1sid!2sid!4v1699999999999!5m2!1sid!2sid&q=H6WW%2BR9M%2C+Dukuhbandong%2C+Grendeng%2C+Kec.+Purwokerto+Utara%2C+Kabupaten+Banyumas%2C+Jawa+Tengah+53122"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi LPMPP UNSOED"
                className="w-full h-full"
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}