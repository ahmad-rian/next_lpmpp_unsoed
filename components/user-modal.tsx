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
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
  user?: User | null;
  isLoading?: boolean;
}

export function UserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading = false,
}: UserModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Update form when user prop changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "USER",
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email format";
    }

    if (!user && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const userData: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    if (user) {
      userData.id = user.id;
      // Only include password if it's being changed
      if (formData.password) {
        userData.password = formData.password;
      }
    } else {
      userData.password = formData.password;
    }

    await onSubmit(userData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {user ? "Edit User" : "Create New User"}
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Name"
              placeholder="Enter user name"
              value={formData.name}
              onValueChange={(value) => handleChange("name", value)}
              variant="bordered"
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              isRequired
            />

            <Input
              label="Email"
              placeholder="Enter email address"
              type="email"
              value={formData.email}
              onValueChange={(value) => handleChange("email", value)}
              variant="bordered"
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              isRequired
            />

            <Input
              label={user ? "Password (leave blank to keep current)" : "Password"}
              placeholder="Enter password"
              type="password"
              value={formData.password}
              onValueChange={(value) => handleChange("password", value)}
              variant="bordered"
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              isRequired={!user}
            />

            <Select
              label="Role"
              placeholder="Select role"
              selectedKeys={[formData.role]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleChange("role", value);
              }}
              variant="bordered"
              isRequired
            >
              <SelectItem key="USER">
                User
              </SelectItem>
              <SelectItem key="ADMIN">
                Admin
              </SelectItem>
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            {user ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
