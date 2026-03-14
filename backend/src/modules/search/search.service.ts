import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'elasticsearch';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from '../products/products.service';
import { SearchProductsDto } from '../products/dto/search-products.dto';
import { ListingsService } from '../../listings/listings.service';
import { GpusService } from '../../gpus/gpus.service';

@Injectable()
export class SearchService {
  constructor(
    @Inject('ELASTIC_CLIENT') private readonly elastic: Client,
    private readonly config: ConfigService,
    private readonly productsService: ProductsService,
    private readonly listingsService: ListingsService,
    private readonly gpusService: GpusService
  ) {}

  async health() {
    return this.elastic.cluster.health({});
  }

  async ensureIndex() {
    const index = this.config.get('elastic.index');
    const exists = await this.elastic.indices.exists({ index });
    const existsBool = (exists as any).body ?? exists;
    if (!existsBool) {
      await this.elastic.indices.create({
        index,
        body: {
          mappings: {
            properties: {
              name: { type: 'text' },
              brand: { type: 'keyword' },
              category: { type: 'keyword' },
              price: { type: 'float' },
              rating: { type: 'float' },
              ratingCount: { type: 'integer' },
              inStock: { type: 'boolean' }
            }
          }
        }
      });
    }
  }

  async searchProducts(query: SearchProductsDto) {
    return this.productsService.search(query);
  }

  async searchListings(filters: { q?: string; minPrice?: number; maxPrice?: number }) {
    return this.listingsService.findAll(filters);
  }

  async searchGpus(q?: string) {
    return this.gpusService.search(q);
  }

  async searchAll(q?: string) {
    const [products, listings, gpus] = await Promise.all([
      this.productsService.search({ q }),
      this.listingsService.findAll({ q }),
      this.gpusService.search(q),
    ]);

    return {
      products,
      listings,
      gpus,
    };
  }
}

