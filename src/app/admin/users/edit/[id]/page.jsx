'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { edit_user, get_users } from '../../../../store/slice/adminSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);

  const validationSchema = Yup.object({
    full_name: Yup.string().required('Full name is required'),
    email_id: Yup.string().email('Invalid email address').required('Email is required'),
    profile_pic: Yup.string().url('Must be a valid URL'),
    about: Yup.string(),
    is_active: Yup.boolean()
  });

  const formik = useFormik({
    initialValues: {
      full_name: '',
      profile_pic: '',
      about: '',
      email_id: '',
      is_active: true,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const token = JSON.parse(localStorage.getItem('admin_token'));
        const request_data = {
          ...values,
          user_id: params.id,
          is_active: values.is_active ? 1 : 0,
          token,
        };
        await dispatch(edit_user(request_data));
        alert('User updated successfully!');
        router.push('/admin/users');
      } catch (error) {
        console.error("Submit error:", error);
      } finally {
        setSubmitting(false);
      }
    },    
  });

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('admin_token'));
    if (token && (!users || users.length === 0)) {
      dispatch(get_users(token));
    } else{
      router.push('/admin/login');
    }
  }, [dispatch, users]);

  useEffect(() => {
    if (users) {
      const user = users.find((u) => u.user_id === params.id);
      if (user) {
        formik.setValues({
          full_name: user.full_name,
          profile_pic: user.profile_pic,
          about: user.about,
          email_id: user.email_id,
          is_active: user.is_active ? 1 : 0,
        });
      }
    }
  }, [users, params.id]);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <input
            name="full_name"
            value={formik.values.full_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded ${
              formik.touched.full_name && formik.errors.full_name ? 'border-red-500' : ''
            }`}
            placeholder="Full Name"
          />
          {formik.touched.full_name && formik.errors.full_name ? (
            <div className="text-red-500 text-sm">{formik.errors.full_name}</div>
          ) : null}
        </div>

        <div>
          <input
            name="profile_pic"
            value={formik.values.profile_pic}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded ${
              formik.touched.profile_pic && formik.errors.profile_pic ? 'border-red-500' : ''
            }`}
            placeholder="Profile Picture URL"
          />
          {formik.touched.profile_pic && formik.errors.profile_pic ? (
            <div className="text-red-500 text-sm">{formik.errors.profile_pic}</div>
          ) : null}
        </div>

        <div>
          <input
            name="email_id"
            value={formik.values.email_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded ${
              formik.touched.email_id && formik.errors.email_id ? 'border-red-500' : ''
            }`}
            placeholder="Email"
          />
          {formik.touched.email_id && formik.errors.email_id ? (
            <div className="text-red-500 text-sm">{formik.errors.email_id}</div>
          ) : null}
        </div>

        <div>
          <textarea
            name="about"
            value={formik.values.about}
            onChange={formik.handleChange}
            className="w-full p-2 border rounded"
            placeholder="About User"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formik.values.is_active}
            onChange={formik.handleChange}
          />
          Active
        </label>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {formik.isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
}