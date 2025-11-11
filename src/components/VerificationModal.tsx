import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, AlertCircle } from 'lucide-react';

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  verificationUrl: string;
  errorCode?: string;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  open,
  onClose,
  message,
  verificationUrl,
  errorCode
}) => {
  const navigate = useNavigate();

  const handleVerify = () => {
    // Navigate to verification page
    navigate(verificationUrl);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal={true}>
      <DialogContent 
        className="sm:max-w-md" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-amber-100 p-3">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Account Verification Required
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleVerify}
            className="w-full"
            size="lg"
          >
            <Mail className="mr-2 h-4 w-4" />
            Verify Your Account
          </Button>
          <p className="text-xs text-center text-gray-500">
            You will be redirected to the verification page to complete the process.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;

