"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Category = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  categoryId: number;
  category: Category;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Add product form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [creating, setCreating] = useState(false);

  // Edit
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOldPrice, setEditOldPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  const [updating, setUpdating] = useState(false);

  // --------------------------------------------------
  // LOAD ADMIN DATA
  // --------------------------------------------------

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);

        // 1. Check login/admin
        const authResponse = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
          toast.error(authData.error || "Please login first");
          setIsAdmin(false);
          return;
        }

        if (authData.user?.role !== "ADMIN") {
          toast.error("Access denied. Admin only.");
          setIsAdmin(false);
          return;
        }

        setIsAdmin(true);

        // 2. Fetch products and categories
        const [productsResponse, categoriesResponse] =
          await Promise.all([
            fetch("/api/products", {
              cache: "no-store",
            }),
            fetch("/api/categories", {
              cache: "no-store",
            }),
          ]);

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (!productsResponse.ok) {
          toast.error(
            productsData.error || "Failed to fetch products"
          );
          return;
        }

        if (!categoriesResponse.ok) {
          toast.error(
            categoriesData.error ||
              "Failed to fetch categories"
          );
          return;
        }

        setProducts(productsData);
        setCategories(categoriesData);

        console.log("PRODUCTS LOADED:", productsData);
        console.log("CATEGORIES LOADED:", categoriesData);
      } catch (error) {
        console.error("ADMIN PRODUCTS ERROR:", error);
        toast.error("Failed to load admin product data");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  // --------------------------------------------------
  // IMAGE PATH
  // --------------------------------------------------

  const formatImagePath = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    // Already correct
    if (trimmed.startsWith("/images/products/")) {
      return trimmed;
    }

    // Windows path
    const normalized = trimmed.replace(/\\/g, "/");

    const fileName = normalized.split("/").pop();

    if (!fileName) {
      return trimmed;
    }

    return `/images/products/${fileName}`;
  };

  // --------------------------------------------------
  // CREATE PRODUCT
  // --------------------------------------------------

  const createProduct = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!isAdmin) {
      toast.error("Admin access required");
      return;
    }

    try {
      setCreating(true);

      const formattedImage = formatImagePath(image);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          image: formattedImage,
          price: Number(price),
          oldPrice:
            oldPrice.trim() === ""
              ? null
              : Number(oldPrice),
          stock: Number(stock),
          categoryId: Number(categoryId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to create product"
        );
        return;
      }

      toast.success("Product created successfully!");

      setProducts((previous) => [
        ...previous,
        data.product,
      ]);

      // Clear form
      setName("");
      setSlug("");
      setDescription("");
      setImage("");
      setPrice("");
      setOldPrice("");
      setStock("");
      setCategoryId("");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      toast.error("Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  // --------------------------------------------------
  // DELETE PRODUCT
  // --------------------------------------------------

  const deleteProduct = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to delete product"
        );
        return;
      }

      setProducts((previous) =>
        previous.filter((product) => product.id !== id)
      );

      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      toast.error("Failed to delete product");
    }
  };

  // --------------------------------------------------
  // OPEN EDIT
  // --------------------------------------------------

  const openEdit = (product: Product) => {
    setEditingProduct(product);

    setEditName(product.name);
    setEditSlug(product.slug);
    setEditDescription(product.description);
    setEditImage(product.image);
    setEditPrice(String(product.price));
    setEditOldPrice(
      product.oldPrice !== null
        ? String(product.oldPrice)
        : ""
    );
    setEditStock(String(product.stock));
    setEditCategoryId(String(product.categoryId));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // UPDATE PRODUCT
  // --------------------------------------------------

  const updateProduct = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingProduct) {
      return;
    }

    try {
      setUpdating(true);

      const formattedImage =
        formatImagePath(editImage);

      const response = await fetch(
        `/api/products/${editingProduct.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName,
            slug: editSlug,
            description: editDescription,
            image: formattedImage,
            price: Number(editPrice),
            oldPrice:
              editOldPrice.trim() === ""
                ? null
                : Number(editOldPrice),
            stock: Number(editStock),
            categoryId: Number(editCategoryId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to update product"
        );
        return;
      }

      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingProduct.id
            ? data.product
            : product
        )
      );

      setEditingProduct(null);

      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      toast.error("Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-medium">
            Checking admin access...
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Loading products and categories...
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // NOT ADMIN
  // --------------------------------------------------

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">
            Access Denied
          </h1>

          <p className="mt-2 text-gray-600">
            You must be an administrator to manage
            products.
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Product Management
        </h1>

        <p className="mt-2 text-gray-500">
          Add, edit, and delete products from your store.
        </p>
      </div>

      {/* EDIT FORM */}

      {editingProduct && (
        <section className="mb-10 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Edit Product
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Editing: {editingProduct.name}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={updateProduct}
            className="grid gap-5 md:grid-cols-2"
          >
            <input
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
              placeholder="Product name"
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              required
            />

            <input
              value={editSlug}
              onChange={(e) =>
                setEditSlug(e.target.value)
              }
              placeholder="Product slug"
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              required
            />

            <input
              value={editImage}
              onChange={(e) =>
                setEditImage(e.target.value)
              }
              placeholder="/images/products/product.webp"
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              required
            />

            <input
              type="number"
              value={editPrice}
              onChange={(e) =>
                setEditPrice(e.target.value)
              }
              placeholder="Price"
              min="0"
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              required
            />

            <input
              type="number"
              value={editOldPrice}
              onChange={(e) =>
                setEditOldPrice(e.target.value)
              }
              placeholder="Old price"
              min="0"
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="number"
              value={editStock}
              onChange={(e) =>
                setEditStock(e.target.value)
              }
              placeholder="Stock quantity"
              min="0"
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              required
            />

            <select
              value={editCategoryId}
              onChange={(e) =>
                setEditCategoryId(e.target.value)
              }
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              required
            >
              <option value="">
                Select category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(e.target.value)
              }
              placeholder="Product description"
              rows={4}
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500 md:col-span-2"
              required
            />

            <button
              type="submit"
              disabled={updating}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            >
              {updating
                ? "Updating Product..."
                : "Update Product"}
            </button>
          </form>
        </section>
      )}

      {/* ADD PRODUCT */}

      <section className="mb-12 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">
          Add Product
        </h2>

        <form
          onSubmit={createProduct}
          className="grid gap-5 md:grid-cols-2"
        >
          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Product name"
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            required
          />

          <input
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
            placeholder="Product slug"
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            required
          />

          <input
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            placeholder="Product image path"
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            required
          />

          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            placeholder="Price"
            min="0"
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            required
          />

          <input
            type="number"
            value={oldPrice}
            onChange={(e) =>
              setOldPrice(e.target.value)
            }
            placeholder="Old price"
            min="0"
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="number"
            value={stock}
            onChange={(e) =>
              setStock(e.target.value)
            }
            placeholder="Stock quantity"
            min="0"
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            required
          />

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            required
          >
            <option value="">
              Select category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Product description"
            rows={4}
            className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500 md:col-span-2"
            required
          />

          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
          >
            {creating
              ? "Creating Product..."
              : "Add Product"}
          </button>
        </form>
      </section>

      {/* PRODUCT LIST */}

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Products
            </h2>

            <p className="mt-1 text-gray-500">
              {products.length} product
              {products.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold">
              No products found
            </h3>

            <p className="mt-2 text-gray-500">
              Add your first product using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                {/* IMAGE */}

                <div className="relative h-56 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-4"
                  />
                </div>

                {/* DETAILS */}

                <div className="p-5">
                  <h3 className="text-lg font-bold">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {product.category?.name ||
                      "No category"}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xl font-bold text-blue-600">
                      Rs. {product.price}
                    </span>

                    {product.oldPrice !== null && (
                      <span className="text-sm text-gray-500 line-through">
                        Rs. {product.oldPrice}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm">
                    Stock:{" "}
                    <span className="font-semibold">
                      {product.stock}
                    </span>
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {product.description}
                  </p>

                  {/* BUTTONS */}

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}