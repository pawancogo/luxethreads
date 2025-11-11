/**
 * SupportTickets Page - Clean Architecture Implementation
 * Uses SupportTicketService for business logic
 * Follows: UI → Logic (SupportTicketService) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, MessageSquare, Loader2, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { supportTicketService } from '@/services/support-ticket.service';
import type { SupportTicket, TicketDetail } from '@/services/support-ticket.mapper';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  waiting_customer: 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const { toast } = useToast();
  
  const [newTicket, setNewTicket] = useState<{
    subject: string;
    description: string;
    category: 'order_issue' | 'product_issue' | 'payment_issue' | 'account_issue' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }>({
    subject: '',
    description: '',
    category: 'other',
    priority: 'medium',
  });
  
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const ticketsList = await supportTicketService.getTickets();
      setTickets(ticketsList);
    } catch (error: any) {
      const errorMessage = supportTicketService.extractErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketDetail = async (ticketId: number) => {
    try {
      const ticketDetail = await supportTicketService.getTicketDetails(ticketId);
      setSelectedTicket(ticketDetail);
      setIsDialogOpen(true);
    } catch (error: any) {
      const errorMessage = supportTicketService.extractErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await supportTicketService.createTicket(newTicket);
      toast({
        title: 'Success',
        description: 'Support ticket created successfully',
      });
      setIsCreateDialogOpen(false);
      setNewTicket({ subject: '', description: '', category: 'other', priority: 'medium' });
      fetchTickets();
    } catch (error: any) {
      const errorMessage = supportTicketService.extractErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    setIsSendingMessage(true);
    try {
      await supportTicketService.sendMessage(selectedTicket.id, { message: newMessage });
      toast({
        title: 'Success',
        description: 'Message sent successfully',
      });
      setNewMessage('');
      fetchTicketDetail(selectedTicket.id);
    } catch (error: any) {
      const errorMessage = supportTicketService.extractErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-1">Get help with your orders and account</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll help you resolve it
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value) => setNewTicket({ ...newTicket, category: value as 'order_issue' | 'product_issue' | 'payment_issue' | 'account_issue' | 'other' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order_issue">Order Issue</SelectItem>
                    <SelectItem value="product_issue">Product Issue</SelectItem>
                    <SelectItem value="payment_issue">Payment Issue</SelectItem>
                    <SelectItem value="account_issue">Account Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as 'low' | 'medium' | 'high' | 'urgent' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Provide detailed information about your issue"
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTicket} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && tickets.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No support tickets yet</p>
            <p className="text-gray-500 text-sm mt-2">Create a ticket to get help</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => fetchTicketDetail(ticket.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                      <Badge className={statusColors[ticket.status] || 'bg-gray-100 text-gray-800'}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1 capitalize">{ticket.status.replace('_', ' ')}</span>
                      </Badge>
                      <Badge className={priorityColors[ticket.priority] || 'bg-gray-100 text-gray-800'}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Ticket #{ticket.ticket_id}</span>
                      <span>•</span>
                      <span>{ticket.message_count} message{ticket.message_count !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Ticket Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTicket.subject}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={statusColors[selectedTicket.status] || 'bg-gray-100 text-gray-800'}>
                      {getStatusIcon(selectedTicket.status)}
                      <span className="ml-1 capitalize">{selectedTicket.status.replace('_', ' ')}</span>
                    </Badge>
                    <Badge className={priorityColors[selectedTicket.priority] || 'bg-gray-100 text-gray-800'}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{selectedTicket.description}</p>
                </div>

                {selectedTicket.resolution && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Resolution</h4>
                    <p className="text-green-800">{selectedTicket.resolution}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-3">Messages</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedTicket.messages?.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.sender_type === 'user'
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{message.sender_name}</span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                  <div className="border-t pt-4">
                    <Label htmlFor="message">Send a message</Label>
                    <div className="flex gap-2 mt-2">
                      <Textarea
                        id="message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={3}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSendingMessage}
                      >
                        {isSendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Send'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportTickets;

