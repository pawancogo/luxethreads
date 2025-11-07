import { useState } from 'react';
import { useDialog } from '@/hooks/useDialog';
import { useForm } from '@/hooks/useForm';

interface UseOrderDialogsReturn {
  isShipOrderOpen: boolean;
  selectedOrderItemId: number | null;
  selectedOrderId: number | null;
  trackingNumber: string;
  openShipOrder: (orderItemId: number, orderId: number) => void;
  closeShipOrder: () => void;
  setTrackingNumber: (value: string) => void;
}

export const useOrderDialogs = (): UseOrderDialogsReturn => {
  const shipOrderDialog = useDialog();
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const trackingForm = useForm({ tracking_number: '' });

  const openShipOrder = (orderItemId: number, orderId: number) => {
    setSelectedOrderItemId(orderItemId);
    setSelectedOrderId(orderId);
    trackingForm.setValue('tracking_number', '');
    shipOrderDialog.open();
  };

  const closeShipOrder = () => {
    setSelectedOrderItemId(null);
    setSelectedOrderId(null);
    trackingForm.setValue('tracking_number', '');
    shipOrderDialog.close();
  };

  const setTrackingNumber = (value: string) => {
    trackingForm.setValue('tracking_number', value);
  };

  return {
    isShipOrderOpen: shipOrderDialog.isOpen,
    selectedOrderItemId,
    selectedOrderId,
    trackingNumber: trackingForm.values.tracking_number,
    openShipOrder,
    closeShipOrder,
    setTrackingNumber,
  };
};


