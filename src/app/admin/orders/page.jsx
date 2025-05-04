"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orders } from "../../store/slice/adminSlice";

export default function OrdersList() {
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    const adminToken = JSON.parse(localStorage.getItem('admin_token'));
    const send_data = {
        page: 1,
        token: adminToken
    }
    dispatch(orders(send_data));
  }, [dispatch]);

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders List</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Order #</th>
              <th className="py-2 px-4 border">Customer</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {order?.map((order) => (
              <tr key={order.order_id}>
                <td className="py-2 px-4 border">{order.order_num}</td>
                <td className="py-2 px-4 border">{order.full_name}</td>
                <td className="py-2 px-4 border">${order.grand_total}</td>
                <td className="py-2 px-4 border">{order.status}</td>
                <td className="py-2 px-4 border">
                  <Link
                    href={`/admin/orders/update/${order.order_id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Update Status
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}