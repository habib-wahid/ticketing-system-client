import React, { useState } from 'react';
import { Loader2, Info } from 'lucide-react';
import { userApi } from '../../services/api';
import { useToast } from '../ToastProvider';

const inputClass =
  'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all';
const labelClass = 'block text-sm font-bold text-gray-700 mb-2';

export const ProfileSecurityForm: React.FC = () => {
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await userApi.updateProfile({ password });
      showToast('Password changed successfully', 'success');
      setPassword('');
      setConfirm('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      setError(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-5">Change Password</h3>

      <div className="flex items-start gap-2 bg-blue-50 text-blue-700 p-3 rounded-lg mb-5 text-xs font-medium">
        <Info size={15} className="flex-shrink-0 mt-0.5" />
        <span>
          For security, you'll be asked to sign in again with your new password. Current-password
          verification is not enforced by the server.
        </span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-5 text-sm font-medium">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={inputClass}
            disabled={saving}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter new password"
            className={inputClass}
            disabled={saving}
            autoComplete="new-password"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving || !password || !confirm}
            className="px-6 py-2.5 bg-[#433878] hover:bg-[#3a2d66] text-white rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};
