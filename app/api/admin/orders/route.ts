import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET() {
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

    // Find logged-in user
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check admin role
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    // Get all orders
    // user is optional because guest orders do not have a user
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Format orders so both guest and logged-in orders
    // have consistent customer information
    const formattedOrders = orders.map((order) => ({
      ...order,

      customer: {
        name: order.user?.name || order.customerName,
        email: order.user?.email || "Guest Customer",
        phone: order.user?.phone || order.customerPhone,
        address:
          order.user?.address || order.customerAddress,
      },
    }));

    return NextResponse.json({
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("ADMIN ORDERS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch admin orders",
      },
      { status: 500 }
    );
  }
}
