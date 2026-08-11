"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;

  product: {
    id: number;
    name: string;
    image: string;
  };
};

type Order = {
  id: string;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;

  items: OrderItem[];
};

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");

        const text = await response.text();

        console.log("ORDERS STATUS:", response.status);
        console.log("ORDERS RESPONSE:", text);

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Server returned invalid JSON. Status: ${response.status}`
          );
        }

        if (!response.ok) {
          router.push("/login");
          return;
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("FETCH ORDERS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold">
          My Orders
        </h1>

        <div className="rounded-lg border bg-white p-10 text-center shadow">
          <p className="text-gray-500">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center shadow">
          <h2 className="text-2xl font-semibold">
            No Orders Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Your orders will appear here after you place one.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border bg-white p-6 shadow"
            >
              {/* Order Header */}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Order #{order.id}
                  </h2>

                  <p className="text-gray-500">
                    Date:{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <p className="text-gray-500">
                    Payment:{" "}
                    <span className="font-semibold text-blue-600">
                      {order.paymentMethod}
                    </span>
                  </p>
                </div>

                <span className="w-fit rounded bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                  {order.status}
                </span>
              </div>

              {/* Products */}
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
                    </div>

                    <span className="font-medium">
                      Rs.{" "}
                      {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 border-t pt-4 text-right text-xl font-bold">
                Total: Rs. {order.total}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}