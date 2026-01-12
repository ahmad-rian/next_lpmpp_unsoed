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
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";

interface Role {
  id: string;
  name: string;
  displayName: string;
  color: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  isActive: boolean;
  roles: { role: Role }[];
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
    isActive: true,
    roleIds: [] as string[],
  });

  const [roles, setRoles] = React.useState<Role[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loadingRoles, setLoadingRoles] = React.useState(false);

  // Fetch roles when modal opens
  React.useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await fetch("/api/roles");
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoadingRoles(false);
    }
  };

  // Update form when user prop changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email,
        password: "",
        isActive: user.isActive,
        roleIds: user.roles?.map(r => r.role.id) || [],
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        isActive: true,
        roleIds: [],
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

    if (formData.roleIds.length === 0) {
      newErrors.roles = "At least one role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const userData: any = {
      name: formData.name,
      email: formData.email,
      isActive: formData.isActive,
      roleIds: formData.roleIds,
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

  const handleChange = (field: string, value: any) => {
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

  const toggleRole = (roleId: string) => {
    const newRoleIds = formData.roleIds.includes(roleId)
      ? formData.roleIds.filter(id => id !== roleId)
      : [...formData.roleIds, roleId];
    handleChange("roleIds", newRoleIds);
    if (errors.roles) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.roles;
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

            {/* Roles Selection */}
            <div className="space-y-2">
              <span className="text-sm font-medium">
                Roles <span className="text-danger">*</span>
              </span>
              {loadingRoles ? (
                <div className="text-sm text-default-500">Loading roles...</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <Chip
                      key={role.id}
                      style={{
                        backgroundColor: formData.roleIds.includes(role.id)
                          ? role.color
                          : undefined,
                        color: formData.roleIds.includes(role.id)
                          ? "#fff"
                          : undefined,
                      }}
                      variant={formData.roleIds.includes(role.id) ? "solid" : "bordered"}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => toggleRole(role.id)}
                    >
                      {formData.roleIds.includes(role.id) && (
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                      {role.displayName}
                    </Chip>
                  ))}
                </div>
              )}
              {errors.roles && (
                <p className="text-danger text-xs">{errors.roles}</p>
              )}
            </div>

            {/* Active Status */}
            <Checkbox
              isSelected={formData.isActive}
              onValueChange={(value) => handleChange("isActive", value)}
            >
              Active User
            </Checkbox>
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
