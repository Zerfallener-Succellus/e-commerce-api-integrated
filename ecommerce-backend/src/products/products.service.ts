// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { ApiProviderService } from '../shared/provider/api-provider.service';
import { Product } from './intefaces/products.interface';
import { FilterProductDto } from './DTO/filter-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly apiProviderService: ApiProviderService) {}

  async findAll(filters: FilterProductDto): Promise<Product[]> {
    let products = await this.apiProviderService.fetchAllProducts();

    const { search, origin, minPrice, maxPrice } = filters;

    if (search) {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (origin) {
      products = products.filter((product) => product.origin === origin);
    }

    if (minPrice) {
      products = products.filter((product) => product.price >= minPrice);
    }

    if (maxPrice) {
      products = products.filter((product) => product.price <= maxPrice);
    }

    return products;
  }
}
