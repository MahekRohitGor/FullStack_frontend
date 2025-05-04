"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orders, update_status } from "../../store/slice/adminSlice";
import { Formik, Field, Form } from "formik";

export default function OrdersList() {
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.admin);
    const [adminToken, setAdminToken] = useState(null);

    useEffect(() => {
        const storedToken = JSON.parse(localStorage.getItem('admin_token'));
        if (!storedToken) {
            router.push('/admin/login');
        } else {
            setAdminToken(storedToken);
        }
        const send_data = {
            page: 1,
            token: storedToken
        }
        dispatch(orders(send_data));
    }, [dispatch]);

    if (loading) return <div className="p-4">Loading orders...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Orders List</h1>
            <Link
                href="/admin/dashboard"
                className="mb-10 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-md transition duration-200"
            >
                Dashboard
            </Link>
            <div className="overflow-x-auto mt-5">
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
                                    <Formik
                                        initialValues={{ status: order.status }}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            await dispatch(
                                                update_status({
                                                    order_id: order.order_id,
                                                    status: values.status,
                                                    token: adminToken
                                                })
                                            );
                                            await dispatch(orders({ page: 1, token: adminToken }));
                                            setSubmitting(false);
                                        }}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form>
                                                <Field
                                                    as="select"
                                                    name="status"
                                                    className="border rounded p-1 text-sm"
                                                    disabled={isSubmitting}
                                                >
                                                    <option value="processed">Processed</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="failed">Failed</option>
                                                </Field>
                                                <button
                                                    type="submit"
                                                    className="ml-2 text-blue-500 text-sm"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? "Saving..." : "Update"}
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}