import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await auth();
  
  // Redirect if not authenticated or not an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  // Get statistics
  const totalUsers = await prisma.user.count();
  const totalAdmins = await prisma.user.count({
    where: { role: "ADMIN" },
  });
  const totalRegularUsers = await prisma.user.count({
    where: { role: "USER" },
  });

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      color: "primary" as const,
      icon: "👥",
    },
    {
      title: "Admins",
      value: totalAdmins,
      color: "success" as const,
      icon: "👑",
    },
    {
      title: "Regular Users",
      value: totalRegularUsers,
      color: "warning" as const,
      icon: "👤",
    },
    {
      title: "Sessions",
      value: await prisma.session.count(),
      color: "secondary" as const,
      icon: "🔐",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-default-500 mt-2">
          Welcome back, {session?.user?.name || "Admin"}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-md">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
              <Divider className="my-3" />
              <Chip color={stat.color} variant="flat" size="sm">
                Active
              </Chip>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-xl font-bold">System Information</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-default-500">Database</span>
                <Chip color="success" variant="dot" size="sm">
                  MySQL Connected
                </Chip>
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <span className="text-default-500">Authentication</span>
                <Chip color="success" variant="dot" size="sm">
                  Auth.js Active
                </Chip>
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <span className="text-default-500">Your Role</span>
                <Chip color="primary" variant="flat" size="sm">
                  {session?.user?.role}
                </Chip>
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <span className="text-default-500">Email</span>
                <span className="text-sm font-medium">
                  {session?.user?.email}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-0 pt-6 px-6">
            <h3 className="text-xl font-bold">Quick Actions</h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-3">
              <a
                href="/admin/users"
                className="block p-4 rounded-lg border border-default-200 hover:border-primary hover:bg-default-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-semibold">Manage Users</p>
                    <p className="text-sm text-default-500">
                      View and manage all users
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/content"
                className="block p-4 rounded-lg border border-default-200 hover:border-primary hover:bg-default-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="font-semibold">Manage Content</p>
                    <p className="text-sm text-default-500">
                      Create and edit content
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/analytics"
                className="block p-4 rounded-lg border border-default-200 hover:border-primary hover:bg-default-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-semibold">View Analytics</p>
                    <p className="text-sm text-default-500">
                      Check website statistics
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/settings"
                className="block p-4 rounded-lg border border-default-200 hover:border-primary hover:bg-default-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="font-semibold">Settings</p>
                    <p className="text-sm text-default-500">
                      Configure system settings
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
