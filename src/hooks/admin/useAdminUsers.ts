import { useState, useEffect } from 'react';
import { adminUsersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  orders_count: number;
}

interface UseAdminUsersReturn {
  users: User[];
  loading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  fetchUsers: (params?: {
    page?: number;
    per_page?: number;
    email?: string;
    search?: string;
    role?: string;
    active?: boolean;
  }) => Promise<void>;
  activateUser: (userId: number) => Promise<boolean>;
  deactivateUser: (userId: number) => Promise<boolean>;
  deleteUser: (userId: number) => Promise<boolean>;
  updateUser: (userId: number, userData: Partial<User>) => Promise<boolean>;
}

export const useAdminUsers = (): UseAdminUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchUsers = async (params?: {
    page?: number;
    per_page?: number;
    email?: string;
    search?: string;
    role?: string;
    active?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUsersAPI.getUsers(params);
      setUsers(response || []);
      // Assuming pagination metadata is in response
      // Adjust based on your API response structure
      if (params?.page) {
        setCurrentPage(params.page);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (userId: number): Promise<boolean> => {
    try {
      await adminUsersAPI.activateUser(userId);
      await fetchUsers({ page: currentPage });
      toast({
        title: 'Success',
        description: 'User activated successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to activate user',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deactivateUser = async (userId: number): Promise<boolean> => {
    try {
      await adminUsersAPI.deactivateUser(userId);
      await fetchUsers({ page: currentPage });
      toast({
        title: 'Success',
        description: 'User deactivated successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to deactivate user',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteUser = async (userId: number): Promise<boolean> => {
    try {
      await adminUsersAPI.deleteUser(userId);
      await fetchUsers({ page: currentPage });
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateUser = async (userId: number, userData: Partial<User>): Promise<boolean> => {
    try {
      await adminUsersAPI.updateUser(userId, {
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number,
        email: userData.email,
      });
      await fetchUsers({ page: currentPage });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    totalPages,
    currentPage,
    fetchUsers,
    activateUser,
    deactivateUser,
    deleteUser,
    updateUser,
  };
};

