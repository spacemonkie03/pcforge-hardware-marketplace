import { apiClient } from '../services/apiClient';
import { SelectedParts } from '../store/usePcBuilderStore';

export interface PcValidationResult {
  valid: boolean;
  issues: string[];
}

export const validateBuild = async (
  selection: SelectedParts
): Promise<PcValidationResult> => {
  const res = await apiClient.post('/pc-builder/validate', selection);
  return res.data.data;
};

