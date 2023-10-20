import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [MediasController],
  providers: [MediasService],
})
export class MediasModule {}
