import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

// CREATE ORDER
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please login to place an order" },
        { status: 401 }
      );
    }

    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json(
        { error: "Session expired. Please login again." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { total, paymentMethod, items } = body;

    if (
      total === undefined ||
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    // Check user
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /*
     * Use a transaction so:
     *
     * 1. Stock is checked
     * 2. Order is created
     * 3. Stock is reduced
     *
     * If something fails, everything is rolled back.
     */
    const order = await prisma.$transaction(async (tx) => {
      // Check every product before creating the order
      for (const item of items) {
        const productId = Number(item.id);
        const quantity = Number(item.quantity);

        if (
          !Number.isInteger(productId) ||
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          throw new Error("INVALID_ITEM");
        }

        const product = await tx.product.findUnique({
          where: {
            id: productId,
          },
        });

        if (!product) {
          throw new Error(`PRODUCT_NOT_FOUND:${productId}`);
        }

        if (product.stock <= 0) {
          throw new Error(`OUT_OF_STOCK:${product.name}`);
        }

        if (product.stock < quantity) {
          throw new Error(
            `INSUFFICIENT_STOCK:${product.name}:${product.stock}`
          );
        }
      }

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: session.userId,
          total: Number(total),
          paymentMethod,

          items: {
            create: items.map(
              (item: {
                id: number;
                price: number;
                quantity: number;
              }) => ({
                productId: Number(item.id),
                price: Number(item.price),
                quantity: Number(item.quantity),
              })
            ),
          },
        },

        include: {
          items: true,
        },
      });

      // Reduce stock
      for (const item of items) {
        await tx.product.update({
          where: {
            id: Number(item.id),
          },
          data: {
            stock: {
              decrement: Number(item.quantity),
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORDER ERROR:", error);

    if (error instanceof Error) {
      if (error.message === "INVALID_ITEM") {
        return NextResponse.json(
          { error: "Invalid product quantity" },
          { status: 400 }
        );
      }

      if (error.message.startsWith("PRODUCT_NOT_FOUND:")) {
        return NextResponse.json(
          { error: "One of the products no longer exists" },
          { status: 404 }
        );
      }

      if (error.message.startsWith("OUT_OF_STOCK:")) {
        const productName = error.message.split(":")[1];

        return NextResponse.json(
          {
            error: `${productName} is out of stock`,
          },
          { status: 400 }
        );
      }

      if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
        const parts = error.message.split(":");
        const productName = parts[1];
        const availableStock = parts[2];

        return NextResponse.json(
          {
            error: `${productName} only has ${availableStock} item(s) available`,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong while creating the order" },
      { status: 500 }
    );
  }
}

// GET USER ORDERS
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please login to view your orders" },
        { status: 401 }
      );
    }

    const session = await verifySession(token);

    if (!session) {
      return NextResponse.json(
        { error: "Session expired. Please login again." },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}