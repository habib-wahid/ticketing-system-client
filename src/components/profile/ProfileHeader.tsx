import React from 'react';
import { Mail, Phone, Pencil } from 'lucide-react';
import type { AuthUser } from '../../types/auth';
import { RoleBadge } from './RoleBadge';

interface ProfileHeaderProps {
  user: AuthUser;
  onEdit: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEdit }) => {
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2D336B] to-[#433878] flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-bold text-2xl">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <RoleBadge role={user.role} />
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={15} className="text-gray-400 flex-shrink-0" />
              <span className="break-all">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={15} className="text-gray-400 flex-shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onEdit}
          className="self-start sm:self-center px-5 py-2.5 bg-[#433878] hover:bg-[#3a2d66] text-white rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 whitespace-nowrap"
        >
          <Pencil size={15} />
          Edit Profile
        </button>
      </div>
    </div>
  );
};
