"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { AdminPageLayout } from "@/components/admin-page-layout";
import { UserModal } from "@/components/user-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";

// Heroicons
const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
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
  image: string | null;
  isActive: boolean;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roles: { role: Role }[];
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch users
  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({
        type: "error",
        text: "Failed to load users",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Clear message after 5 seconds
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle create/update user
  const handleSubmitUser = async (userData: any) => {
    try {
      setIsSubmitting(true);
      const isUpdate = !!userData.id;
      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch("/api/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: isUpdate ? "User updated successfully" : "User created successfully",
        });
        setIsUserModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.error || "Failed to save user",
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      setMessage({
        type: "error",
        text: "An error occurred while saving user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/users?id=${selectedUser.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "User deleted successfully",
        });
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.error || "Failed to delete user",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage({
        type: "error",
        text: "An error occurred while deleting user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open create modal
  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  // Open edit modal
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  // Open delete modal
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <AdminPageLayout
        icon={<UsersIcon className="w-8 h-8" />}
        title="User Management"
        description="Kelola pengguna yang terdaftar di sistem"
        badge={{
          label: "Total Users",
          value: users.length,
        }}
        action={
          <Button
            color="primary"
            startContent={<PlusIcon className="w-5 h-5" />}
            onPress={handleCreateUser}
          >
            Add User
          </Button>
        }
      >
        {/* Message Alert */}
        {message && (
          <Card
            className={`mb-4 ${message.type === "success"
                ? "bg-success-50 border-success"
                : "bg-danger-50 border-danger"
              }`}
          >
            <CardBody>
              <p
                className={`text-sm ${message.type === "success" ? "text-success" : "text-danger"
                  }`}
              >
                {message.text}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardBody className="p-0">
            <Table
              aria-label="Users table"
              removeWrapper
              classNames={{
                th: "bg-default-100 text-default-700 font-semibold",
                td: "py-4",
              }}
            >
              <TableHeader>
                <TableColumn>USER</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>ROLES</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>JOINED</TableColumn>
                <TableColumn align="center">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody
                isLoading={loading}
                loadingContent="Loading users..."
                emptyContent="No users found"
              >
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.image || undefined}
                          name={user.name || user.email}
                          size="sm"
                          showFallback
                          isBordered
                        />
                        <span className="font-medium">
                          {user.name || "No Name"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-default-600">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(({ role }) => (
                          <Chip
                            key={role.id}
                            size="sm"
                            style={{ backgroundColor: role.color, color: "#fff" }}
                          >
                            {role.displayName}
                          </Chip>
                        ))}
                        {user.roles.length === 0 && (
                          <Chip size="sm" variant="flat" color="default">
                            No roles
                          </Chip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={user.isActive ? "success" : "danger"}
                        variant="flat"
                        size="sm"
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-default-500">
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                          onPress={() => handleEditUser(user)}
                          aria-label="Edit user"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => handleDeleteClick(user)}
                          aria-label="Delete user"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </AdminPageLayout>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSubmitUser}
        user={selectedUser}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name || selectedUser?.email}? This action cannot be undone and will remove all associated data.`}
        isLoading={isSubmitting}
      />
    </>
  );
}
