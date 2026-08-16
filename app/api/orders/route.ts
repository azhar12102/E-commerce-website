import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CREATE ORDER - GUEST CHECKOUT
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      total,
      paymentMethod,
      items,
      customerName,
      customerPhone,
      customerAddress,
    } = body;

    // Validate order data
    if (
      total === undefined ||
      !paymentMethod ||
      paymentMethod !== "Cash on Delivery" ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !customerName ||
      !customerPhone ||
      !customerAddress
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide customer name, phone, address, and valid order details.",
        },
        { status: 400 }
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      // Check every product and stock
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

      // Create guest order
      const newOrder = await tx.order.create({
        data: {
          total: Number(total),
          paymentMethod: "Cash on Delivery",
          customerName: String(customerName).trim(),
          customerPhone: String(customerPhone).trim(),
          customerAddress: String(customerAddress).trim(),

          // Guest order

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

      // Reduce product stock
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
        message: "Order placed successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORDER ERROR:", error);

    if (error instanceof Error) {
      if (error.message === "INVALID_ITEM") {
        return NextResponse.json(
          { error: "Invalid product quantity." },
          { status: 400 }
        );
      }

      if (error.message.startsWith("PRODUCT_NOT_FOUND:")) {
        return NextResponse.json(
          { error: "One of the products no longer exists." },
          { status: 404 }
        );
      }

      if (error.message.startsWith("OUT_OF_STOCK:")) {
        const productName = error.message.split(":")[1];

        return NextResponse.json(
          {
            error: `${productName} is out of stock.`,
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
            error: `${productName} only has ${availableStock} item(s) available.`,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Something went wrong while creating the order.",
      },
      { status: 500 }
    );
  }
}

// GET ALL ORDERS
// Currently returns all orders.
// Later we can make this admin-only.
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
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
      {
        error: "Failed to fetch orders.",
      },
      { status: 500 }
    );
  }
}
