"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signup } from "../store/slice/productSlice";

function Signup() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const initialState = {
        full_name: "",
        email_id: "",
        password_: "",
        phone_number: "",
        code_id: "",
        device_token: "1234567890",
        device_type: "android",
        time_zone: "Asia/Kolkata",
        verify_with: "e",
    };

    const validate = Yup.object({
        full_name: Yup.string().required("Full name is required"),
        email_id: Yup.string().email("Invalid email").required("Email is required"),
        password_: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        phone_number: Yup.string().matches(/^\d{10}$/, "Phone must be 10 digits").required("Phone number is required"),
        code_id: Yup.string().required("Code ID is required"),
    });

    return (
        <div className="max-w-sm mx-auto">
            <h2 className="mt-5 mb-5 text-center">Signup Form</h2>

            <Formik
                initialValues={initialState}
                validationSchema={validate}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                    setError("");
                    setSuccess(false);
                    console.log(values);
                    const data_recv = {
                        full_name: values.full_name,
                        email_id: values.email_id,
                        password_: values.password_,
                        phone_number: values.phone_number,
                        code_id: values.code_id,
                        device_token: '1234567890',
                        device_type: 'android',
                        time_zone: 'Asia/Kolkata',
                        verify_with: 'e',
                    };
                    console.log(data_recv);
                    try {
                        const response = await dispatch(signup(data_recv)).unwrap();

                        if (response?.code === 200) {
                            const token = response.data.user_token;
                            localStorage.setItem("token", JSON.stringify(token));
                            setSuccess(true);
                            router.push("/products");
                        } else {
                            setError(response?.message || "Signup failed");
                        }
                        resetForm();
                    } catch (err) {
                        console.error("Signup error:", err);
                        setError("Something went wrong");
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Full Name</label>
                            <Field type="text" name="full_name" className="p-2 border w-full" />
                            <ErrorMessage name="full_name" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Email ID</label>
                            <Field type="email" name="email_id" className="p-2 border w-full" />
                            <ErrorMessage name="email_id" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                            <Field type="password" name="password_" className="p-2 border w-full" />
                            <ErrorMessage name="password_" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
                            <Field type="text" name="phone_number" className="p-2 border w-full" />
                            <ErrorMessage name="phone_number" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Code ID</label>
                            <Field type="text" name="code_id" className="p-2 border w-full" />
                            <ErrorMessage name="code_id" component="div" className="text-red-500 text-sm" />
                        </div>

                        <button
                            type="submit"
                            className="p-2 mr-4 rounded bg-green-600 text-white hover:bg-green-500"
                            disabled={isSubmitting}
                        >
                            Sign Up
                        </button>

                        {success && <p className="text-green-600 mt-3">Signup Successful! Redirecting...</p>}
                        {error && <p className="text-red-600 mt-3">{error}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Signup;
