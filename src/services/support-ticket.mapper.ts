/**
 * Support Ticket Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

export interface SupportTicket {
  id: number;
  ticket_id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  message_count: number;
}

export interface TicketDetail extends SupportTicket {
  description: string;
  resolution?: string;
  messages: Array<{
    id: number;
    message: string;
    sender_type: string;
    sender_name: string;
    created_at: string;
  }>;
}

/**
 * Support Ticket Mapper - Transforms API responses to application models
 */
export class SupportTicketMapper {
  /**
   * Map API response to SupportTicket array
   */
  mapApiResponseToTickets(response: any): SupportTicket[] {
    if (response?.data?.success && response?.data?.data) {
      return response.data.data;
    }
    return Array.isArray(response) ? response : [];
  }

  /**
   * Map API response to TicketDetail
   */
  mapApiResponseToTicketDetail(response: any): TicketDetail {
    return (response?.data?.data || response) as TicketDetail;
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.message || 'Failed to process support ticket';
  }
}

export const supportTicketMapper = new SupportTicketMapper();

