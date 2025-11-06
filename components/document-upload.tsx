"use client";

import React, { useState, useRef } from "react";
import { Button } from "@heroui/button";

interface DocumentUploadProps {
  label: string;
  value: string | null;
  onChange: (url: string, fileName: string, fileSize: number) => void;
  description?: string;
}

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

export function DocumentUpload({ label, value, onChange, description }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(value ? value.split('/').pop() || null : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        onChange(result.url, result.filename, result.size);
        setFileName(result.filename);
      } else {
        alert(result.error || "Upload failed");
        setFileName(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document");
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-default-700">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* File Info */}
        <div className="flex-1 border-2 border-dashed border-default-300 rounded-lg p-4 bg-default-50">
          {fileName ? (
            <div className="flex items-center gap-3">
              <DocumentIcon className="w-8 h-8 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                <p className="text-xs text-default-500">File uploaded</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-default-400 py-2">
              <DocumentIcon className="w-8 h-8" />
              <span className="text-sm">No document uploaded</span>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex flex-col justify-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <Button
            color="primary"
            variant="flat"
            startContent={<UploadIcon className="w-4 h-4" />}
            onPress={() => fileInputRef.current?.click()}
            isLoading={uploading}
            isDisabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>

          {description && (
            <p className="text-xs text-default-500">{description}</p>
          )}
          
          <p className="text-xs text-default-400">
            Supported: PDF, DOC, DOCX, XLS, XLSX
          </p>
        </div>
      </div>
    </div>
  );
}
