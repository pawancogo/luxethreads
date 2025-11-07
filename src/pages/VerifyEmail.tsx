import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  
  const type = searchParams.get('type') || 'user';
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!id || !email) {
      setError('Invalid verification link. Please use the link from your email.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          type,
          id,
          email,
          otp: otp.trim(),
        }),
      });

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const flashMessages = doc.querySelectorAll('.flash-message, [class*="alert"], [class*="notice"]');
      
      if (response.ok && text.includes('verified successfully')) {
        setIsVerified(true);
        setError('');
        toast({
          title: 'Email Verified!',
          description: 'Your email has been successfully verified.',
        });
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // Extract error message from response
        const errorMsg = Array.from(flashMessages)
          .map(el => el.textContent)
          .filter(Boolean)
          .join(' ') || 'Verification failed. Please check your code and try again.';
        setError(errorMsg);
        toast({
          title: 'Verification Failed',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      setError('Failed to verify email. Please try again.');
      toast({
        title: 'Error',
        description: error?.message || 'Failed to verify email',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!id || !email) {
      toast({
        title: 'Error',
        description: 'Invalid verification link',
        variant: 'destructive',
      });
      return;
    }

    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          type,
          id,
          email,
        }),
      });

      const text = await response.text();
      
      if (response.ok) {
        toast({
          title: 'Verification Email Sent',
          description: 'A new verification code has been sent to your email.',
        });
      } else {
        toast({
          title: 'Failed to Resend',
          description: 'Failed to send verification email. Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to resend verification email',
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
              Your email has been successfully verified. You can now use all features of LuxeThreads.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                Continue to Home
              </Button>
            </Link>
            <Link to="/profile" className="block">
              <Button variant="outline" className="w-full">
                Go to Profile
              </Button>
            </Link>
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
            {email ? (
              <>We've sent a verification code to <strong>{email}</strong></>
            ) : (
              'Please enter the verification code sent to your email'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
                autoFocus
              />
              {error && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={isVerifying || !otp.trim()}
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
          </form>

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

