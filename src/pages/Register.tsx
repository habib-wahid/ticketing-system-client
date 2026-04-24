import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, firstName, lastName);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="CREATE ACCOUNT" subtitle="Join our Ticketing System">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="firstName" className="block text-lg font-bold text-gray-800">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="w-full px-4 py-3 border border-gray-100 rounded-md bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D336B]/20 text-lg shadow-sm"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="lastName" className="block text-lg font-bold text-gray-800">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full px-4 py-3 border border-gray-100 rounded-md bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D336B]/20 text-lg shadow-sm"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-lg font-bold text-gray-800">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@orchida-soft.com"
            className="w-full px-4 py-3 border border-gray-100 rounded-md bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D336B]/20 text-lg shadow-sm"
            required
            disabled={loading}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-lg font-bold text-gray-800">
            Password<span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            className="w-full px-4 py-3 border border-gray-100 rounded-md bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D336B]/20 text-lg shadow-sm"
            required
            disabled={loading}
          />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-lg font-bold text-gray-800">
            Confirm Password<span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className="w-full px-4 py-3 border border-gray-100 rounded-md bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D336B]/20 text-lg shadow-sm"
            required
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2D336B] text-white py-4 rounded-md text-2xl font-bold hover:bg-[#232855] transition-colors shadow-lg mt-6 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? 'Creating account...' : 'Register'}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2D336B] font-bold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
