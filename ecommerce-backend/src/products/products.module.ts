
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ApiProviderModule } from '../shared/provider/provider.module';

@Module({
  imports: [ApiProviderModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}