import { useState, useEffect } from 'react';
import type { UserResponse } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileStats } from '../components/profile/ProfileStats';
import { ProfileTabs, type ProfileTabId } from '../components/profile/ProfileTabs';
import { ProfileOverview } from '../components/profile/ProfileOverview';
import { ProfileEditForm } from '../components/profile/ProfileEditForm';
import { ProfileSecurityForm } from '../components/profile/ProfileSecurityForm';

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTabId>('overview');
  const [details, setDetails] = useState<UserResponse | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    userApi
      .getById(user.userId)
      .then((res) => {
        if (!cancelled) setDetails(res);
      })
      .catch(() => {
        if (!cancelled) setDetails(null);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader user={user} onEdit={() => setActiveTab('edit')} />

      <ProfileStats />

      <div className="space-y-0">
        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
        <div className="pt-6">
          {activeTab === 'overview' && <ProfileOverview user={user} details={details} />}
          {activeTab === 'edit' && (
            <ProfileEditForm user={user} onSaved={() => setActiveTab('overview')} />
          )}
          {activeTab === 'security' && <ProfileSecurityForm />}
        </div>
      </div>
    </div>
  );
}
