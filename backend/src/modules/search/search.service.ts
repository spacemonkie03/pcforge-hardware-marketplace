import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  constructor(
    @Inject('ELASTIC_CLIENT') private readonly elastic: Client,
    private readonly config: ConfigService
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
}

