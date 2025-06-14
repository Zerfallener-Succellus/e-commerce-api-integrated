import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ApiProviderService } from '../shared/provider/api-provider.service';
import { Product } from './intefaces/products.interface';
import { FilterProductDto, ProductOrigin } from './DTO/filter-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let apiProviderService: ApiProviderService;

  const mockProducts: Product[] = [
    {
      id: 'br-1',
      name: 'Produto Brasileiro',
      description: 'Descrição do produto brasileiro',
      price: 100,
      imageUrl: 'http://exemplo.com/imagem1.jpg',
      origin: 'Brasil',
    },
    {
      id: 'eu-1',
      name: 'Produto Europeu',
      description: 'Descrição do produto europeu',
      price: 200,
      imageUrl: 'http://exemplo.com/imagem2.jpg',
      origin: 'Europa',
    },
  ];

  const mockApiProviderService = {
    fetchAllProducts: jest.fn().mockResolvedValue(mockProducts),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ApiProviderService,
          useValue: mockApiProviderService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    apiProviderService = module.get<ApiProviderService>(ApiProviderService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar todos os produtos quando nenhum filtro é fornecido', async () => {
      const filters: FilterProductDto = {};
      const result = await service.findAll(filters);

      expect(result).toEqual(mockProducts);
      expect(apiProviderService.fetchAllProducts).toHaveBeenCalled();
    });

    it('deve filtrar produtos por termo de busca', async () => {
      const filters: FilterProductDto = { search: 'brasileiro' };
      const result = await service.findAll(filters);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Produto Brasileiro');
    });

    it('deve filtrar produtos por origem', async () => {
      const filters: FilterProductDto = { origin: ProductOrigin.Brasil };
      const result = await service.findAll(filters);

      expect(result).toHaveLength(1);
      expect(result[0].origin).toBe('Brasil');
    });

    it('deve filtrar produtos por preço minimo', async () => {
      const filters: FilterProductDto = { minPrice: 150 };
      const result = await service.findAll(filters);

      expect(result).toHaveLength(1);
      expect(result[0].price).toBeGreaterThanOrEqual(150);
    });

    it('deve filtrar produtos por preço máximo', async () => {
      const filters: FilterProductDto = { maxPrice: 150 };
      const result = await service.findAll(filters);

      expect(result).toHaveLength(1);
      expect(result[0].price).toBeLessThanOrEqual(150);
    });

    it('deve combinar varios filtros', async () => {
      const filters: FilterProductDto = {
        origin: ProductOrigin.Brasil,
        minPrice: 50,
        maxPrice: 150,
      };
      const result = await service.findAll(filters);

      expect(result).toHaveLength(1);
      expect(result[0].origin).toBe('Brasil');
      expect(result[0].price).toBeGreaterThanOrEqual(50);
      expect(result[0].price).toBeLessThanOrEqual(150);
    });

    it('deve retornar array vazio quando nenhum produto corresponde aos filtros', async () => {
      const filters: FilterProductDto = { search: 'inexistente' };
      const result = await service.findAll(filters);

      expect(result).toHaveLength(0);
    });
  });
}); 