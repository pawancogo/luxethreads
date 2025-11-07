import React, { useState, useEffect } from 'react';
import { adminSettingsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Plus, Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Setting {
  id: number;
  key: string;
  value: any;
  value_type: string;
  category: string;
  description?: string;
  is_public: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    value_type: 'string',
    category: 'general',
    description: '',
    is_public: false,
  });
  const { toast } = useToast();

  const categories = ['general', 'payment', 'shipping', 'email', 'feature_flags'];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await adminSettingsAPI.getSettings();
      setSettings(response || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (setting: Setting, newValue: any) => {
    try {
      await adminSettingsAPI.updateSetting(setting.id, { value: newValue });
      toast({
        title: 'Success',
        description: 'Setting updated successfully',
      });
      await fetchSettings();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update setting',
        variant: 'destructive',
      });
    }
  };

  const handleOpenDialog = (setting?: Setting) => {
    if (setting) {
      setEditingSetting(setting);
      setFormData({
        key: setting.key,
        value: setting.value?.toString() || '',
        value_type: setting.value_type,
        category: setting.category,
        description: setting.description || '',
        is_public: setting.is_public,
      });
    } else {
      setEditingSetting(null);
      setFormData({
        key: '',
        value: '',
        value_type: 'string',
        category: 'general',
        description: '',
        is_public: false,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingSetting) {
        await adminSettingsAPI.updateSetting(editingSetting.id, formData);
        toast({
          title: 'Success',
          description: 'Setting updated successfully',
        });
      } else {
        await adminSettingsAPI.createSetting(formData);
        toast({
          title: 'Success',
          description: 'Setting created successfully',
        });
      }
      setDialogOpen(false);
      await fetchSettings();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save setting',
        variant: 'destructive',
      });
    }
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.category === category);
  };

  const SettingInput: React.FC<{ setting: Setting }> = ({ setting }) => {
    const [localValue, setLocalValue] = useState(setting.value);

    useEffect(() => {
      setLocalValue(setting.value);
    }, [setting.value]);

    const handleBlur = () => {
      if (localValue !== setting.value) {
        handleSave(setting, localValue);
      }
    };

    switch (setting.value_type) {
      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={localValue === true || localValue === 'true'}
              onCheckedChange={(checked) => {
                setLocalValue(checked);
                handleSave(setting, checked);
              }}
            />
            <span className="text-sm text-gray-600">{localValue ? 'Enabled' : 'Disabled'}</span>
          </div>
        );
      case 'integer':
      case 'float':
        return (
          <Input
            type="number"
            step={setting.value_type === 'float' ? '0.01' : '1'}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            className="max-w-xs"
          />
        );
      default:
        return (
          <Input
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            className="max-w-xs"
          />
        );
    }
  };

  if (loading && settings.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Settings</h1>
          <p className="text-gray-600">Manage platform configuration and settings</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Setting
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle>{category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')} Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getSettingsByCategory(category).map(setting => (
                    <div key={setting.id} className="flex items-start justify-between gap-4 pb-4 border-b last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Label className="font-semibold">{setting.key}</Label>
                          <span className="text-xs text-gray-500">({setting.value_type})</span>
                        </div>
                        {setting.description && (
                          <p className="text-sm text-gray-600 mb-2">{setting.description}</p>
                        )}
                        <SettingInput setting={setting} />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(setting)}
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                  {getSettingsByCategory(category).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No settings in this category</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSetting ? 'Edit Setting' : 'Create Setting'}</DialogTitle>
            <DialogDescription>
              {editingSetting ? 'Update setting details' : 'Create a new system setting'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="key">Key *</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                disabled={!!editingSetting}
                placeholder="site_name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value_type">Value Type *</Label>
                <Select
                  value={formData.value_type}
                  onValueChange={(value) => setFormData({ ...formData, value_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="integer">Integer</SelectItem>
                    <SelectItem value="float">Float</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="value">Value *</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Setting description..."
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
              />
              <Label htmlFor="is_public">Public (exposed to frontend)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.key || !formData.value}>
              {editingSetting ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;

