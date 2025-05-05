'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { get_users } from '../../store/slice/adminSlice';
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('admin_token'));
    if (token) {
      dispatch(get_users(token));
    } else{
      router.push('/admin/login');
    }
  }, [dispatch]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && users && users.length > 0 ? (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2 border">{user.full_name}</td>
                <td className="p-2 border">{user.email_id}</td>
                <td className="p-2 border">
                  <Link href={`/admin/users/edit/${user.user_id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No users found.</p>
      )}
    </div>
  );
}