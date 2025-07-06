import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { user, login, signup, isLoading } = useUser();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (success) {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        } else {
          toast({
            title: "Login failed",
            description: "Please check your credentials and try again.",
            variant: "destructive",
          });
        }
      } else {
        success = await signup(formData.name, formData.email, formData.password);
        if (success) {
          toast({
            title: "Account created!",
            description: "Your account has been created successfully.",
          });
        } else {
          toast({
            title: "Signup failed",
            description: "Please try again with different details.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Welcome back! Please enter your details.'
                : 'Get started by creating your account.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-600 text-center">
                <strong>Demo:</strong> Use any email and password to sign in
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
