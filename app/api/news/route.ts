import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}

// GET - Fetch all news or single news by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const published = searchParams.get("published");
    const admin = searchParams.get("admin") === "true";
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");
    const limitParam = searchParams.get("limit");
    const page = Math.max(1, Number(pageParam) || 1);
    const pageSize = Math.min(
      1000,
      Math.max(1, Number(limitParam) || Number(pageSizeParam) || 12)
    );

    // Get single news by slug
    if (slug) {
      try {
        // Atomically increment viewCount and return the updated record by slug (unique)
        const news = await prisma.news.update({
          where: { slug },
          data: { viewCount: { increment: 1 } },
        });
        return NextResponse.json(news);
      } catch (e) {
        return NextResponse.json(
          { error: "News not found" },
          { status: 404 }
        );
      }
    }

    // Get all news
    const where = published === "true" ? { isPublished: true } : {};

    const newsList = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      ...(admin
        ? {}
        : {
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              coverImage: true,
              author: true,
              publishedAt: true,
              viewCount: true,
            },
          }),
    });

    return NextResponse.json(newsList);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// POST - Create new news
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, coverImage, galleryImages, author, isPublished, publishedAt } = body;

    console.log("Creating news:", { title, isPublished, publishedAt });

    if (!title || !excerpt || !content || !author) {
      return NextResponse.json(
        { error: "Title, excerpt, content, and author are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    let slugExists = await prisma.news.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${generateSlug(title)}-${counter}`;
      slugExists = await prisma.news.findUnique({ where: { slug } });
      counter++;
    }

    // Use custom publishedAt if provided, otherwise use current date
    const publishDate = publishedAt ? new Date(publishedAt) : new Date();

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        galleryImages,
        author,
        isPublished: Boolean(isPublished),
        publishedAt: publishDate,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}

// PUT - Update news
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, excerpt, content, coverImage, galleryImages, author, isPublished, publishedAt } = body;

    console.log("Updating news:", { id, title, isPublished, publishedAt });

    if (!id) {
      return NextResponse.json(
        { error: "News ID is required" },
        { status: 400 }
      );
    }

    // Get current news to check if it exists
    const currentNews = await prisma.news.findUnique({ where: { id } });
    
    if (!currentNews) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = currentNews.slug;
    if (title && title !== currentNews.title) {
      slug = generateSlug(title);
      let slugExists = await prisma.news.findFirst({
        where: { slug, NOT: { id } },
      });
      let counter = 1;

      while (slugExists) {
        slug = `${generateSlug(title)}-${counter}`;
        slugExists = await prisma.news.findFirst({
          where: { slug, NOT: { id } },
        });
        counter++;
      }
    }

    // Use custom publishedAt if provided, otherwise keep current
    const publishDate = publishedAt ? new Date(publishedAt) : currentNews.publishedAt;

    const news = await prisma.news.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        galleryImages,
        author,
        isPublished: Boolean(isPublished),
        publishedAt: publishDate,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}

// DELETE - Delete news
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "News ID is required" },
        { status: 400 }
      );
    }

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
