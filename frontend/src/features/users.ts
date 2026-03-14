import { apiClient } from '../services/apiClient';

export interface AdminUserStats {
  totalUsers: number;
}

export const fetchAdminUserStats = async (): Promise<AdminUserStats> => {
  const res = await apiClient.get('/users/admin/stats');
  return res.data.data;
};
