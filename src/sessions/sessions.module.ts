import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { Session } from './entities/session.entity';
import { Category } from 'src/categories/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Category]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
