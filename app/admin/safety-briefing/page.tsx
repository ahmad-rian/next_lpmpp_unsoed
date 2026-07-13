"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { ImageUpload } from "@/components/image-upload";
import { DocumentIcon } from "@/components/admin-icons";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

export default function AdminSafetyBriefingPage() {
  const [title, setTitle] = useState("Safety Briefing LPMPP Building");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [videoInput, setVideoInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/safety-briefing");
        const data = await res.json();
        setTitle(data.title || "Safety Briefing LPMPP Building");
        setDescription(data.description || "");
        setImages(safeParseArray(data.images));
        setVideos(safeParseArray(data.videos));
      } catch (error) {
        console.error("Error fetching safety briefing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addImage = (url: string) => setImages((prev) => [...prev, url]);
  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const addVideo = () => {
    const url = videoInput.trim();
    if (!url) return;
    if (!getYoutubeEmbedUrl(url)) {
      setMessage({ type: "error", text: "URL YouTube tidak valid." });
      return;
    }
    setVideos((prev) => [...prev, url]);
    setVideoInput("");
    setMessage(null);
  };
  const removeVideo = (index: number) =>
    setVideos((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/safety-briefing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          images: JSON.stringify(images),
          videos: JSON.stringify(videos),
        }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Tersimpan." });
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.error || "Gagal menyimpan." });
      }
    } catch (error) {
      console.error("Error saving:", error);
      setMessage({ type: "error", text: "Gagal menyimpan." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminPageLayout
        title="Safety Briefing"
        description="Kelola petunjuk keselamatan gedung LPMPP"
        icon={<DocumentIcon className="w-8 h-8" />}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-default-100 rounded-lg" />
          <div className="h-40 bg-default-100 rounded-lg" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Safety Briefing"
      description="Kelola petunjuk keselamatan gedung LPMPP"
      icon={<DocumentIcon className="w-8 h-8" />}
      action={
        <Button color="primary" onPress={handleSave} isLoading={saving}>
          Simpan
        </Button>
      }
    >
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-success-50 text-success-700"
              : "bg-danger-50 text-danger-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card>
        <CardBody className="space-y-4">
          <Input
            label="Judul"
            value={title}
            onValueChange={setTitle}
            variant="bordered"
          />
          <Textarea
            label="Deskripsi / Petunjuk"
            placeholder="Tulis petunjuk keselamatan gedung..."
            value={description}
            onValueChange={setDescription}
            minRows={5}
            variant="bordered"
          />
        </CardBody>
      </Card>

      {/* Galeri Gambar */}
      <Card>
        <CardBody className="space-y-4">
          <h3 className="text-lg font-semibold">Galeri Gambar ({images.length})</h3>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div key={`${url}-${index}`} className="relative group">
                  <img
                    src={url}
                    alt={`Gambar ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border border-default-200"
                  />
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    className="absolute top-2 right-2"
                    onPress={() => removeImage(index)}
                  >
                    Hapus
                  </Button>
                </div>
              ))}
            </div>
          )}

          <ImageUpload
            label="Tambah Gambar"
            value={null}
            onChange={addImage}
            description="Upload gambar petunjuk keselamatan. Bisa lebih dari satu."
          />
        </CardBody>
      </Card>

      {/* Video YouTube */}
      <Card>
        <CardBody className="space-y-4">
          <h3 className="text-lg font-semibold">Video YouTube ({videos.length})</h3>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              label="URL YouTube"
              placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
              value={videoInput}
              onValueChange={setVideoInput}
              variant="bordered"
              className="flex-1"
            />
            <Button color="primary" variant="flat" onPress={addVideo} className="sm:self-end sm:h-14">
              Tambah Video
            </Button>
          </div>

          {videos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((url, index) => {
                const embed = getYoutubeEmbedUrl(url);
                return (
                  <div key={`${url}-${index}`} className="space-y-2">
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-default-100">
                      {embed && (
                        <iframe
                          src={embed}
                          title={`Video ${index + 1}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-default-500 truncate">{url}</span>
                      <Button size="sm" color="danger" variant="flat" onPress={() => removeVideo(index)}>
                        Hapus
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </AdminPageLayout>
  );
}

function safeParseArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
