import React from 'react';

export type ProfileTabId = 'overview' | 'edit' | 'security';

interface TabConfig {
  id: ProfileTabId;
  label: string;
}

const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'edit', label: 'Edit Profile' },
  { id: 'security', label: 'Security' },
];

interface ProfileTabsProps {
  activeTab: ProfileTabId;
  onChange: (tab: ProfileTabId) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onChange }) => (
  <div className="flex gap-1 border-b border-gray-200">
    {TABS.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-150 focus:outline-none ${
            isActive
              ? 'bg-[#2D336B] text-white border border-b-0 border-[#2D336B]'
              : 'text-gray-500 hover:text-[#2D336B] hover:bg-gray-50 border border-transparent'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);
