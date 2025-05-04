"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { get_products, delete_products } from "../../store/slice/adminSlice";

export default function ProductsList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { admin, loading, error, products } = useSelector((state) => state.admin);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("admin_token"));
    if (!token) {
      router.push("/admin/login");
    } else {
      dispatch(get_products(token));
    }
  }, [dispatch, router]);

  const handleDelete = async (product_id) => {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      await dispatch(delete_products({ product_id, token }));
      dispatch(get_products(token));
  };

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if(!products) return <div className="p-4 text-red-500">Loading products...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products List</h1>
        <Link 
          href="/admin/products/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Product
        </Link>

        <Link 
          href="/admin/dashboard" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dashboard
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id}>
                <td className="py-2 px-4 border">{product.product_id}</td>
                <td className="py-2 px-4 border">{product.product_name}</td>
                <td className="py-2 px-4 border">${product.product_price}</td>
                <td className="py-2 px-4 border max-w-xs truncate">{product.product_description}</td>
                <td className="py-2 px-4 border max-w-xs truncate">{product.category_name}</td>
                <td className="py-2 px-4 border">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/products/edit/${product.product_id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.product_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}