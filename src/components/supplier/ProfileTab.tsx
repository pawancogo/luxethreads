import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Edit, Loader2 } from 'lucide-react';
import { SupplierProfile } from './types';
import ProfileForm from './profile/ProfileForm';
import ProfileView from './profile/ProfileView';
import DocumentUpload, { KYCDocument } from './profile/DocumentUpload';

interface ProfileTabProps {
  supplierProfile: SupplierProfile | null;
  isLoadingProfile: boolean;
  isEditingProfile: boolean;
  profileForm: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  };
  onEditProfile: () => void;
  onCancelEdit: () => void;
  onUpdateProfile: () => void;
  onProfileFormChange: (field: string, value: string) => void;
  onProfileRefresh?: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  supplierProfile,
  isLoadingProfile,
  isEditingProfile,
  profileForm,
  onEditProfile,
  onCancelEdit,
  onUpdateProfile,
  onProfileFormChange,
  onProfileRefresh,
}) => {
  // Extract KYC documents from profile
  const kycDocuments: KYCDocument[] = (supplierProfile?.kyc_documents as any) || [];

  const handleDocumentsChange = () => {
    // Refresh profile to get updated documents
    if (onProfileRefresh) {
      onProfileRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Supplier Profile</CardTitle>
              <CardDescription>Manage your supplier information</CardDescription>
            </div>
            {supplierProfile && !isEditingProfile && (
              <Button variant="outline" onClick={onEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingProfile ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : isEditingProfile || !supplierProfile ? (
            <ProfileForm
              profileForm={profileForm}
              onProfileFormChange={onProfileFormChange}
              onUpdateProfile={onUpdateProfile}
              onCancelEdit={onCancelEdit}
              hasProfile={!!supplierProfile}
            />
          ) : (
            <ProfileView profile={supplierProfile} />
          )}
        </CardContent>
      </Card>

      {/* KYC Documents Section - Only show when profile exists */}
      {supplierProfile && !isEditingProfile && (
        <DocumentUpload
          documents={kycDocuments}
          onDocumentsChange={handleDocumentsChange}
        />
      )}
    </div>
  );
};

export default ProfileTab;

