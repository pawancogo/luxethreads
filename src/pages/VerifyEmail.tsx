import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { emailVerificationService } from '@/services/email-verification.service';
import { useUser, useUserActions } from '@/stores/userStore';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useUser();
  const { refreshUser } = useUserActions();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const userId = searchParams.get('id');
  const type = searchParams.get('type');

  useEffect(() => {
    if (token) {
      // Auto-verify if token is present (from email link)
      handleVerify();
    } else if (email) {
      // If email is present but no token, this is from signup redirect
      // Don't show error, just show the page with resend option
      setError('');
    } else {
      // No token and no email - invalid link
      setError('Invalid verification link. Please use the link from your email.');
    }
  }, [token, email]);

  const handleVerify = async () => {
    if (!token) {
      setError('Invalid verification link. Please use the link from your email.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const result = await emailVerificationService.verify(token);
      setIsVerified(true);
      setError('');
      
      toast({
        title: 'Email Verified!',
        description: result.message,
      });
      
      // If user is logged in, refresh user data to get updated email_verified status
      if (user) {
        try {
          await refreshUser();
        } catch (refreshError) {
          console.error('Failed to refresh user data:', refreshError);
          // Continue with redirect even if refresh fails
        }
        
        // Redirect to dashboard based on user role after 2 seconds
        setTimeout(() => {
          const redirectPath = emailVerificationService.getRedirectPath(user.role);
          navigate(redirectPath);
        }, 2000);
      } else {
        // User is not logged in, redirect to login page after 2 seconds
        setTimeout(() => {
          navigate(emailVerificationService.getLoginRedirectPath());
        }, 2000);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Verification failed. The link may have expired. Please request a new one.';
      setError(errorMsg);
      toast({
        title: 'Verification Failed',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      await emailVerificationService.resend(email || undefined);
      
      toast({
        title: 'Verification Email Sent',
        description: 'A new verification link has been sent to your email.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Resend',
        description: error?.message || 'Failed to send verification email. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Email Verified!</CardTitle>
            <CardDescription>
              {user 
                ? 'Your email has been successfully verified. Redirecting you to your dashboard...'
                : 'Your email has been successfully verified. Please log in to continue.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <Link to={user.role === 'supplier' ? '/supplier' : '/'} className="block">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full">
                    Go to Profile
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth" className="block">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  Go to Login
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            Click the button below to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {!isVerified && token && (
            <div className="space-y-4">
              <Button
                onClick={handleVerify}
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={isVerifying || !token}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>
            </div>
          )}

          {!isVerified && !token && email && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Verification email sent!</strong> Please check your email ({email}) for the verification link.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 text-center mb-3">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification Code'
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/auth" className="text-sm text-amber-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;

