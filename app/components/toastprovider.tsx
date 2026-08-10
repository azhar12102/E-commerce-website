"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2500,
        style: {
          background: "#fff",
          color: "#111827",
          borderRadius: "10px",
        },
      }}
    />
  );
}