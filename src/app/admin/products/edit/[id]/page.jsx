"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { edit_products, get_categories } from "../../../../store/slice/adminSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useParams } from "next/navigation"; 

const ProductSchema = yup.object().shape({
  product_name: yup.string().required("Product name is required"),
  product_price: yup.number().required("Price is required").positive("Price must be positive"),
  product_description: yup.string().required("Description is required"),
  category_id: yup.number().required("Category is required"),
});

export default function EditProductPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, categories } = useSelector((state) => state.admin);
  const [adminToken, setAdminToken] = useState(null);
  const prod_id = Number(params.id);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("admin_token"));
    if (!token) {
      router.push("/admin/login");
    } else {
      setAdminToken(token);
      dispatch(get_categories(token));
    }
  }, [dispatch, router]);

  const handleSubmit = async (values, { setSubmitting }) => {
    await dispatch(edit_products({ 
      ...values, 
      product_id: prod_id,
      token: adminToken 
    }));
    setSubmitting(false);
    router.push("/admin/products");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <Formik
        initialValues={{
          product_name: "",
          product_price: "",
          product_description: "",
          category_id: "",
        }}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <Field name="product_name" className="border p-2 w-full rounded" />
              <ErrorMessage name="product_name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Price</label>
              <Field name="product_price" type="number" className="border p-2 w-full rounded" />
              <ErrorMessage name="product_price" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Field as="textarea" name="product_description" className="border p-2 w-full rounded" />
              <ErrorMessage name="product_description" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Category</label>
              <Field as="select" name="category_id" className="border p-2 w-full rounded">
                <option value="">-- Select Category --</option>
                {categories?.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category_id" component="div" className="text-red-500 text-sm" />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {isSubmitting || loading ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/products")}
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