import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRbac } from '@/stores/rbacStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

interface PermissionRouteProps {
  children: React.ReactNode;
  permission?: string | string[];
  role?: string | string[];
  resourceType?: string;
  action?: 'create' | 'read' | 'update' | 'delete' | 'manage';
  redirectTo?: string;
  showAccessDenied?: boolean;
}

/**
 * Route component that protects routes based on RBAC permissions
 * 
 * @example
 * <PermissionRoute permission="products:manage" redirectTo="/admin">
 *   <ProductsManagementPage />
 * </PermissionRoute>
 */
export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  permission,
  role,
  resourceType,
  action = 'read',
  redirectTo,
  showAccessDenied = true,
}) => {
  const { hasPermission, hasRole, isLoading } = useRbac();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Check role if provided
  if (role && !hasRole(role)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return showAccessDenied ? (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <ShieldX className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have the required role to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    ) : null;
  }

  // Determine permission to check
  let permissionToCheck: string | string[] | undefined = permission;

  if (!permissionToCheck && resourceType) {
    permissionToCheck = `${resourceType}:${action}`;
  }

  // Check permission if provided
  if (permissionToCheck && !hasPermission(permissionToCheck)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return showAccessDenied ? (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <ShieldX className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    ) : null;
  }

  return <>{children}</>;
};

