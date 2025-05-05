"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { edit_profile } from "../../store/slice/productSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

const ProductSchema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  about: yup.string().required("About is required"),
  profile_pic: yup.string().required("Profile Picture is required")
});

export default function EditProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.products);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      router.push("/admin/login");
    } else {
        setUserToken(token);
    }
  }, [dispatch, router]);

  const handleSubmit = async (values, { setSubmitting }) => {
    await dispatch(edit_profile({ 
      ...values,
      token: userToken 
    }));
    setSubmitting(false);
    router.push("/user");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit User Details</h1>

      <Formik
        initialValues={{
          full_name: "",
          about: "",
          profile_pic: ""
        }}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <Field name="full_name" className="border p-2 w-full rounded" />
              <ErrorMessage name="full_name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">About</label>
              <Field name="about" type="text" className="border p-2 w-full rounded" />
              <ErrorMessage name="about" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Profile Picture</label>
              <Field as="textarea" name="profile_pic" className="border p-2 w-full rounded" />
              <ErrorMessage name="profile_pic" component="div" className="text-red-500 text-sm" />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {isSubmitting || loading ? "Updating..." : "Update User"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}