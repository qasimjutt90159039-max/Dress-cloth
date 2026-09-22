import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('hed_user') || 'null'),
  token: localStorage.getItem('hed_token') || null,
  isAuthenticated: !!localStorage.getItem('hed_token'),
  isAdmin: JSON.parse(localStorage.getItem('hed_user') || '{}')?.role === 'admin',
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      localStorage.setItem('hed_token', token);
      localStorage.setItem('hed_user', JSON.stringify(user));
      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        loading: false
      });
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', userData);
      const { user, token } = res.data;
      localStorage.setItem('hed_token', token);
      localStorage.setItem('hed_user', JSON.stringify(user));
      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        loading: false
      });
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your information.';
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('hed_token');
    localStorage.removeItem('hed_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false
    });
  },

  updateProfile: async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      const updatedUser = res.data.user;
      localStorage.setItem('hed_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  },

  addAddress: async (addressData) => {
    try {
      const res = await api.post('/auth/addresses', addressData);
      const current = get().user;
      const updated = { ...current, addresses: res.data.addresses };
      localStorage.setItem('hed_user', JSON.stringify(updated));
      set({ user: updated });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to save address' };
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const res = await api.delete(`/auth/addresses/${addressId}`);
      const current = get().user;
      const updated = { ...current, addresses: res.data.addresses };
      localStorage.setItem('hed_user', JSON.stringify(updated));
      set({ user: updated });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to remove address' };
    }
  }
}));
