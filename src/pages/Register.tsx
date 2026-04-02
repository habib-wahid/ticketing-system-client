import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Link, useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    console.log('Registering with:', name, email, password);
    navigate('/login');
  };

  return (
    <AuthLayout title="CREATE ACCOUNT" subtitle="Join our Ticketing System">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1">
          <label htmlFor="name" className="block text-lg font-bold text-gray-800">
            Full Name<span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-gray-100 rounded-md bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D336B]/20 text-lg shadow-sm"
            required
          />
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
            placeholder="@B123"
            className="w-full px-4 py-3 border border-gray-100 rounded-md bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D336B]/20 text-lg shadow-sm"
            required
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
            placeholder="@B123"
            className="w-full px-4 py-3 border border-gray-100 rounded-md bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D336B]/20 text-lg shadow-sm"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#2D336B] text-white py-4 rounded-md text-2xl font-bold hover:bg-[#232855] transition-colors shadow-lg mt-6"
        >
          Register
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
