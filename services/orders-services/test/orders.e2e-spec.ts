import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateOrderDto } from '../src/orders/dto/create-order.dto';

describe('Orders E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /orders should create an order', async () => {
    const orderRequest: CreateOrderDto = {
      items: [
        {
          productId: 'PROD-001',
          quantity: 2,
        },
        {
          productId: 'PROD-002',
          quantity: 3,
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(orderRequest)
      .expect(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: 'PENDING',
        currency: 'PEN',
        totalCents: 7148,
      }),
    );
  });
});
