"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "../store/slice/productSlice";
import Link from "next/link";

export default function UserProfile() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { userInfo, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            router.push('/login');
            return;
        }

        dispatch(get_user_info(token));
    }, [dispatch, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">{error}</div>
                <Link href="/" className="mt-4 text-blue-500 hover:underline">
                    Back to Home
                </Link>
            </div>
        );
    }

    if (!userInfo) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">User information not found</div>
                <Link href="/" className="mt-4 text-blue-500 hover:underline">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">User Profile</h1>
            <Link href={"/products"} className="px-4 py-2 bg-blue-100 text-blue-950 rounded-xl hover:bg-blue-200">Back to Shopping</Link>
            
            <div className="grid grid-row-1 md:grid-row-2 gap-8 mt-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{userInfo.full_name || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{userInfo.email_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium">{userInfo.phone_number || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">About</p>
                            <p className="font-medium">{userInfo.about || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Order History</h2>
                    
                    {userInfo.orders?.length > 0 ? (
                        <div className="space-y-4">
                            {userInfo.orders.map((order, index) => (
                                <div key={index} className="border-b border-t pt-4 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">Order #{order.order_num}</p>
                                            <p className="text-sm text-gray-500">{order.order_date}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs bg-green-100 text-green-800`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="mt-2">Sub Total: ₹{order.sub_total}</p>
                                    <p className="mt-2">Shipping Charge: ₹{order.shipping_charge}</p>
                                    <p className="mt-2">Total: ₹{order.grand_total}</p>
                                    <p className="mt-2">Payment Type: {order.payment_type}</p>
                                    <p className="mt-2">Delivery Address: {order.address_line} {order.city}, {order.state} - {order.country} ({order.pincode})</p>
                                    
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No orders found</p>
                            <Link href="/products" className="mt-2 inline-block text-blue-500 hover:underline">
                                Back to Products
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}