import React from 'react';
import { LogOut } from 'lucide-react';
import { useUserActions } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { SupplierProfile } from '../types';

interface DashboardHeaderProps {
  profile: SupplierProfile | null;
  userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ profile, userName }) => {
  const { logout } = useUserActions();
  const displayName = profile?.company_name || userName || 'Supplier';
  const tier = profile?.supplier_tier;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {displayName}</p>
        </div>
        <div className="flex items-center gap-4">
          {tier && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Tier</p>
              <p className="text-lg font-semibold capitalize">{tier}</p>
            </div>
          )}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
      {profile?.is_suspended && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">
            <strong>Account Suspended:</strong> Your supplier account has been suspended. Please contact support.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;

