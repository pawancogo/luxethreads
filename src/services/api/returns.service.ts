/**
 * Returns API Service (Customer)
 */

import { api } from './base';

export interface ReturnRequestData {
  order_id: number;
  resolution_type: 'refund' | 'replacement';
  items: Array<{
    order_item_id: number;
    quantity: number;
    reason: string;
  }>;
  media?: Array<{
    file_key: string;
    media_type: 'image' | 'video';
  }>;
}

export interface PickupScheduleData {
  pickup_date: string;
  pickup_time: string;
}

export const returnsService = {
  /**
   * Get my returns
   */
  getMyReturns: async () => {
    return api.get('/my-returns');
  },

  /**
   * Create return request
   */
  createReturnRequest: async (returnData: ReturnRequestData) => {
    return api.post('/return_requests', {
      return_request: {
        order_id: returnData.order_id,
        resolution_type: returnData.resolution_type,
      },
      items: returnData.items,
      media: returnData.media,
    });
  },

  /**
   * Get return request
   */
  getReturnRequest: async (returnId: string | number) => {
    return api.get(`/return_requests/${returnId}`);
  },

  /**
   * Get return tracking
   */
  getReturnTracking: async (returnId: string | number) => {
    return api.get(`/return_requests/${returnId}/tracking`);
  },

  /**
   * Schedule pickup
   */
  schedulePickup: async (returnId: string | number, pickupData: PickupScheduleData) => {
    return api.post(`/return_requests/${returnId}/pickup_schedule`, pickupData);
  },
};

