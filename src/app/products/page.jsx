"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { show_products, logout } from "../store/slice/productSlice";
import Link from "next/link";

export default function Products() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { prods, loading, error } = useSelector((state) => state.products);

    const handleLogout = () => {
        const token = JSON.parse(localStorage.getItem('token'));
        dispatch(logout(token));
        router.push("/login");
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            router.push('/login');
            return;
        }

        dispatch(show_products(token));
    }, [dispatch, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-blue-500 text-xl">LOADING...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    if (!prods || prods.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">No products found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
            <Link className="mt-4 mr-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/user`}>View Profile</Link>
            <Link className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/cart`}>View Cart</Link>

            <button onClick={handleLogout} className="text-white bg-red-700 py-2 px-4 rounded ml-4">
                Logout
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                {prods.map((product) => (
                    <div key={product.product_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            {product.image_name ? (
                                <img 
                                    src={`${product.image_name}`} 
                                    alt={product.product_name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-500">No Image</span>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{product.product_name}</h2>
                            <p className="text-gray-600 mb-2">{product.category_name}</p>
                            <p className="text-blue-600 font-bold mb-4">${product.product_price}</p>
                            <Link className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300" href={`/products/${product.product_id}`}>View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}