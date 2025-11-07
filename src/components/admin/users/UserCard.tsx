import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Mail, Phone, ShoppingBag } from 'lucide-react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  orders_count: number;
}

interface UserCardProps {
  user: User;
  onActivate?: (userId: number) => void;
  onDeactivate?: (userId: number) => void;
  onDelete?: (userId: number) => void;
  onViewDetails?: (userId: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onActivate,
  onDeactivate,
  onDelete,
  onViewDetails,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{user.full_name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onViewDetails && (
              <DropdownMenuItem onClick={() => onViewDetails(user.id)}>
                View Details
              </DropdownMenuItem>
            )}
            {user.is_active && onDeactivate && (
              <DropdownMenuItem onClick={() => onDeactivate(user.id)}>
                Deactivate
              </DropdownMenuItem>
            )}
            {!user.is_active && onActivate && (
              <DropdownMenuItem onClick={() => onActivate(user.id)}>
                Activate
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(user.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          {user.phone_number && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{user.phone_number}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShoppingBag className="h-4 w-4" />
            <span>{user.orders_count} orders</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={user.is_active ? 'default' : 'secondary'}>
              {user.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;

