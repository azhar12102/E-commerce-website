import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">

        {/* Company */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            MobileStore
          </h2>

          <p className="mt-4 text-sm leading-7">
            Your trusted destination for premium mobile accessories,
            fast delivery, and excellent customer service.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Categories
          </h3>

          <ul className="space-y-3">
            <li>Phone Cases</li>
            <li>Chargers</li>
            <li>Power Banks</li>
            <li>Wireless Earbuds</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Contact
          </h3>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <MapPin size={18} />
              <span>Karachi, Pakistan</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>support@mobilestore.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} />
              <span>+92 300 1234567</span>
            </div>

            <div className="flex gap-4 pt-4">
              <div className="flex gap-4 pt-4">
                <a
    href="https://www.facebook.com/azhar.abbas.977344"
    target="_blank"
    rel="noopener noreferrer"
    className="transition hover:text-white"
  > <FaFacebookF className="cursor-pointer text-xl transition hover:text-white" /></a>
               
                <FaInstagram className="cursor-pointer text-xl transition hover:text-white" />
                <FaLinkedinIn className="cursor-pointer text-xl transition hover:text-white" />
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 py-6 text-center text-sm">
        © 2026 MobileStore. All rights reserved.
      </div>
    </footer>
  );
}