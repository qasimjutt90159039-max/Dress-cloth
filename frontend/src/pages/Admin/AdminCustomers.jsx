import React, { useState, useEffect } from 'react';
import { Users, Shield, UserX, UserCheck, Mail, Phone, MapPin } from 'lucide-react';
import api from '../../services/api';

export const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (id) => {
    try {
      await api.put(`/auth/users/${id}/block`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-maroon-800">
          Customer Accounts Directory
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Review registered patrons and manage account access status.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3">Customer</th>
                <th className="p-3">Email & Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Saved Addresses</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">Loading customers...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-maroon-800 text-white flex items-center justify-center font-bold">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-charcoal">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3 space-y-0.5">
                      <p className="text-charcoal">{u.email}</p>
                      <p className="text-[10px] text-gray-400">{u.phone || 'No phone set'}</p>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-maroon-100 text-maroon-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-500">{u.addresses?.length || 0} address(es)</span>
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('en-PK')}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlock(u._id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                            u.isBlocked
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {u.isBlocked ? 'Unblock' : 'Block User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
