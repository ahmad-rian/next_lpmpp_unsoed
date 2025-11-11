"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { Chip } from "@heroui/chip";

interface SpmiAbout {
  id: string;
  title: string;
  tujuan: string;
  fungsi: string;
}

export default function TentangSpmiPage() {
  const [spmiData, setSpmiData] = useState<SpmiAbout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpmiData();
  }, []);

  const fetchSpmiData = async () => {
    try {
      const response = await fetch("/api/spmi/about");
      if (response.ok) {
        const data = await response.json();
        setSpmiData(data);
      }
    } catch (error) {
      console.error("Error fetching SPMI data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to format text with numbered list
  const formatContent = (text: string) => {
    const lines = text.split("\n");
    const formatted: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushParagraph = (key: string) => {
      if (currentParagraph.length > 0) {
        const content = currentParagraph.join(" ");
        formatted.push(
          <p key={key} className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {content}
          </p>
        );
        currentParagraph = [];
      }
    };

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        formatted.push(
          <div key={key} className="space-y-2 md:space-y-3">
            {listItems.map((item, i) => (
              <div key={i} className="flex gap-2 md:gap-3">
                <span className="text-red-500 font-semibold min-w-[1.2rem] md:min-w-[1.5rem] text-sm md:text-base flex-shrink-0">
                  {i + 1}.
                </span>
                <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                  {item}
                </span>
              </div>
            ))}
          </div>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Check if it's a numbered list item
      const listMatch = trimmedLine.match(/^(\d+)[.)]\s+(.+)$/);

      if (listMatch) {
        // Flush paragraph if we're entering a list
        if (!inList) {
          flushParagraph(`p-${index}`);
          inList = true;
        }
        listItems.push(listMatch[2]);
      } else if (trimmedLine) {
        // Flush list if we're leaving it
        if (inList) {
          flushList(`list-${index}`);
          inList = false;
        }
        currentParagraph.push(trimmedLine);
      } else {
        // Empty line - flush current content
        if (inList) {
          flushList(`list-${index}`);
          inList = false;
        } else {
          flushParagraph(`p-${index}`);
        }
        if (formatted.length > 0) {
          formatted.push(<div key={`space-${index}`} className="h-2" />);
        }
      }
    });

    // Flush remaining content
    if (inList) {
      flushList(`list-end`);
    } else {
      flushParagraph(`p-end`);
    }

    return formatted;
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

  if (!spmiData) {
    return (
      <div className="w-full px-4">
        <Card className="shadow-md">
          <CardBody className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Data Tentang SPMI belum tersedia.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-12">
      {/* Hero Header - Clean and Simple */}
      <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">
          {spmiData.title}
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Sistem Penjaminan Mutu Internal
        </p>
        <p className="text-sm md:text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto px-4">
          Universitas Jenderal Soedirman
        </p>
        <div className="w-16 md:w-20 h-1 bg-red-500 mx-auto mt-4 md:mt-6"></div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
        {/* Tujuan Section */}
        {spmiData.tujuan && (
          <Card className="shadow-md border-l-4 border-red-500">
            <CardHeader className="flex gap-3 md:gap-4 p-4 md:p-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Tujuan
                </h3>
                <Chip size="sm" variant="flat" color="danger">
                  Tujuan SPMI
                </Chip>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                {formatContent(spmiData.tujuan)}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Fungsi Section */}
        {spmiData.fungsi && (
          <Card className="shadow-md border-l-4 border-rose-500">
            <CardHeader className="flex gap-3 md:gap-4 p-4 md:p-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Fungsi SPMI
                </h3>
                <Chip size="sm" variant="flat" color="warning">
                  Fungsi SPMI
                </Chip>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                {formatContent(spmiData.fungsi)}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
