import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ProfileFormProps {
  profileForm: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  };
  onProfileFormChange: (field: string, value: string) => void;
  onUpdateProfile: () => void;
  onCancelEdit: () => void;
  hasProfile: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileForm,
  onProfileFormChange,
  onUpdateProfile,
  onCancelEdit,
  hasProfile,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Company Name *</Label>
          <Input
            value={profileForm.company_name}
            onChange={(e) => onProfileFormChange('company_name', e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <Label>GST Number *</Label>
          <Input
            value={profileForm.gst_number}
            onChange={(e) => onProfileFormChange('gst_number', e.target.value)}
            placeholder="Enter GST number"
          />
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <Label>Description</Label>
          <Textarea
            value={profileForm.description}
            onChange={(e) => onProfileFormChange('description', e.target.value)}
            placeholder="Enter company description"
            rows={4}
          />
        </div>
        <div>
          <Label>Website URL</Label>
          <Input
            value={profileForm.website_url}
            onChange={(e) => onProfileFormChange('website_url', e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onUpdateProfile}>
          {hasProfile ? 'Save Changes' : 'Create Profile'}
        </Button>
        {hasProfile && (
          <Button variant="outline" onClick={onCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Note: Supplier tier and other advanced settings are managed by administrators.
      </p>
    </div>
  );
};

export default ProfileForm;

