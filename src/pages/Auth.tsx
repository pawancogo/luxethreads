import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser, UserRole } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
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
  const { user, login, signup, isLoading } = useUser();
  const { toast } = useToast();

  if (user) {
    // Redirect based on user role
    const redirectPath = user.role === 'supplier' ? '/supplier' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  const getErrorMessage = (error: Error | undefined): { title: string; description: string } => {
    if (!error) {
      return {
        title: isLogin ? "Login failed" : "Signup failed",
        description: isLogin 
          ? "Please check your credentials and try again."
          : "Please try again with different details."
      };
    }

    // Extract backend error message
    const message = error.message || '';
    const errors = (error as any).errors || [];
    
    // If backend provided errors array, use them
    if (errors.length > 0) {
      return {
        title: message || (isLogin ? "Login failed" : "Signup failed"),
        description: errors.join(', ') || "Please check your information and try again."
      };
    }

    // Use backend message if available
    if (message) {
      return {
        title: isLogin ? "Login failed" : "Signup failed",
        description: message
      };
    }

    // Fallback to static error
    return {
      title: isLogin ? "Login failed" : "Signup failed",
      description: isLogin 
        ? "Please check your credentials and try again."
        : "Please try again with different details."
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let result;
      
      if (isLogin) {
        result = await login(formData.email, formData.password);
        if (result.success) {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        } else {
          const errorMsg = getErrorMessage(result.error);
          toast({
            title: errorMsg.title,
            description: errorMsg.description,
            variant: "destructive",
          });
        }
      } else {
        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.phone_number) {
          toast({
            title: "Missing required fields",
            description: "Please fill in first name, last name, and phone number.",
            variant: "destructive",
          });
          return;
        }

        result = await signup(
          `${formData.firstName} ${formData.lastName}`, // Full name for context
          formData.email, 
          formData.password, 
          formData.role,
          formData.companyName,
          formData.taxId,
          formData.phone_number,
          formData.firstName,
          formData.lastName
        );
        if (result.success) {
          toast({
            title: "Account created!",
            description: "Your account has been created successfully.",
          });
        } else {
          const errorMsg = getErrorMessage(result.error);
          toast({
            title: errorMsg.title,
            description: errorMsg.description,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      const errorMsg = getErrorMessage(error as Error);
      toast({
        title: errorMsg.title,
        description: errorMsg.description,
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

  const handleRoleChange = (value: UserRole) => {
    setFormData({
      ...formData,
      role: value,
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
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      required
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Account Type</Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.role === 'supplier' && (
                    <>
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          type="text"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Enter your company name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="taxId">GST Number</Label>
                        <Input
                          id="taxId"
                          name="taxId"
                          type="text"
                          value={formData.taxId}
                          onChange={handleInputChange}
                          placeholder="GST Number"
                        />
                      </div>
                    </>
                  )}
                </>
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
              <p className="text-sm text-gray-600 text-center mb-2">
                <strong>Demo Accounts:</strong>
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Customer: any email + password</p>
                <p>• Supplier: include "supplier" in email</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
