"use client";

import React, { useState, useRef } from "react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { notifyError, notifySuccess } from "@/lib/notify";

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
  description?: string;
}

const PhotoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

export function ImageUpload({ label, value, onChange, description }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Guard: max 20MB to avoid silent 413 from the reverse proxy
    const MAX_BYTES = 20 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      notifyError(
        `Ukuran gambar terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 20MB.`
      );
      e.target.value = "";
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onChange(result.url);
        setPreview(result.url);
      } else {
        // Surface the real reason so upload failures aren't opaque
        let detail = "";
        try {
          const result = await response.json();
          detail = result.error || "";
        } catch {
          detail = response.statusText;
        }
        if (response.status === 413) {
          detail = "File terlalu besar (ditolak server). Kompres gambar lalu coba lagi.";
        }
        notifyError(`Upload gagal (${response.status})${detail ? `: ${detail}` : ""}`);
        setPreview(value);
      }
    } catch (error) {
      console.error("Upload error:", error);
      notifyError("Gagal upload gambar (koneksi/server).");
      setPreview(value);
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
        {/* Preview */}
        <div className="relative w-full max-w-xs aspect-square border-2 border-dashed border-default-300 rounded-lg flex items-center justify-center overflow-hidden bg-default-50 p-4">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="object-contain w-full h-full"
              />
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                aria-label="Hapus foto"
                title="Hapus foto"
                className="absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-danger text-white shadow-md hover:bg-danger-600 disabled:opacity-50 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-default-400">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-sm">No image uploaded</span>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex flex-col justify-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
            {uploading ? "Uploading..." : preview ? "Ganti Image" : "Upload Image"}
          </Button>

          {preview && (
            <Button
              color="danger"
              variant="flat"
              startContent={<TrashIcon className="w-4 h-4" />}
              onPress={handleRemove}
              isDisabled={uploading}
            >
              Hapus Foto
            </Button>
          )}

          {description && (
            <p className="text-xs text-default-500">{description}</p>
          )}
          
          <p className="text-xs text-default-400">
            Supported: JPG, PNG, GIF. Auto-convert to WebP
          </p>
        </div>
      </div>
    </div>
  );
}
