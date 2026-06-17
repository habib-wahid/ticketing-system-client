import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { AuthUser, UserUpdateRequest } from '../../types/auth';
import { userApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ToastProvider';

interface ProfileEditFormProps {
  user: AuthUser;
  onSaved?: () => void;
}

const inputClass =
  'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all';
const labelClass = 'block text-sm font-bold text-gray-700 mb-2';

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user, onSaved }) => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();

  const initial = {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? '',
    email: user.email,
  };

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const isDirty =
    form.firstName !== initial.firstName ||
    form.lastName !== initial.lastName ||
    form.phone !== initial.phone ||
    form.email !== initial.email;

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => setForm(initial);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      showToast('First and last name are required', 'error');
      return;
    }

    const payload: UserUpdateRequest = {};
    if (form.firstName.trim() !== initial.firstName) payload.firstName = form.firstName.trim();
    if (form.lastName.trim() !== initial.lastName) payload.lastName = form.lastName.trim();
    if (form.phone.trim() !== initial.phone) payload.phone = form.phone.trim();
    if (form.email.trim() !== initial.email) payload.email = form.email.trim();

    if (Object.keys(payload).length === 0) {
      showToast('No changes to save', 'info');
      return;
    }

    setSaving(true);
    try {
      const updated = await userApi.updateProfile(payload);
      updateUser({
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
        email: updated.email,
      });
      showToast('Profile updated successfully', 'success');
      onSaved?.();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-5">Edit Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={inputClass}
              disabled={saving}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={inputClass}
              disabled={saving}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={inputClass}
            disabled={saving}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Add a phone number"
            className={inputClass}
            disabled={saving}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !isDirty}
            className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={saving || !isDirty}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
