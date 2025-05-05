"use client"; 
import Link from "next/link";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        const adminToken = JSON.parse(localStorage.getItem('admin_token'));
        if (!adminToken) {
            router.push('/admin/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="mt-2 text-gray-600">Manage your store operations</p>
                    </div>
                    
                    <div className="space-y-4">
                        <Link 
                            href="/admin/orders"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-md transition duration-200"
                        >
                            View Orders
                        </Link>
                        
                        <Link 
                            href="/admin/products/create"
                            className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-md transition duration-200"
                        >
                            Create New Product
                        </Link>
                        
                        <Link 
                            href="/admin/products"
                            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-md transition duration-200"
                        >
                            Manage Products
                        </Link>

                        <Link 
                            href="/admin/users"
                            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow hover:shadow-md transition duration-200"
                        >
                            Manage Users
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}