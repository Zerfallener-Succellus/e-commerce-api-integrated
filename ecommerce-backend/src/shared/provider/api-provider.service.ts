// src/shared/api-provider/api-provider.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { Product } from '../../products/intefaces/products.interface';

@Injectable()
export class ApiProviderService {
  private readonly logger = new Logger(ApiProviderService.name);
  private readonly BRAZILIAN_PROVIDER_URL = 'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider';
  private readonly EUROPEAN_PROVIDER_URL = 'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider';

  constructor(private readonly httpService: HttpService) {}

  private mapBrazilianProduct(item: any): Product {
    return {
      id: `br-${item.id}`, 
      name: item.nome,
      description: item.descricao,
      price: parseFloat(item.preco),
      imageUrl: item.imagem,
      origin: 'Brasil',
    };
  }

  
  private mapEuropeanProduct(item: any): Product {
    return {
      id: `eu-${item.id}`, 
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      imageUrl: item.gallery[0],
      origin: 'Europa',
    };
  }

  async fetchAllProducts(): Promise<Product[]> {
    this.logger.log('Fetching products from all providers...');

    try {
      const [brazilianResponse, europeanResponse] = await Promise.all([
        firstValueFrom(this.httpService.get(this.BRAZILIAN_PROVIDER_URL)),
        firstValueFrom(this.httpService.get(this.EUROPEAN_PROVIDER_URL)),
      ]);

      const brazilianProducts = brazilianResponse.data.map(this.mapBrazilianProduct);
      const europeanProducts = europeanResponse.data.map(this.mapEuropeanProduct);

      this.logger.log(`Found ${brazilianProducts.length} brazilian and ${europeanProducts.length} european products.`);

      return [...brazilianProducts, ...europeanProducts];
    } catch (error) {
      this.logger.error('Failed to fetch products', error.stack);
      return [];
    }
  }
}