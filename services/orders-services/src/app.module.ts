import { ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),TypeOrmModule.forRootAsync({
    inject:[ConfigService],
    useFactory: (config:ConfigService) =>({
      type: 'postgres',
      host: config.getOrThrow<string>('DB_HOST'),
      port: Number(config.getOrThrow<string>('DB_PORT')),
      username: config.getOrThrow<string>('DB_USERNAME'),
      password: config.getOrThrow<string>('DB_PASSWORD'),
      database: config.getOrThrow<string>('DB_NAME'),
      autoLoadEntities:true,
      synchronize:false
    })}),OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
