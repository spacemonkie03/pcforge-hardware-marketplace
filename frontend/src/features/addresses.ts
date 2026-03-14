import { apiClient } from '../services/apiClient';

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string | null;
  label?: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface AddressInput {
  fullName: string;
  phoneNumber: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  landmark?: string;
  label?: string;
  isDefault?: boolean;
}

export const fetchAddresses = async (): Promise<Address[]> => {
  const res = await apiClient.get('/addresses');
  return res.data.data;
};

export const createAddress = async (payload: AddressInput): Promise<Address> => {
  const res = await apiClient.post('/addresses', payload);
  return res.data.data;
};

export const updateAddress = async (id: string, payload: Partial<AddressInput>): Promise<Address> => {
  const res = await apiClient.patch(`/addresses/${id}`, payload);
  return res.data.data;
};

export const deleteAddress = async (id: string) => {
  const res = await apiClient.delete(`/addresses/${id}`);
  return res.data.data;
};
