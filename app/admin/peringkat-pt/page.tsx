"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { ImageUpload } from "@/components/image-upload";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";

const showNotification = (message: string, type: "success" | "error" = "success") => {
  alert(message);
};

// Icons
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228M18.75 4.236V2.721M12 14.25a7.5 7.5 0 00.981-3.172m-.981 3.172V17.25m0-6.168a7.5 7.5 0 01-.981-3.172"
    />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
    />
  </svg>
);

const FlagIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
    />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

interface UniversityRanking {
  id: string;
  institution: string;
  year: number;
  rankNational: number | null;
  rankWorld: number | null;
  rankAsia: number | null;
  score: number | null;
  badge: string | null;
  description: string | null;
  sourceUrl: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const INSTITUTIONS = [
  { key: "WEBOMETRICS", label: "Webometrics", color: "primary" },
  { key: "QS", label: "QS World University Rankings", color: "secondary" },
  { key: "APPLIEDHE", label: "AppliedHE", color: "success" },
  { key: "THE_WUR", label: "Times Higher Education (THE)", color: "warning" },
  { key: "SCOPUS", label: "Scopus", color: "danger" },
];

const getInstitutionLabel = (key: string) => {
  return INSTITUTIONS.find((i) => i.key === key)?.label || key;
};

const getInstitutionColor = (key: string) => {
  return (INSTITUTIONS.find((i) => i.key === key)?.color || "default") as
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "default";
};

export default function PeringkatPTPage() {
  const [rankings, setRankings] = useState<UniversityRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    institution: "",
    year: new Date().getFullYear().toString(),
    rankNational: "",
    rankWorld: "",
    rankAsia: "",
    score: "",
    badge: "",
    description: "",
    sourceUrl: "",
    logoUrl: "",
    isActive: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteItem, setDeleteItem] = useState<UniversityRanking | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const fetchRankings = useCallback(async () => {
    try {
      const response = await fetch("/api/university-rankings?active=false");
      if (response.ok) {
        const data = await response.json();
        setRankings(data);
      }
    } catch (error) {
      console.error("Error fetching rankings:", error);
      showNotification("Gagal mengambil data peringkat", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const resetForm = () => {
    setFormData({
      id: "",
      institution: "",
      year: new Date().getFullYear().toString(),
      rankNational: "",
      rankWorld: "",
      rankAsia: "",
      score: "",
      badge: "",
      description: "",
      sourceUrl: "",
      logoUrl: "",
      isActive: true,
    });
    setIsEditing(false);
  };

  const handleOpenModal = (ranking?: UniversityRanking) => {
    if (ranking) {
      setFormData({
        id: ranking.id,
        institution: ranking.institution,
        year: ranking.year.toString(),
        rankNational: ranking.rankNational?.toString() || "",
        rankWorld: ranking.rankWorld?.toString() || "",
        rankAsia: ranking.rankAsia?.toString() || "",
        score: ranking.score?.toString() || "",
        badge: ranking.badge || "",
        description: ranking.description || "",
        sourceUrl: ranking.sourceUrl || "",
        logoUrl: ranking.logoUrl || "",
        isActive: ranking.isActive,
      });
      setIsEditing(true);
    } else {
      resetForm();
    }
    onOpen();
  };

  const handleSubmit = async () => {
    if (!formData.institution || !formData.year) {
      showNotification("Lembaga dan tahun harus diisi", "error");
      return;
    }

    try {
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch("/api/university-rankings", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification(
          isEditing
            ? "Peringkat berhasil diupdate"
            : "Peringkat berhasil ditambahkan"
        );
        fetchRankings();
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error("Error saving ranking:", error);
      showNotification("Gagal menyimpan data peringkat", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const response = await fetch(
        `/api/university-rankings?id=${deleteItem.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        showNotification("Peringkat berhasil dihapus");
        fetchRankings();
        onDeleteClose();
        setDeleteItem(null);
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting ranking:", error);
      showNotification("Gagal menghapus peringkat", "error");
    }
  };

  const confirmDelete = (ranking: UniversityRanking) => {
    setDeleteItem(ranking);
    onDeleteOpen();
  };

  // Group rankings by institution for statistics
  const statsByInstitution = INSTITUTIONS.map((inst) => {
    const instRankings = rankings.filter((r) => r.institution === inst.key);
    const latestYear =
      instRankings.length > 0
        ? Math.max(...instRankings.map((r) => r.year))
        : null;
    const latestRanking = instRankings.find((r) => r.year === latestYear);
    return {
      ...inst,
      count: instRankings.length,
      latestYear,
      latestRanking,
    };
  });

  return (
    <AdminPageLayout title="Peringkat PT" icon={<TrophyIcon className="w-5 h-5" />}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statsByInstitution.map((stat) => (
          <Card key={stat.key} className="bg-default-50">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}
                >
                  <TrophyIcon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-default-500">{stat.label}</p>
                  <p className="text-lg font-bold">
                    {stat.latestRanking?.rankNational
                      ? `#${stat.latestRanking.rankNational}`
                      : "-"}
                  </p>
                  <p className="text-xs text-default-400">
                    {stat.latestYear ? `(${stat.latestYear})` : "No data"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <Button
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
          onPress={() => handleOpenModal()}
        >
          Tambah Peringkat
        </Button>
      </div>

      {/* Table */}
      <Table aria-label="Tabel peringkat PT">
        <TableHeader>
          <TableColumn>LEMBAGA</TableColumn>
          <TableColumn>TAHUN</TableColumn>
          <TableColumn>PERINGKAT NASIONAL</TableColumn>
          <TableColumn>PERINGKAT DUNIA</TableColumn>
          <TableColumn>PERINGKAT ASIA</TableColumn>
          <TableColumn>SKOR</TableColumn>
          <TableColumn>BADGE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>AKSI</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={loading}
          emptyContent="Tidak ada data peringkat"
          items={rankings}
        >
          {(ranking: UniversityRanking) => (
            <TableRow key={ranking.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {ranking.logoUrl && (
                    <img
                      src={ranking.logoUrl}
                      alt={getInstitutionLabel(ranking.institution)}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <Chip
                    color={getInstitutionColor(ranking.institution)}
                    variant="flat"
                    size="sm"
                  >
                    {getInstitutionLabel(ranking.institution)}
                  </Chip>
                </div>
              </TableCell>
              <TableCell>{ranking.year}</TableCell>
              <TableCell>
                {ranking.rankNational && (
                  <div className="flex items-center gap-1">
                    <FlagIcon className="w-3 h-3 text-primary" />
                    <span className="font-semibold">#{ranking.rankNational}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {ranking.rankWorld && (
                  <div className="flex items-center gap-1">
                    <GlobeIcon className="w-3 h-3 text-success" />
                    <span className="font-semibold">#{ranking.rankWorld}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {ranking.rankAsia && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-3 h-3 text-warning" />
                    <span className="font-semibold">#{ranking.rankAsia}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{ranking.score || "-"}</TableCell>
              <TableCell>
                {ranking.badge && (
                  <Chip size="sm" variant="bordered">
                    {ranking.badge}
                  </Chip>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  color={ranking.isActive ? "success" : "default"}
                  variant="flat"
                  size="sm"
                >
                  {ranking.isActive ? "Aktif" : "Nonaktif"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={() => handleOpenModal(ranking)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => confirmDelete(ranking)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            {isEditing ? "Edit Peringkat" : "Tambah Peringkat Baru"}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Lembaga Pemeringkat"
                placeholder="Pilih lembaga"
                selectedKeys={formData.institution ? [formData.institution] : []}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                isRequired
              >
                {INSTITUTIONS.map((inst) => (
                  <SelectItem key={inst.key}>{inst.label}</SelectItem>
                ))}
              </Select>

              <Input
                label="Tahun"
                type="number"
                value={formData.year}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                isRequired
              />

              <Input
                label="Peringkat Nasional"
                type="number"
                placeholder="e.g., 10"
                value={formData.rankNational}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, rankNational: e.target.value })
                }
                startContent={<FlagIcon className="w-4 h-4 text-primary" />}
              />

              <Input
                label="Peringkat Dunia"
                type="number"
                placeholder="e.g., 1000"
                value={formData.rankWorld}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, rankWorld: e.target.value })
                }
                startContent={<GlobeIcon className="w-4 h-4 text-success" />}
              />

              <Input
                label="Peringkat Asia"
                type="number"
                placeholder="e.g., 300"
                value={formData.rankAsia}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, rankAsia: e.target.value })
                }
                startContent={<MapPinIcon className="w-4 h-4 text-warning" />}
              />

              <Input
                label="Skor"
                type="number"
                step="0.01"
                placeholder="e.g., 45.5"
                value={formData.score}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, score: e.target.value })
                }
              />

              <Input
                label="Badge/Kategori"
                placeholder="e.g., Rising Star, Impact Rankings"
                value={formData.badge}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, badge: e.target.value })
                }
                className="md:col-span-2"
              />

              <Input
                label="URL Sumber"
                placeholder="https://..."
                value={formData.sourceUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, sourceUrl: e.target.value })
                }
                className="md:col-span-2"
              />

              <div className="md:col-span-2">
                <ImageUpload
                  label="Logo Lembaga"
                  value={formData.logoUrl}
                  onChange={(url: string) => setFormData({ ...formData, logoUrl: url })}
                />
              </div>

              <Textarea
                label="Deskripsi"
                placeholder="Deskripsi tambahan tentang peringkat ini"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="md:col-span-2"
              />

              <div className="md:col-span-2">
                <Switch
                  isSelected={formData.isActive}
                  onValueChange={(value: boolean) =>
                    setFormData({ ...formData, isActive: value })
                  }
                >
                  Aktif
                </Switch>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Batal
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              {isEditing ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
        title="Hapus Peringkat"
        message={`Apakah Anda yakin ingin menghapus peringkat ${deleteItem ? getInstitutionLabel(deleteItem.institution) : ""} tahun ${deleteItem?.year}?`}
      />
    </AdminPageLayout>
  );
}
