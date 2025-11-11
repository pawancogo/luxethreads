/**
 * Support Ticket Service - Business Logic Layer
 * Handles support ticket operations and business rules
 * Follows Single Responsibility Principle
 */

import { SupportTicketRepository, CreateTicketData, SendMessageData } from './support-ticket.repository';
import { SupportTicketMapper, SupportTicket, TicketDetail } from './support-ticket.mapper';

/**
 * Support Ticket Service - Business logic for support ticket operations
 */
export class SupportTicketService {
  private repository: SupportTicketRepository;
  private mapper: SupportTicketMapper;

  constructor(repository?: SupportTicketRepository) {
    this.repository = repository || new SupportTicketRepository();
    this.mapper = new SupportTicketMapper();
  }

  /**
   * Get user tickets
   */
  async getTickets(): Promise<SupportTicket[]> {
    try {
      const response = await this.repository.getTickets();
      return this.mapper.mapApiResponseToTickets(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get ticket details
   */
  async getTicketDetails(ticketId: string | number): Promise<TicketDetail> {
    try {
      const response = await this.repository.getTicketDetails(ticketId);
      return this.mapper.mapApiResponseToTicketDetail(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create ticket
   */
  async createTicket(data: CreateTicketData): Promise<SupportTicket> {
    try {
      const response = await this.repository.createTicket(data);
      return this.mapper.mapApiResponseToTicketDetail(response) as SupportTicket;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send message
   */
  async sendMessage(ticketId: string | number, data: SendMessageData): Promise<void> {
    try {
      await this.repository.sendMessage(ticketId, data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract error message
   */
  extractErrorMessage(error: any): string {
    return this.mapper.extractErrorMessage(error);
  }
}

export const supportTicketService = new SupportTicketService();

