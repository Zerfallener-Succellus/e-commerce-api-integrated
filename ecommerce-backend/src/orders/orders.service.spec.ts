import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../db/prisma.service';
import { CreateOrderDto } from './DTO/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um pedido com calculo correto do total', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          {
            productId: '1',
            productName: 'Produto 1',
            quantity: 2,
            price: 100,
          },
          {
            productId: '2',
            productName: 'Produto 2',
            quantity: 1,
            price: 200,
          },
        ],
      };

      const expectedOrder = {
        id: '1',
        total: 400, 
        items: createOrderDto.items,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.order.create.mockResolvedValue(expectedOrder);

      const result = await service.create(createOrderDto);

      expect(result).toEqual(expectedOrder);
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          total: 400,
          items: {
            create: createOrderDto.items,
          },
        },
        include: {
          items: true,
        },
      });
    });

    it('deve lidar com array de itens vazio', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [],
      };

      const expectedOrder = {
        id: '1',
        total: 0,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.order.create.mockResolvedValue(expectedOrder);

      const result = await service.create(createOrderDto);

      expect(result).toEqual(expectedOrder);
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          total: 0,
          items: {
            create: [],
          },
        },
        include: {
          items: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os pedidos com seus itens', async () => {
      const expectedOrders = [
        {
          id: '1',
          total: 400,
          items: [
            {
              productId: '1',
              productName: 'Produto 1',
              quantity: 2,
              price: 100,
            },
            {
              productId: '2',
              productName: 'Produto 2',
              quantity: 1,
              price: 200,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(expectedOrders);

      const result = await service.findAll();

      expect(result).toEqual(expectedOrders);
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        include: {
          items: true,
        },
      });
    });

    it('deve retornar array vazio quando nao existem pedidos', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        include: {
          items: true,
        },
      });
    });
  });
}); 