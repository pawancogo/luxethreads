import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isLoading, admin } = useAdmin();
  const { toast } = useToast();

  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const getErrorMessage = (error: Error | undefined): string => {
    if (!error) return 'Please check your credentials and try again.';
    const message = error.message || '';
    const errors = (error as any).errors || [];
    return errors.length > 0 ? errors.join(', ') : (message || 'Please check your credentials and try again.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast({ title: 'Welcome!', description: 'You have successfully logged in as admin.' });
      // Navigation will happen automatically via the Navigate component above
    } else {
      const errorMsg = getErrorMessage(result.error);
      toast({
        title: 'Login failed',
        description: errorMsg,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;

