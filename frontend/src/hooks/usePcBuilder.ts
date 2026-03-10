import { useMutation } from "@tanstack/react-query";
import { validateBuild } from "../features/pcBuilder";
import { SelectedParts } from "../store/usePcBuilderStore";

export interface PcValidationResult {
  valid: boolean;
  issues: string[];
}

export const usePcBuilderValidation = () => {
  return useMutation({
    mutationFn: (selection: SelectedParts) => validateBuild(selection),
  });
};