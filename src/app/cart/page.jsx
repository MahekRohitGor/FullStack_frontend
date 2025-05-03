"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { get_cart_details } from "../store/slice/productSlice";
import Link from "next/link";

export default function CartDetails() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { cartItems, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            router.push('/login');
            return;
        }

        dispatch(get_cart_details(token));
    }, [dispatch, router]);

    const calculateTotal = () => {
        return cartItems?.reduce((total, item) => {
            return total + (parseFloat(item.product_price) * item.qty);
        }, 0) || 0;
    };

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
                <Link href="/products" className="mt-4 text-blue-500 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Cart</h1>
            
            {cartItems?.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
                    <Link href="/products" className="text-blue-500 hover:underline">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {cartItems?.map((item, index) => (
                            <div key={index} className="p-4 md:p-6 flex flex-col md:flex-row">
                                <div className="md:w-3/4 md:pl-6">
                                    <h2 className="text-xl font-semibold mb-2">{item.product_name}</h2>
                                    <p className="text-gray-600 mb-4">{item.product_description}</p>
                                    <div className="flex flex-wrap items-center justify-between">
                                        <div className="text-blue-600 font-semibold mb-2 md:mb-0">
                                            ₹{(parseFloat(item.product_price)).toFixed(2)}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-4 text-gray-700">Qty: {item.qty}</span>
                                            <div className="text-gray-700">
                                                Subtotal: ₹{(parseFloat(item.product_price) * item.qty).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-xl font-bold">₹{calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                            <Link href="/products" className="flex-1 text-center py-3 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors duration-300">
                                Continue Shopping
                            </Link>
                            <Link href={`/checkout`}>
                            <button className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-300">
                                Proceed to Checkout
                            </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}