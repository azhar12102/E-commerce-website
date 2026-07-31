"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Order = {
  id: string;
  date: string;
  total: number;
  items: {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
};

type OrdersContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders must be used inside OrdersProvider");
  }

  return context;
}