"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
};

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: Product;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

type Order = {
  id: string;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;

  // Guest customer information
  customerName: string;
  customerPhone: string;
  customerAddress: string;

  // User can be null for guest orders
  user: User | null;

  items: OrderItem[];
};

const statuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to load orders");
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("FETCH ADMIN ORDERS ERROR:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    orderId: string,
    status: string
  ) => {
    try {
      setUpdatingOrder(orderId);

      const response = await fetch(
        `/api/admin/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to update order status"
        );
        return;
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );

      toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold">
          Manage Orders
        </h1>

        <div className="rounded-lg border bg-white p-10 text-center">
          Loading orders...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Manage Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View and manage customer orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white hover:bg-gray-800"
        >
          Refresh Orders
        </button>
      </div>

      {/* No Orders */}
      {orders.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center shadow">
          <h2 className="text-2xl font-semibold">
            No Orders Found
          </h2>

          <p className="mt-2 text-gray-500">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            // Logged-in user information
            const customerName =
              order.user?.name || order.customerName;

            const customerEmail =
              order.user?.email || "Guest Customer";

            const customerPhone =
              order.customerPhone ||
              order.user?.phone ||
              "Not provided";

            const customerAddress =
              order.customerAddress ||
              order.user?.address ||
              "Not provided";

            return (
              <div
                key={order.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                {/* Order Header */}
                <div className="mb-6 flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      Order #{order.id}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Date:{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Payment:{" "}
                      <span className="font-semibold text-gray-700">
                        {order.paymentMethod}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Customer Type:{" "}
                      <span className="font-semibold text-gray-700">
                        {order.user
                          ? "Registered User"
                          : "Guest"}
                      </span>
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <select
                      value={order.status}
                      disabled={
                        updatingOrder === order.id
                      }
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {statuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingOrder === order.id && (
                      <p className="text-xs text-gray-500">
                        Updating...
                      </p>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-6 rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-semibold">
                    Customer Information
                  </h3>

                  <div className="grid gap-2 text-sm md:grid-cols-2">
                    <p>
                      <span className="font-medium">
                        Name:
                      </span>{" "}
                      {customerName || "Not provided"}
                    </p>

                    <p>
                      <span className="font-medium">
                        Email:
                      </span>{" "}
                      {customerEmail}
                    </p>

                    <p>
                      <span className="font-medium">
                        Phone:
                      </span>{" "}
                      {customerPhone}
                    </p>

                    <p>
                      <span className="font-medium">
                        Address:
                      </span>{" "}
                      {customerAddress}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h3 className="mb-4 font-semibold">
                    Ordered Products
                  </h3>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div>
                          <p className="font-medium">
                            {item.product.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>

                          <p className="text-sm text-gray-500">
                            Price: Rs.{" "}
                            {item.price}
                          </p>
                        </div>

                        <p className="font-semibold">
                          Rs.{" "}
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="mt-6 flex justify-end border-t pt-5">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Order Total
                    </p>

                    <p className="text-2xl font-bold">
                      Rs.{" "}
                      {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}