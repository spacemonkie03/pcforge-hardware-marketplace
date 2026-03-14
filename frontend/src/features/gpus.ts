import { apiClient } from '../services/apiClient';

export interface GpuReference {
  id: number;
  name: string;
  slug: string;
  manufacturer: string;
  architecture?: string;
  releaseYear?: number;
  processNm?: number;
  vramGb?: number;
  memoryType?: string;
  memoryBusWidth?: number;
  pcieVersion?: string;
  tdpWatts?: number;
}

export const searchGpus = async (q: string): Promise<GpuReference[]> => {
  const res = await apiClient.get('/search/gpus', { params: { q } });
  return res.data.data;
};
