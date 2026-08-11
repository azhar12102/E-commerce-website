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

    if (!total || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

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

    const order = await prisma.order.create({
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

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORDER ERROR:", error);

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