"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addAddress } from "../store/slice/productSlice";
import { useRouter } from "next/navigation";

const AddressForm = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
            const token = JSON.parse(localStorage.getItem('token'));
            if (!token) {
                router.push('/login');
                return;
            }
        }, [dispatch, router]);
    

    const initialValues = {
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
    };

    const validationSchema = Yup.object({
        address_line: Yup.string().required("Address Line is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.string()
            .matches(/^\d{5,6}$/, "Pincode must be 5 or 6 digits")
            .required("Pincode is required"),
        country: Yup.string().required("Country is required"),
    });

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        setError("");
        setSuccess(false);

        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const data_rec = {
                address_line: values.address_line,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
                country: values.country,
                token: token
            }
            const response = await dispatch(addAddress(data_rec)).unwrap();
            if (response?.code === 200) {
                setSuccess(true);
                resetForm();
                router.push("/checkout");
            } else {
                setError(response?.message || "Failed to add address");
            }
        } catch (err) {
            console.error("Error adding address:", err);
            setError("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
            <h2 className="text-xl font-semibold mb-4 text-center">Add Address</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form noValidate>
                        <div className="mb-4">
                            <label className="block mb-1">Address Line 1</label>
                            <Field name="address_line" type="text" className="p-2 w-full border" />
                            <ErrorMessage name="address_line" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">City</label>
                            <Field name="city" type="text" className="p-2 w-full border" />
                            <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">State</label>
                            <Field name="state" type="text" className="p-2 w-full border" />
                            <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">Pin Code</label>
                            <Field name="pincode" type="text" className="p-2 w-full border" />
                            <ErrorMessage name="pincode" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">Country</label>
                            <Field name="country" type="text" className="p-2 w-full border" />
                            <ErrorMessage name="country" component="div" className="text-red-500 text-sm" />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-500"
                        >
                            {isSubmitting ? "Submitting..." : "Add Address"}
                        </button>

                        {success && <p className="text-green-600 mt-3">Address added successfully!</p>}
                        {error && <p className="text-red-600 mt-3">{error}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddressForm;
