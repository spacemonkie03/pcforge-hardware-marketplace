import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchProductsDto } from '../products/dto/search-products.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('health')
  async health() {
    return this.searchService.health();
  }

  @Get('products')
  async searchProducts(@Query() query: SearchProductsDto) {
    return this.searchService.searchProducts(query);
  }

  @Get('listings')
  async searchListings(
    @Query('q') q?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string
  ) {
    return this.searchService.searchListings({
      q,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  @Get('gpus')
  async searchGpus(@Query('q') q?: string) {
    return this.searchService.searchGpus(q);
  }

  @Get('all')
  async searchAll(@Query('q') q?: string) {
    return this.searchService.searchAll(q);
  }
}
