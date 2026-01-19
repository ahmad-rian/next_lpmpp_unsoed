"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Switch } from "@heroui/switch";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { RichTextEditor } from "@/components/rich-text-editor";

// Icons
const NewspaperIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  galleryImages: string | null;
  author: string;
  publishedAt: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function BeritaPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    galleryImages: [] as string[],
    author: "Admin LPMPP",
    isPublished: false,
    publishedAt: new Date().toISOString().slice(0, 16), // Add custom timestamp
  });

  const [editingNews, setEditingNews] = useState<News | null>(null);

  // Calculate pagination
  const pages = Math.ceil(news.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return news.slice(start, end);
  }, [page, news]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Gunakan parameter admin=true agar API mengembalikan semua field yang diperlukan admin (content, galleryImages, isPublished)
      const response = await fetch("/api/news?admin=true&limit=1000");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch news");
      }

      // Handle paginated response format
      if (data.news && Array.isArray(data.news)) {
        setNews(data.news);
      } else if (Array.isArray(data)) {
        setNews(data);
      } else {
        console.error("Invalid data format:", data);
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
      alert("Gagal memuat data berita");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingNews(null);
    setFormData({
      id: "",
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      galleryImages: [],
      author: "Admin LPMPP",
      isPublished: false,
      publishedAt: new Date().toISOString().slice(0, 16),
    });
    onOpen();
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    const gallery = newsItem.galleryImages ? JSON.parse(newsItem.galleryImages) : [];
    setFormData({
      id: newsItem.id,
      title: newsItem.title ?? "",
      excerpt: newsItem.excerpt ?? "",
      content: newsItem.content ?? "",
      coverImage: newsItem.coverImage || "",
      galleryImages: gallery,
      author: newsItem.author || "Admin LPMPP",
      isPublished: newsItem.isPublished,
      publishedAt: new Date(newsItem.publishedAt).toISOString().slice(0, 16),
    });
    onOpen();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, coverImage: data.url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Gagal upload gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate files
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith("image/")) {
        alert("Semua file harus berupa gambar");
        return;
      }
      if (files[i].size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB per gambar");
        return;
      }
    }

    try {
      setUploadingImage(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${files[i].name}`);
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      alert("Gagal upload beberapa gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  // Util: safe trimming to avoid calling .trim() on undefined/null
  const safeTrim = (value: unknown) => {
    return typeof value === "string" ? value.trim() : "";
  };

  const handleSubmit = async () => {
    // Normalize fields first to avoid TypeError on .trim()
    const title = safeTrim(formData.title);
    const excerpt = safeTrim(formData.excerpt);
    const content = safeTrim(formData.content);

    if (!title || !excerpt || !content) {
      alert("Judul, excerpt, dan konten harus diisi");
      return;
    }

    try {
      setSaving(true);

      const method = editingNews ? "PUT" : "POST";
      const payload = {
        id: formData.id || undefined,
        title,
        excerpt,
        content,
        coverImage: safeTrim(formData.coverImage) || null,
        galleryImages: JSON.stringify(Array.isArray(formData.galleryImages) ? formData.galleryImages.filter(Boolean) : []),
        author: safeTrim(formData.author) || "Admin LPMPP",
        isPublished: !!formData.isPublished,
        publishedAt: formData.publishedAt || new Date().toISOString().slice(0, 16),
      };

      console.log("Submitting berita:", payload);

      const response = await fetch("/api/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      await fetchNews();
      onClose();
      alert(editingNews ? "Berita berhasil diupdate" : "Berita berhasil ditambahkan");
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Gagal menyimpan berita");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    try {
      const response = await fetch(`/api/news?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      await fetchNews();
      alert("Berita berhasil dihapus");
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("Gagal menghapus berita");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <AdminPageLayout
      title="Berita"
      description="Kelola berita dan artikel LPMPP Unsoed"
      icon={<NewspaperIcon />}
    >
      <div className="flex justify-between items-center mb-6">
        <Chip color="primary" variant="flat">
          Total: {news.length} berita
        </Chip>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-5 h-5" />}
          onPress={handleAdd}
        >
          Tambah Berita
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <Table aria-label="Tabel Berita">
            <TableHeader>
              <TableColumn>NO</TableColumn>
              <TableColumn>JUDUL</TableColumn>
              <TableColumn>PENULIS</TableColumn>
              <TableColumn>TANGGAL</TableColumn>
              <TableColumn>VIEWS</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((newsItem, index) => (
                <TableRow key={newsItem.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <div className="font-medium line-clamp-2">{newsItem.title}</div>
                      <div className="text-xs text-default-500 mt-1 line-clamp-1">
                        {stripHtml(newsItem.excerpt).substring(0, 100)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{newsItem.author}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(newsItem.publishedAt)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <EyeIcon className="w-4 h-4 text-default-400" />
                      <span className="text-sm">{newsItem.viewCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={newsItem.isPublished ? "success" : "warning"}
                      variant="flat"
                      size="sm"
                    >
                      {newsItem.isPublished ? "Published" : "Draft"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="warning"
                        isIconOnly
                        onPress={() => handleEdit(newsItem)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isIconOnly
                        onPress={() => handleDelete(newsItem.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={pages}
                page={page}
                onChange={setPage}
                showControls
                color="primary"
              />
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {editingNews ? "Edit Berita" : "Tambah Berita"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Judul Berita"
                placeholder="Masukkan judul berita"
                value={formData.title}
                onChange={(e: any) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                isRequired
              />

              <Textarea
                label="Excerpt / Ringkasan"
                placeholder="Tulis ringkasan singkat berita (ditampilkan di preview)"
                value={formData.excerpt}
                onChange={(e: any) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                minRows={3}
                isRequired
              />

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Konten Berita <span className="text-danger">*</span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) =>
                    setFormData({ ...formData, content: content ?? "" })
                  }
                  placeholder="Tulis konten berita lengkap di sini..."
                  height="400px"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Gambar Cover
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <p className="text-sm text-default-500 mt-2">
                    Uploading...
                  </p>
                )}
                {formData.coverImage && (
                  <div className="mt-3">
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="max-w-xs h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Gallery Images (Ditampilkan sebelum konten)
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploadingImage}
                  description="Pilih multiple gambar untuk gallery (max 5MB per gambar)"
                />
                {uploadingImage && (
                  <p className="text-sm text-default-500 mt-2">
                    Uploading gallery images...
                  </p>
                )}
                {formData.galleryImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {formData.galleryImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Input
                label="Penulis"
                placeholder="Nama penulis"
                value={formData.author}
                onChange={(e: any) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                isRequired
              />

              <div>
                <Input
                  type="datetime-local"
                  label="Tanggal & Waktu Publikasi"
                  value={formData.publishedAt}
                  onChange={(e: any) =>
                    setFormData({ ...formData, publishedAt: e.target.value })
                  }
                  description="Atur tanggal publikasi berita (berguna untuk upload berita lama)"
                  isRequired
                />
              </div>

              <Switch
                isSelected={formData.isPublished}
                onValueChange={(checked) =>
                  setFormData({ ...formData, isPublished: checked })
                }
              >
                <div className="flex flex-col">
                  <p className="text-sm font-medium">Publikasikan Berita</p>
                  <p className="text-xs text-default-500">
                    Berita yang dipublikasikan akan tampil di halaman publik
                  </p>
                </div>
              </Switch>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Batal
            </Button>
            <Button color="primary" onPress={handleSubmit} isLoading={saving}>
              {editingNews ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}
