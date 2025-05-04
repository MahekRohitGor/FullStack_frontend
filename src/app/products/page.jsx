"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { show_products, logout, updateFilters, resetFilters, get_categories, filter_products } from "../store/slice/productSlice";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from 'yup';

const FilterSchema = Yup.object().shape({
    search: Yup.string(),
    category: Yup.number().nullable(),
    max_price: Yup.number().positive('Price must be positive').nullable()
  });

export default function Products() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { prods, loading, error, categories, filteredProds  } = useSelector((state) => state.products);

    const formik = useFormik({
        initialValues: {
            search: '',
            category: null,
            max_price: ''
        },
        validationSchema: FilterSchema,
        onSubmit: (values) => {
            const token = JSON.parse(localStorage.getItem('token'));
            const filtersToApply = {
                search: values.search.trim(),
                category: values.category ? [Number(values.category)] : [],
                max_price: values.max_price ? Number(values.max_price) : null,
                page: 1
            };

            const data_to_send = {
                ...filtersToApply,
                token: token
            }
            
            dispatch(updateFilters(filtersToApply));
            dispatch(filter_products(data_to_send));
        }
    });

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
        dispatch(get_categories(token));
    }, [dispatch, router]);

    const resetAllFilters = () => {
        formik.resetForm({
            values: {
                search: '',
                category: null,
                max_price: ''
            }
        });
        dispatch(resetFilters());
        const token = JSON.parse(localStorage.getItem('token'));
        dispatch(show_products(token));
    };

    const displayedProducts = filteredProds || prods;

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

    if (!displayedProducts || displayedProducts.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">No products found</div>
                <button 
                    onClick={resetAllFilters}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Reset Filters
                </button>
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

            <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-4">
                        <label htmlFor="search" className="block text-gray-700 mb-2">Search</label>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={formik.values.search}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Search products..."
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {formik.touched.search && formik.errors.search ? (
                            <div className="text-red-500 text-sm">{formik.errors.search}</div>
                        ) : null}
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formik.values.category || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">All Categories</option>
                            {categories?.map((cat) => (
                                <option key={cat.category_id} value={cat.category_id}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.category && formik.errors.category ? (
                            <div className="text-red-500 text-sm">{formik.errors.category}</div>
                        ) : null}
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="max_price" className="block text-gray-700 mb-2">Max Price</label>
                        <input
                            type="number"
                            id="max_price"
                            name="max_price"
                            min="0"
                            value={formik.values.max_price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter max price"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {formik.touched.max_price && formik.errors.max_price ? (
                            <div className="text-red-500 text-sm">{formik.errors.max_price}</div>
                        ) : null}
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={resetAllFilters}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors duration-300"
                    >
                        Reset Filters
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300"
                    >
                        Apply Filters
                    </button>
                </div>
            </form>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                {displayedProducts.map((product) => (
                    <div key={product.product_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <img 
                                    src={`${product.image_name}`} 
                                    alt={product.product_name}
                                    className="h-full w-full object-cover"
                                />
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