import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Images } from "lucide-react";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  const phoneCases = await prisma.category.upsert({
    where: { slug: "phone-cases" },
    update: {
        image: "/images/categories/phonecase.webp",
    },
    create: {
      name: "Phone Cases",
      slug: "phone-cases",
        image: "/images/categories/phonecase.webp",
      
    },
  });

  const chargers = await prisma.category.upsert({
    where: { slug: "chargers" },
    update: {
      image:"/images/categories/charger.jpg",
    },
    create: {
      name: "Chargers",
      slug: "chargers",
      image:"/images/categories/charger.jpg",

    },
  });

  const earbuds = await prisma.category.upsert({
    where: { slug: "earbuds" },
    update: {
      image :"/images/categories/earbuds.webp",
    },
    create: {
      name: "Earbuds",
      slug: "earbuds",
      image:"/images/categories/earbuds.webp",
    },
  });

  const powerBanks = await prisma.category.upsert({
    where: { slug: "power-banks" },
    update: {
      image :"/images/categories/powerbank.webp",
    },
    create: {
      name: "Power Banks",
      slug: "power-banks",
      image:"/images/categories/powerbank.webp",
    },
  });

  const smartWatches = await prisma.category.upsert({
    where: { slug: "smart-watches" },
    update: {
      image:"/images/categories/smart-watch.webp",
    },
    create: {
      name: "Smart Watches",
      slug: "smart-watches",
      image :"/images/categories/smart-watch.webp",
    },
  });

  // Products
  const products = [
    {
      name: "Premium Phone Case",
      slug: "premium-phone-case",
      description: "Premium quality phone case.",
      image: "/images/products/phone-case.avif",
      price: 500,
      oldPrice: 750,
      stock: 50,
      categoryId: phoneCases.id,
    },
    {
      name: "Fast Charger 20W",
      slug: "fast-charger-20w",
      description: "Fast charging adapter.",
      image: "/images/products/charger.jpg",
      price: 1000,
      oldPrice: 1699,
      stock: 40,
      categoryId: chargers.id,
    },
    {
      name: "Wireless Earbuds",
      slug: "wireless-earbuds",
      description: "High quality wireless earbuds.",
      image: "/images/products/wireless-earbuds.avif",
      price: 2200,
      oldPrice: 3200,
      stock: 30,
      categoryId: earbuds.id,
    },
    {
      name: "Power Bank 10000mAh",
      slug: "power-bank-10000mah",
      description: "10000mAh fast charging power bank.",
      image: "/images/products/power_bank.avif",
      price: 2000,
      oldPrice: 3000,
      stock: 25,
      categoryId: powerBanks.id,
    },
    {
      name: "USB-C Cable",
      slug: "usb-c-cable",
      description: "Durable USB Type-C cable.",
      image: "/images/products/USB-C-Type-Cable.webp",
      price: 500,
      oldPrice: 750,
      stock: 100,
      categoryId: chargers.id,
    },
    {
      name: "Smart Watch",
      slug: "smart-watch",
      description: "Modern smart watch.",
      image: "/images/products/smart-watch.jpg",
      price: 3500,
      oldPrice: 5000,
      stock: 20,
      categoryId: smartWatches.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });