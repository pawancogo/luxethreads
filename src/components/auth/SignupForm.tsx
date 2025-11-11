import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUserActions, useUserLoading, UserRole } from '@/stores/userStore';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'customer' as UserRole,
    companyName: '',
    taxId: '',
  });
  const { signup } = useUserActions();
  const isLoading = useUserLoading();
  const { toast } = useToast();

  const getErrorMessage = (error: Error | undefined): string => {
    if (!error) return 'Please try again with different details.';
    const message = error.message || '';
    const errors = (error as any).errors || [];
    return errors.length > 0 ? errors.join(', ') : (message || 'Please try again with different details.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phone_number) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in first name, last name, and phone number.',
        variant: 'destructive'
      });
      return;
    }
    
    const result = await signup(
      `${formData.firstName} ${formData.lastName}`.trim(),
      formData.email,
      formData.password,
      formData.role,
      formData.companyName || undefined,
      formData.taxId || undefined,
      formData.phone_number || undefined,
      formData.firstName,
      formData.lastName
    );

    if (result.success) {
      toast({ 
        title: 'Account created!', 
        description: 'Your account has been created successfully.' 
      });
      
      // Don't navigate here - let Auth.tsx handle the redirect based on user state
      // This prevents infinite re-renders from conflicting navigation
    } else {
      const errorMessage = getErrorMessage(result.error);
      toast({
        title: 'Signup failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const isSupplier = formData.role === 'supplier';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isSupplier && (
            <>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="taxId">GST/Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-pink-600 hover:underline"
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;

