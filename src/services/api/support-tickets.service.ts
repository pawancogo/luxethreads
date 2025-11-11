/**
 * Support Tickets API Service
 */

import { api } from './base';

export interface SupportTicketData {
  subject: string;
  description?: string;
  category?: 'order_issue' | 'product_issue' | 'payment_issue' | 'account_issue' | 'technical' | 'other';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  message?: string;
}

export interface TicketMessageData {
  content: string;
  attachments?: string[];
}

export const supportTicketsService = {
  /**
   * Get support tickets
   */
  getTickets: async (params?: { status?: string }) => {
    return api.get('/support_tickets', { params });
  },

  /**
   * Create support ticket
   */
  createTicket: async (ticketData: SupportTicketData) => {
    return api.post('/support_tickets', { support_ticket: ticketData });
  },

  /**
   * Get support ticket
   */
  getTicket: async (ticketId: number) => {
    return api.get(`/support_tickets/${ticketId}`);
  },

  /**
   * Add message to ticket
   */
  addMessage: async (ticketId: number, messageData: TicketMessageData) => {
    return api.post(`/support_tickets/${ticketId}/messages`, { message: messageData });
  },
};

