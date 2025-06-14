// src/shared/api-provider/api-provider.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiProviderService } from './api-provider.service';

@Module({
  imports: [HttpModule], // Importa o HttpModule para fazer requisições
  providers: [ApiProviderService],
  exports: [ApiProviderService], // Exporta o serviço para ser usado em outros módulos
})
export class ApiProviderModule {}