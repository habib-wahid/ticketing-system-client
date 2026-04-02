import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Link, useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    console.log('Logging in with:', email, password);
    navigate('/');
  };

  return (
    <AuthLayout title="WELCOME BACK" subtitle="Login With Orchida mail">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xl font-bold text-gray-800">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@orchida-soft.com"
            className="w-full px-4 py-4 border border-gray-100 rounded-md bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D336B]/20 text-lg shadow-sm"
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-xl font-bold text-gray-800">
            Password<span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="@B123"
            className="w-full px-4 py-4 border border-gray-100 rounded-md bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2D336B]/20 text-lg shadow-sm"
            required
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <input type="checkbox" className="hidden peer" />
              <svg className="w-4 h-4 text-[#2D336B] opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-gray-600 font-medium">Keep Me Logged in</span>
          </label>
          <Link to="#" className="text-[#B23B2B] font-bold hover:underline">
            Forgot Your Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#2D336B] text-white py-4 rounded-md text-2xl font-bold hover:bg-[#232855] transition-colors shadow-lg mt-8"
        >
          Submit
        </button>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#2D336B] font-bold hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
