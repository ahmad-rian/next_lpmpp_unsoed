import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  badge?: {
    label: string;
    value: number | string;
  };
  children: React.ReactNode;
}

export function AdminPageLayout({
  title,
  description,
  icon,
  action,
  badge,
  children,
}: AdminPageLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-primary">{icon}</div>
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          {description && (
            <p className="text-default-500">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {badge && (
            <Chip color="primary" variant="flat" size="lg">
              {badge.value} {badge.label}
            </Chip>
          )}
          {action}
        </div>
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
