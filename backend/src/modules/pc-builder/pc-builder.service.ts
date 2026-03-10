import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ProductCategory, Product } from '../products/entities/product.entity';

export interface PcBuildSelection {
  cpuId?: string;
  motherboardId?: string;
  gpuId?: string;
  ramId?: string;
  psuId?: string;
  caseId?: string;
}

@Injectable()
export class PcBuilderService {
  constructor(private readonly productsService: ProductsService) {}

  async validateBuild(selection: PcBuildSelection) {
    const ids = Object.values(selection).filter(Boolean) as string[];
    const products: Product[] = [];
    for (const id of ids) {
      products.push(await this.productsService.findOne(id));
    }

    const findByCategory = (cat: ProductCategory) =>
      products.find((p) => p.category === cat);

    const cpu = findByCategory(ProductCategory.CPU);
    const mb = findByCategory(ProductCategory.MOTHERBOARD);
    const gpu = findByCategory(ProductCategory.GPU);
    const ram = findByCategory(ProductCategory.RAM);
    const psu = findByCategory(ProductCategory.PSU);
    const pcCase = findByCategory(ProductCategory.CASE);

    const issues: string[] = [];

    if (cpu && mb) {
      const cpuSocket = cpu.compatibility?.cpuSocket;
      const mbSocket = mb.compatibility?.motherboardSocket;
      if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        issues.push(`CPU socket ${cpuSocket} is not compatible with motherboard socket ${mbSocket}.`);
      }
    }

    if (gpu && pcCase) {
      const gpuLen = gpu.compatibility?.gpuLengthMm;
      const caseMax = pcCase.compatibility?.caseGpuMaxLengthMm;
      if (gpuLen && caseMax && gpuLen > caseMax) {
        issues.push(
          `GPU length ${gpuLen}mm exceeds case GPU max clearance ${caseMax}mm.`
        );
      }
    }

    if (ram && mb) {
      const ramType = ram.compatibility?.ramType;
      const mbRamType = mb.compatibility?.ramType;
      if (ramType && mbRamType && ramType !== mbRamType) {
        issues.push(`RAM type ${ramType} not supported by motherboard (${mbRamType}).`);
      }
    }

    if (psu && (cpu || gpu)) {
      const psuWatt = psu.compatibility?.psuWattage || 0;
      const cpuTdp = Number(cpu?.specs?.tdp || 65);
      const gpuTdp = Number(gpu?.specs?.tdp || 200);
      const estimated = cpuTdp + gpuTdp + 150;
      if (psuWatt < estimated) {
        issues.push(
          `PSU wattage ${psuWatt}W may be insufficient. Estimated requirement: ${estimated}W.`
        );
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

