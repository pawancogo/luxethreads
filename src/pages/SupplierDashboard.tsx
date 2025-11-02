import React from 'react';
import SupplierDashboardContainer from '@/components/supplier/dashboard/SupplierDashboardContainer';
import SupplierDashboardErrorBoundary from '@/components/supplier/dashboard/SupplierDashboardErrorBoundary';

const SupplierDashboard = () => {
  return (
    <SupplierDashboardErrorBoundary>
      <SupplierDashboardContainer />
    </SupplierDashboardErrorBoundary>
  );
};

export default SupplierDashboard;
