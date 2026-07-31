"use client";

import { useOrders } from "../context/ordercontext";

export default function OrdersPage() {
  const { orders } = useOrders();

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
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Order #{order.id}
                  </h2>

                  <p className="text-gray-500">
                    Date: {order.date}
                  </p>
                </div>

                <span className="rounded bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                  Pending
                </span>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      Rs. {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right text-xl font-bold">
                Total: Rs. {order.total}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}