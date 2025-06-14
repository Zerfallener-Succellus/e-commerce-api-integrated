import { Controller, Get, Query } from '@nestjs/common'; 
import { ProductsService } from './products.service';
import { Product } from './intefaces/products.interface';
import { FilterProductDto } from './DTO/filter-product.dto'; 

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() filters: FilterProductDto): Promise<Product[]> {
    return this.productsService.findAll(filters);
  }
}