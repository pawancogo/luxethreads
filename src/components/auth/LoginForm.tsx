import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUserActions, useUserLoading } from '@/stores/userStore';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useUserActions();
  const isLoading = useUserLoading();
  const { toast } = useToast();

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
      toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
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
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
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
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <div className="text-center text-sm space-y-2">
            <div>
              <Link
                to="/forgot-password"
                className="text-pink-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div>
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-pink-600 hover:underline"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

