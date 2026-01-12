"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { AdminPageLayout } from "@/components/admin-page-layout";

// Icons
const ShieldIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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

interface Permission {
    id: string;
    name: string;
    displayName: string;
    module: string;
}

interface Role {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    color: string;
    isSystem: boolean;
    permissions: { permission: Permission }[];
    _count: {
        users: number;
        permissions: number;
    };
}

interface PermissionGroup {
    module: string;
    permissions: Permission[];
}

const COLOR_OPTIONS = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#eab308", // yellow
    "#84cc16", // lime
    "#22c55e", // green
    "#14b8a6", // teal
    "#06b6d4", // cyan
    "#0ea5e9", // sky
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#a855f7", // purple
    "#d946ef", // fuchsia
    "#ec4899", // pink
    "#6b7280", // gray
];

export default function RolesPage() {
    const [roles, setRoles] = React.useState<Role[]>([]);
    const [permissions, setPermissions] = React.useState<PermissionGroup[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingRole, setEditingRole] = React.useState<Role | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

    const [formData, setFormData] = React.useState({
        name: "",
        displayName: "",
        description: "",
        color: "#6366f1",
        permissionIds: [] as string[],
    });

    // Fetch roles
    const fetchRoles = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/roles?includePermissions=true");
            if (response.ok) {
                const data = await response.json();
                setRoles(data);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch permissions
    const fetchPermissions = React.useCallback(async () => {
        try {
            const response = await fetch("/api/permissions?groupByModule=true");
            if (response.ok) {
                const data = await response.json();
                setPermissions(data);
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    }, []);

    React.useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, [fetchRoles, fetchPermissions]);

    // Clear message after 5 seconds
    React.useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleCreateRole = () => {
        setEditingRole(null);
        setFormData({
            name: "",
            displayName: "",
            description: "",
            color: "#6366f1",
            permissionIds: [],
        });
        setIsModalOpen(true);
    };

    const handleEditRole = (role: Role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            displayName: role.displayName,
            description: role.description || "",
            color: role.color,
            permissionIds: role.permissions.map(p => p.permission.id),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.displayName.trim()) {
            setMessage({ type: "error", text: "Display name is required" });
            return;
        }

        try {
            setIsSubmitting(true);
            const method = editingRole ? "PUT" : "POST";
            const body = editingRole
                ? { id: editingRole.id, ...formData }
                : formData;

            const response = await fetch("/api/roles", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: editingRole ? "Role updated successfully" : "Role created successfully",
                });
                setIsModalOpen(false);
                fetchRoles();
            } else {
                const error = await response.json();
                setMessage({ type: "error", text: error.error || "Failed to save role" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRole = async (role: Role) => {
        if (role.isSystem) {
            setMessage({ type: "error", text: "Cannot delete system role" });
            return;
        }

        if (!confirm(`Are you sure you want to delete "${role.displayName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/roles?id=${role.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setMessage({ type: "success", text: "Role deleted successfully" });
                fetchRoles();
            } else {
                const error = await response.json();
                setMessage({ type: "error", text: error.error || "Failed to delete role" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred" });
        }
    };

    const togglePermission = (permissionId: string) => {
        setFormData(prev => ({
            ...prev,
            permissionIds: prev.permissionIds.includes(permissionId)
                ? prev.permissionIds.filter(id => id !== permissionId)
                : [...prev.permissionIds, permissionId],
        }));
    };

    const toggleModulePermissions = (module: string, checked: boolean) => {
        const modulePerms = permissions.find(p => p.module === module)?.permissions || [];
        const modulePermIds = modulePerms.map(p => p.id);

        setFormData(prev => ({
            ...prev,
            permissionIds: checked
                ? Array.from(new Set([...prev.permissionIds, ...modulePermIds]))
                : prev.permissionIds.filter(id => !modulePermIds.includes(id)),
        }));
    };

    const isModuleFullySelected = (module: string) => {
        const modulePerms = permissions.find(p => p.module === module)?.permissions || [];
        return modulePerms.every(p => formData.permissionIds.includes(p.id));
    };

    const isModulePartiallySelected = (module: string) => {
        const modulePerms = permissions.find(p => p.module === module)?.permissions || [];
        const selectedCount = modulePerms.filter(p => formData.permissionIds.includes(p.id)).length;
        return selectedCount > 0 && selectedCount < modulePerms.length;
    };

    return (
        <>
            <AdminPageLayout
                icon={<ShieldIcon className="w-8 h-8" />}
                title="Role Management"
                description="Kelola role dan permissions untuk user"
                badge={{
                    label: "Total Roles",
                    value: roles.length,
                }}
                action={
                    <Button
                        color="primary"
                        startContent={<PlusIcon className="w-5 h-5" />}
                        onPress={handleCreateRole}
                    >
                        Add Role
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
                            <p className={`text-sm ${message.type === "success" ? "text-success" : "text-danger"}`}>
                                {message.text}
                            </p>
                        </CardBody>
                    </Card>
                )}

                {/* Roles Table */}
                <Card>
                    <CardBody className="p-0">
                        <Table
                            aria-label="Roles table"
                            removeWrapper
                            classNames={{
                                th: "bg-default-100 text-default-700 font-semibold",
                                td: "py-4",
                            }}
                        >
                            <TableHeader>
                                <TableColumn>ROLE</TableColumn>
                                <TableColumn>DESCRIPTION</TableColumn>
                                <TableColumn>PERMISSIONS</TableColumn>
                                <TableColumn>USERS</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody
                                isLoading={loading}
                                loadingContent="Loading roles..."
                                emptyContent="No roles found"
                            >
                                {roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Chip
                                                    style={{ backgroundColor: role.color, color: "#fff" }}
                                                    size="sm"
                                                >
                                                    {role.displayName}
                                                </Chip>
                                                {role.isSystem && (
                                                    <Chip size="sm" variant="flat" color="warning">
                                                        System
                                                    </Chip>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-default-600 text-sm">
                                                {role.description || "-"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="sm" variant="flat">
                                                {role._count.permissions} permissions
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="sm" variant="flat" color="primary">
                                                {role._count.users} users
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    color="primary"
                                                    onPress={() => handleEditRole(role)}
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </Button>
                                                {!role.isSystem && (
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        color="danger"
                                                        onPress={() => handleDeleteRole(role)}
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </AdminPageLayout>

            {/* Role Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                size="4xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader>
                        {editingRole ? `Edit Role: ${editingRole.displayName}` : "Create New Role"}
                    </ModalHeader>
                    <ModalBody>
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Display Name"
                                    placeholder="e.g., Content Editor"
                                    value={formData.displayName}
                                    onValueChange={(v) => setFormData(prev => ({ ...prev, displayName: v }))}
                                    isRequired
                                />
                                <Input
                                    label="Name (Slug)"
                                    placeholder="e.g., content-editor"
                                    value={formData.name}
                                    onValueChange={(v) => setFormData(prev => ({ ...prev, name: v }))}
                                    isDisabled={editingRole?.isSystem}
                                    description="Unique identifier for the role"
                                />
                            </div>

                            <Textarea
                                label="Description"
                                placeholder="Describe what this role can do..."
                                value={formData.description}
                                onValueChange={(v) => setFormData(prev => ({ ...prev, description: v }))}
                            />

                            {/* Color Picker */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Role Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_OPTIONS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${formData.color === color ? "ring-2 ring-offset-2 ring-primary" : ""
                                                }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Permissions */}
                            <div>
                                <label className="text-sm font-medium mb-3 block">Permissions</label>
                                <div className="space-y-4 max-h-80 overflow-y-auto">
                                    {permissions.map((group) => (
                                        <Card key={group.module} className="bg-default-50">
                                            <CardHeader className="py-3">
                                                <Checkbox
                                                    isSelected={isModuleFullySelected(group.module)}
                                                    isIndeterminate={isModulePartiallySelected(group.module)}
                                                    onValueChange={(checked) => toggleModulePermissions(group.module, checked)}
                                                >
                                                    <span className="font-semibold capitalize">{group.module}</span>
                                                </Checkbox>
                                            </CardHeader>
                                            <CardBody className="pt-0">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-6">
                                                    {group.permissions.map((perm) => (
                                                        <Checkbox
                                                            key={perm.id}
                                                            isSelected={formData.permissionIds.includes(perm.id)}
                                                            onValueChange={() => togglePermission(perm.id)}
                                                            size="sm"
                                                        >
                                                            {perm.displayName}
                                                        </Checkbox>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="light"
                            onPress={() => setIsModalOpen(false)}
                            isDisabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleSubmit}
                            isLoading={isSubmitting}
                        >
                            {editingRole ? "Update" : "Create"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
