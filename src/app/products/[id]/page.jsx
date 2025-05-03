"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { get_product_by_id, add_to_cart } from "../../store/slice/productSlice";
import Link from "next/link";

export default function ProductDetails() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useDispatch();
    const { cuurentProd, loading, error, cart } = useSelector((state) => state.products);
    const [quantity, setQuantity] = useState(1);
    const [cartLoading, setCartLoading] = useState(false);

    const handle_add_to_cart = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            router.push('/login');
            return;
        }

        setCartLoading(true);

        try {
            await dispatch(add_to_cart({
                product_id: cuurentProd.product_id,
                qty: quantity,
                token
            })).unwrap();

        } catch (error) {
            console.error("Add to cart error:", error);
            setCartError(error.message || "An error occurred while adding to cart");
        } finally {
            setCartLoading(false);
        }
    }
    

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            router.push('/login');
            return;
        }

        dispatch(get_product_by_id({ id: params.id, token }));
    }, [dispatch, router, params.id]);

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

    if (!cuurentProd) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">Product not found</div>
                <Link href="/products" className="mt-4 text-blue-500 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/products" className="text-blue-500 hover:underline mb-4 inline-block">
                Back to Products
            </Link>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col">
                        <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                            {cuurentProd.images && cuurentProd.images[0] ? (
                                <img
                                    src={`${cuurentProd.images}`}
                                    alt={cuurentProd.name}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    No Image Available
                                </div>
                            )}
                        </div>

                    <div className="md:w-1/2 p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{cuurentProd.name}</h1>
                        <div className="text-xl text-blue-600 font-semibold mb-4">${cuurentProd.price}</div>
                        <div className="mb-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {cuurentProd.category_name}
                            </span>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Description</h2>
                            <p className="text-gray-600">{cuurentProd.description}</p>
                        </div>

                        <div className="flex items-center mb-6">
                        <span className="mr-4 text-gray-700">Quantity:</span>
                        <button 
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            className="w-10 h-10 bg-gray-200 rounded-l-lg flex items-center justify-center text-xl font-bold"
                            disabled={quantity <= 1}>
                            -
                        </button>
                        <div className="w-16 h-10 bg-gray-100 flex items-center justify-center border-t border-b border-gray-200">
                            {quantity}
                        </div>
                        <button 
                            onClick={() => setQuantity(prev => prev + 1)}
                            className="w-10 h-10 bg-gray-200 rounded-r-lg flex items-center justify-center text-xl font-bold">
                            +
                        </button>
                    </div>

                        <button 
                            onClick={handle_add_to_cart}
                            disabled={cartLoading}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
                                cartLoading 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                        >
                            {cartLoading ? 'Adding to Cart...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}