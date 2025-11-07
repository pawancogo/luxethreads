import React, { useState, useEffect } from 'react';
import { adminEmailTemplatesAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Mail, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: number;
  template_type: string;
  subject: string;
  body_html?: string;
  body_text?: string;
  from_email?: string;
  from_name?: string;
  is_active: boolean;
  variables?: Record<string, any>;
  description?: string;
}

const TEMPLATE_TYPES = [
  'welcome',
  'order_confirmation',
  'order_shipped',
  'order_delivered',
  'order_cancelled',
  'password_reset',
  'email_verification',
  'return_approved',
  'return_rejected',
  'payment_failed',
  'payment_success',
  'supplier_approval',
  'supplier_rejection',
  'product_approved',
  'product_rejected',
];

const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [formData, setFormData] = useState({
    template_type: '',
    subject: '',
    body_html: '',
    body_text: '',
    from_email: '',
    from_name: '',
    is_active: true,
    description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await adminEmailTemplatesAPI.getTemplates();
      setTemplates(response || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch templates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (template?: EmailTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        template_type: template.template_type,
        subject: template.subject,
        body_html: template.body_html || '',
        body_text: template.body_text || '',
        from_email: template.from_email || '',
        from_name: template.from_name || '',
        is_active: template.is_active,
        description: template.description || '',
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        template_type: '',
        subject: '',
        body_html: '',
        body_text: '',
        from_email: '',
        from_name: '',
        is_active: true,
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingTemplate) {
        await adminEmailTemplatesAPI.updateTemplate(editingTemplate.id, formData);
        toast({
          title: 'Success',
          description: 'Template updated successfully',
        });
      } else {
        await adminEmailTemplatesAPI.createTemplate(formData);
        toast({
          title: 'Success',
          description: 'Template created successfully',
        });
      }
      setDialogOpen(false);
      await fetchTemplates();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save template',
        variant: 'destructive',
      });
    }
  };

  const handlePreview = async (template: EmailTemplate) => {
    try {
      const preview = await adminEmailTemplatesAPI.previewTemplate(template.id, {});
      setPreviewData(preview);
      setPreviewDialogOpen(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to preview template',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEditingTemplate(template);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (editingTemplate?.id) {
      try {
        await adminEmailTemplatesAPI.deleteTemplate(editingTemplate.id);
        toast({
          title: 'Success',
          description: 'Template deleted successfully',
        });
        setDeleteDialogOpen(false);
        setEditingTemplate(null);
        await fetchTemplates();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete template',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading && templates.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading email templates...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Email Templates</h1>
          <p className="text-gray-600">Manage email templates for notifications</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {template.template_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOpenDialog(template)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePreview(template)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">{template.subject}</p>
                {template.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {template.is_active ? (
                    <Badge variant="default" className="bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                {template.from_email && (
                  <p className="text-xs text-gray-500">From: {template.from_email}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <Card className="text-center p-8">
          <p className="text-gray-500">No email templates found</p>
          <Button onClick={() => handleOpenDialog()} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create First Template
          </Button>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Edit Email Template' : 'Create Email Template'}</DialogTitle>
            <DialogDescription>
              {editingTemplate ? 'Update email template' : 'Create a new email template'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template_type">Template Type *</Label>
                <Select
                  value={formData.template_type}
                  onValueChange={(value) => setFormData({ ...formData, template_type: value })}
                  disabled={!!editingTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Email subject line"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from_email">From Email</Label>
                <Input
                  id="from_email"
                  type="email"
                  value={formData.from_email}
                  onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                  placeholder="noreply@example.com"
                />
              </div>
              <div>
                <Label htmlFor="from_name">From Name</Label>
                <Input
                  id="from_name"
                  value={formData.from_name}
                  onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                  placeholder="Luxe Threads"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="body_html">HTML Body</Label>
              <Textarea
                id="body_html"
                value={formData.body_html}
                onChange={(e) => setFormData({ ...formData, body_html: e.target.value })}
                placeholder="HTML email body. Use {{variable_name}} for dynamic content."
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {{variable_name}} syntax for dynamic content
              </p>
            </div>
            <div>
              <Label htmlFor="body_text">Plain Text Body</Label>
              <Textarea
                id="body_text"
                value={formData.body_text}
                onChange={(e) => setFormData({ ...formData, body_text: e.target.value })}
                placeholder="Plain text email body"
                rows={6}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Template description and usage notes..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.template_type || !formData.subject}>
              {editingTemplate ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          {previewData && (
            <div className="space-y-4">
              <div>
                <Label>From</Label>
                <p className="text-sm">
                  {previewData.from_name || previewData.from_email || 'No sender'}
                  {previewData.from_email && ` <${previewData.from_email}>`}
                </p>
              </div>
              <div>
                <Label>Subject</Label>
                <p className="text-sm font-medium">{previewData.subject}</p>
              </div>
              <div>
                <Label>HTML Body</Label>
                <div
                  className="border rounded p-4 max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: previewData.body_html || 'No HTML body' }}
                />
              </div>
              {previewData.body_text && (
                <div>
                  <Label>Plain Text Body</Label>
                  <pre className="border rounded p-4 max-h-48 overflow-y-auto text-sm whitespace-pre-wrap">
                    {previewData.body_text}
                  </pre>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Email Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this email template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmailTemplates;

