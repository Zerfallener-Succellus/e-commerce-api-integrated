import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateOrderDto } from './DTO/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const total = createOrderDto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);


  

    const order = await this.prisma.order.create({
      data: {
        total: total,
        items: {
          create: createOrderDto.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true, 
      },
    });
    

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: true, 
      },
    });
  }

}