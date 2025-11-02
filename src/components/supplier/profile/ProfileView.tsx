import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SupplierProfile } from '../types';

interface ProfileViewProps {
  profile: SupplierProfile;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {profile.needs_completion && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Profile needs completion:</strong> Please update your company details using
            the Edit Profile button above.
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium text-gray-500">Company Name</Label>
          <p className="mt-1 text-lg font-semibold">{profile.company_name || 'N/A'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">GST Number</Label>
          <p className="mt-1 text-lg font-semibold">{profile.gst_number || 'N/A'}</p>
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-500">Description</Label>
          <p className="mt-1 text-gray-700 whitespace-pre-wrap">
            {profile.description || 'No description provided'}
          </p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Website URL</Label>
          <p className="mt-1">
            {profile.website_url ? (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {profile.website_url}
              </a>
            ) : (
              'No website URL provided'
            )}
          </p>
        </div>
      </div>
      {profile.verified ? (
        <div className="flex items-center gap-2">
          <Badge variant="default">Verified</Badge>
          <span className="text-sm text-gray-500">Your profile has been verified by admin</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Pending Verification</Badge>
          <span className="text-sm text-gray-500">Your profile is awaiting admin verification</span>
        </div>
      )}
    </div>
  );
};

export default ProfileView;

