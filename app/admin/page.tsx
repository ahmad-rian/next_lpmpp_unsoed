import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard-client";
import { AdminPageLayout } from "@/components/admin-page-layout";

// Dashboard Icon
const LayoutDashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

export default async function AdminDashboard() {
  const session = await auth();
  
  // Redirect if not authenticated or not an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  // Get statistics from all tables
  const [
    totalUsers,
    totalLeadership,
    totalStaff,
    totalCenters,
    totalFaculties,
    totalGPM,
    totalUniversityAccreditation,
    totalFeaturedPrograms,
    totalExpertise,
    totalLinks,
    totalNews,
    totalDownloads,
    publishedNews,
    totalNewsViews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.leadership.count(),
    prisma.staff.count(),
    prisma.center.count(),
    prisma.faculty.count(),
    prisma.qualityAssuranceGroup.count(),
    prisma.universityAccreditation.count(),
    prisma.featuredProgram.count(),
    prisma.expertise.count(),
    prisma.link.count(),
    prisma.news.count(),
    prisma.download.count(),
    prisma.news.count({ where: { isPublished: true } }),
    prisma.news.aggregate({ _sum: { viewCount: true } }),
  ]);

  // Get monthly trend data for the last 5 months (real data from createdAt)
  const currentDate = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendData = [];

  for (let i = 4; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
    const monthName = monthNames[monthDate.getMonth()];

    const [newsCount, programCount, expertiseCount, downloadCount, linkCount] = await Promise.all([
      prisma.news.count({
        where: {
          createdAt: {
            gte: monthDate,
            lt: nextMonthDate,
          },
        },
      }),
      prisma.featuredProgram.count({
        where: {
          createdAt: {
            gte: monthDate,
            lt: nextMonthDate,
          },
        },
      }),
      prisma.expertise.count({
        where: {
          createdAt: {
            gte: monthDate,
            lt: nextMonthDate,
          },
        },
      }),
      prisma.download.count({
        where: {
          createdAt: {
            gte: monthDate,
            lt: nextMonthDate,
          },
        },
      }),
      prisma.link.count({
        where: {
          createdAt: {
            gte: monthDate,
            lt: nextMonthDate,
          },
        },
      }),
    ]);

    trendData.push({
      month: monthName,
      Berita: newsCount,
      Program: programCount,
      Kepakaran: expertiseCount,
      Unduhan: downloadCount,
      Tautan: linkCount,
      total: newsCount + programCount + expertiseCount + downloadCount + linkCount,
    });
  }

  // Prepare stats data for client component
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Berita",
      value: totalNews,
      color: "bg-green-500",
      subtitle: `${publishedNews} Published`,
    },
    {
      title: "Program Unggulan",
      value: totalFeaturedPrograms,
      color: "bg-purple-500",
    },
    {
      title: "Kepakaran",
      value: totalExpertise,
      color: "bg-orange-500",
    },
    {
      title: "Unduhan",
      value: totalDownloads,
      color: "bg-pink-500",
    },
    {
      title: "Tautan",
      value: totalLinks,
      color: "bg-cyan-500",
    },
    {
      title: "Total Views",
      value: totalNewsViews._sum.viewCount || 0,
      color: "bg-indigo-500",
    },
    {
      title: "GPM",
      value: totalGPM,
      color: "bg-teal-500",
    },
  ];

  // Content stats for chart with colors
  const contentStats = [
    { name: "Leadership", count: totalLeadership, color: "bg-blue-500" },
    { name: "Staff", count: totalStaff, color: "bg-green-500" },
    { name: "Centers", count: totalCenters, color: "bg-purple-500" },
    { name: "Faculties", count: totalFaculties, color: "bg-orange-500" },
    { name: "Accreditation", count: totalUniversityAccreditation, color: "bg-pink-500" },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Tambah Berita",
      description: "Buat artikel berita baru",
      href: "/admin/berita",
      color: "bg-blue-500",
    },
    {
      title: "Tambah Program",
      description: "Tambah program unggulan",
      href: "/admin/program-unggulan",
      color: "bg-purple-500",
    },
    {
      title: "Upload Dokumen",
      description: "Upload file unduhan",
      href: "/admin/unduhan",
      color: "bg-pink-500",
    },
    {
      title: "Kelola Tautan",
      description: "Tambah atau edit tautan",
      href: "/admin/tautan",
      color: "bg-cyan-500",
    },
  ];

  return (
    <AdminPageLayout
      icon={<LayoutDashboardIcon />}
      title="Dashboard"
      description="Overview of LPMPP UNSOED system and quick access to key features"
    >
      <DashboardClient
        stats={stats}
        contentStats={contentStats}
        trendData={trendData}
        quickActions={quickActions}
        userName={session?.user?.name || "Admin"}
      />
    </AdminPageLayout>
  );
}
