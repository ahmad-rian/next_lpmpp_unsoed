"use client";

import { useState } from "react";
import { useDisclosure } from "@heroui/modal";

interface DeleteTarget {
  id: string;
  label?: string;
}

/**
 * Standardizes destructive-delete confirmation across the app. Wire it to the
 * shared <DeleteConfirmationModal /> so no page uses native confirm().
 *
 *   const { ask, dialogProps } = useDeleteConfirm(async (id) => {
 *     const res = await fetch(`/api/x?id=${id}`, { method: "DELETE" });
 *     if (res.ok) { notifySuccess("Data dihapus"); refresh(); }
 *     else notifyError("Gagal menghapus data");
 *   });
 *   // trigger: onPress={() => ask(row.id, row.name)}
 *   // render:  <DeleteConfirmationModal {...dialogProps} />
 */
export function useDeleteConfirm(onDelete: (id: string) => Promise<void> | void) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [target, setTarget] = useState<DeleteTarget | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ask = (id: string, label?: string) => {
    setTarget({ id, label });
    onOpen();
  };

  const handleConfirm = async () => {
    if (!target) return;
    setIsLoading(true);
    try {
      await onDelete(target.id);
      onClose();
      setTarget(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ask,
    dialogProps: {
      isOpen,
      onClose,
      onConfirm: handleConfirm,
      isLoading,
      message: target?.label
        ? `Yakin ingin menghapus "${target.label}"? Tindakan ini tidak bisa dibatalkan.`
        : undefined,
    },
  };
}
