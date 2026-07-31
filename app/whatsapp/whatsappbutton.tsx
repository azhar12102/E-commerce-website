"use client";

import { MessageCircle } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn,FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/923300372367"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600"
    >
      <FaWhatsapp/>
    </a>
  );
}