/**
 * Support Ticket Repository - Data Access Layer
 * Abstracts API calls for support ticket operations
 * Follows Repository Pattern
 */

import { supportTicketsService, SupportTicketData, TicketMessageData } from './api/support-tickets.service';

export interface CreateTicketData {
  subject: string;
  description: string;
  category: 'order_issue' | 'product_issue' | 'payment_issue' | 'account_issue' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SendMessageData {
  message: string;
}

/**
 * Support Ticket Repository - Handles data access for support ticket operations
 */
export class SupportTicketRepository {
  /**
   * Get tickets
   */
  async getTickets(): Promise<any> {
    try {
      return await supportTicketsService.getTickets();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get ticket details
   */
  async getTicketDetails(ticketId: string | number): Promise<any> {
    try {
      return await supportTicketsService.getTicket(ticketId as number);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create ticket
   */
  async createTicket(data: CreateTicketData): Promise<any> {
    try {
      const ticketData: SupportTicketData = {
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority: data.priority,
        message: data.description,
      };
      return await supportTicketsService.createTicket(ticketData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send message
   */
  async sendMessage(ticketId: string | number, data: SendMessageData): Promise<any> {
    try {
      const messageData: TicketMessageData = {
        content: data.message,
      };
      return await supportTicketsService.addMessage(ticketId as number, messageData);
    } catch (error) {
      throw error;
    }
  }
}

export const supportTicketRepository = new SupportTicketRepository();

