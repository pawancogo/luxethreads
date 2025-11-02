import React from 'react';
import { SupplierProfile } from '../types';

interface DashboardHeaderProps {
  profile: SupplierProfile | null;
  userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ profile, userName }) => {
  const displayName = profile?.company_name || userName || 'Supplier';

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome, {displayName}</p>
    </div>
  );
};

export default DashboardHeader;

