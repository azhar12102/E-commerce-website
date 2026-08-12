import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

// GET ALL PRODUCTS
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// CREATE PRODUCT - ADMIN ONLY
export async function POST(request: Request) {
  try {
    // Get session cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: 401 }
      );
    }

    // Verify session
    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // Check admin
    const admin = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    // Read request body
    const body = await request.json();

    const {
      name,
      slug,
      description,
      image,
      price,
      oldPrice,
      stock,
      categoryId,
    } = body;

    // Validate required fields
    if (
      !name ||
      !slug ||
      !description ||
      !image ||
      price === undefined ||
      stock === undefined ||
      categoryId === undefined
    ) {
      return NextResponse.json(
        { error: "Please provide all required product fields" },
        { status: 400 }
      );
    }

    // Validate numbers
    if (
      Number(price) < 0 ||
      Number(stock) < 0 ||
      Number(categoryId) <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid price, stock, or category" },
        { status: 400 }
      );
    }

    // Check category
    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check duplicate slug
    const existingProduct = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        image,
        price: Number(price),
        oldPrice:
          oldPrice !== null &&
          oldPrice !== undefined &&
          oldPrice !== ""
            ? Number(oldPrice)
            : null,
        stock: Number(stock),
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}