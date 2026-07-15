"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  message = "Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-danger">{title}</span>
        </ModalHeader>
        <ModalBody>
          <p className="text-default-600">{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            isDisabled={isLoading}
          >
            Batal
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            isLoading={isLoading}
          >
            Hapus
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
