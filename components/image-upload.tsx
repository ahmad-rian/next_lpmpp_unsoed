"use client";

import React, { useState, useRef } from "react";
import { Button } from "@heroui/button";
import Image from "next/image";

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

export function ImageUpload({ label, value, onChange, description }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      const result = await response.json();

      if (response.ok) {
        onChange(result.url);
        setPreview(result.url);
      } else {
        alert(result.error || "Upload failed");
        setPreview(value);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
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
            <img
              src={preview}
              alt="Preview"
              className="object-contain w-full h-full"
            />
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
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>

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
