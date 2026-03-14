import { apiClient } from '../services/apiClient';

export interface PaymentOption {
  type: string;
  providers: string[];
  fields: string[];
}

export interface PaymentMethod {
  id: string;
  type: string;
  provider: string;
  label: string;
  status: string;
  isDefault: boolean;
  details?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface PaymentMethodInput {
  type: string;
  provider: string;
  label: string;
  details?: Record<string, any>;
  metadata?: Record<string, any>;
  isDefault?: boolean;
}

export const fetchPaymentOptions = async (): Promise<PaymentOption[]> => {
  const res = await apiClient.get('/payment-methods/options');
  return res.data.data;
};

export const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const res = await apiClient.get('/payment-methods');
  return res.data.data;
};

export const createPaymentMethod = async (payload: PaymentMethodInput): Promise<PaymentMethod> => {
  const res = await apiClient.post('/payment-methods', payload);
  return res.data.data;
};

export const updatePaymentMethod = async (
  id: string,
  payload: Partial<PaymentMethodInput>
): Promise<PaymentMethod> => {
  const res = await apiClient.patch(`/payment-methods/${id}`, payload);
  return res.data.data;
};

export const deletePaymentMethod = async (id: string) => {
  const res = await apiClient.delete(`/payment-methods/${id}`);
  return res.data.data;
};
