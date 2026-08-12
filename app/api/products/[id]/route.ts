import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  const session = await verifySession(token);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return user;
}

// GET SINGLE PRODUCT
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        reviews: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// UPDATE PRODUCT - ADMIN ONLY
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const productId = Number(id);

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
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const duplicateSlug = await prisma.product.findFirst({
      where: {
        slug,
        NOT: {
          id: productId,
        },
      },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        { error: "Another product already uses this slug" },
        { status: 409 }
      );
    }

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

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
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

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE PRODUCT - ADMIN ONLY
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const productId = Number(id);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check whether product is already used in an order
    const orderItems = await prisma.orderItem.count({
      where: {
        productId,
      },
    });

    if (orderItems > 0) {
      return NextResponse.json(
        {
          error:
            "This product cannot be deleted because it exists in customer orders.",
        },
        { status: 409 }
      );
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}