import React from 'react';
import { useRbac } from '@/contexts/RbacContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

interface ProtectedComponentProps {
  children: React.ReactNode;
  permission?: string | string[];
  role?: string | string[];
  resourceType?: string;
  action?: 'create' | 'read' | 'update' | 'delete' | 'manage';
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
}

/**
 * Component that conditionally renders children based on RBAC permissions
 * 
 * @example
 * <ProtectedComponent permission="products:create">
 *   <CreateProductButton />
 * </ProtectedComponent>
 * 
 * <ProtectedComponent resourceType="products" action="update">
 *   <EditProductButton />
 * </ProtectedComponent>
 */
export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  permission,
  role,
  resourceType,
  action = 'read',
  fallback = null,
  showAccessDenied = false,
}) => {
  const { hasPermission, hasRole, isLoading } = useRbac();

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  // Check role if provided
  if (role && !hasRole(role)) {
    return showAccessDenied ? (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <ShieldX className="h-8 w-8 text-red-500 mb-2" />
          <CardTitle className="text-red-600">Access Denied</CardTitle>
          <CardDescription>
            You don't have the required role to access this content.
          </CardDescription>
        </CardHeader>
      </Card>
    ) : (
      <>{fallback}</>
    );
  }

  // Determine permission to check
  let permissionToCheck: string | string[] | undefined = permission;

  if (!permissionToCheck && resourceType) {
    permissionToCheck = `${resourceType}:${action}`;
  }

  // Check permission if provided
  if (permissionToCheck && !hasPermission(permissionToCheck)) {
    return showAccessDenied ? (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <ShieldX className="h-8 w-8 text-red-500 mb-2" />
          <CardTitle className="text-red-600">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to {action} {resourceType || 'this resource'}.
          </CardDescription>
        </CardHeader>
      </Card>
    ) : (
      <>{fallback}</>
    );
  }

  return <>{children}</>;
};

