import type { ComponentType } from 'react';
import { Shield, Headset, User, Route } from 'lucide-react';
import type { UserRole } from '../../types/auth';

interface RoleBadgeProps {
  role: UserRole;
}

const ROLE_STYLES: Record<UserRole, { label: string; className: string; Icon: ComponentType<{ size?: number; className?: string }> }> = {
  ADMIN: {
    label: 'Admin',
    className: 'bg-[#433878]/10 text-[#433878]',
    Icon: Shield,
  },
  AGENT: {
    label: 'Agent',
    className: 'bg-[#10B981]/10 text-[#059669]',
    Icon: Headset,
  },
  DISTRIBUTOR: {
    label: 'Distributor',
    className: 'bg-[#0EA5E9]/10 text-[#0284C7]',
    Icon: Route,
  },
  CUSTOMER: {
    label: 'Customer',
    className: 'bg-gray-100 text-gray-600',
    Icon: User,
  },
};

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const { label, className, Icon } = ROLE_STYLES[role] ?? ROLE_STYLES.CUSTOMER;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${className}`}
    >
      <Icon size={13} />
      {label}
    </span>
  );
};
