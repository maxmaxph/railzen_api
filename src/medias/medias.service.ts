import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class MediasService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {}
  create(media: Express.Multer.File, userId: number) {
    console.log('le média : ' + media.filename);
    return this.mediaRepository.save({
      name: media.filename,
      mimetype: media.mimetype,
      size: media.size,
      user: { user_id: userId },
    });
  }

  async getAllMedia(): Promise<Media[]> {
    return this.mediaRepository.find();
  }

  async getMediaById(id: number, res): Promise<StreamableFile> {
    const result = await this.mediaRepository.findOneBy({ media_id: id });
    if (!result) {
      throw new NotFoundException(`The media ${id} is not found !`);
    }
    const mediaFile = createReadStream(
      join(process.cwd(), 'uploads', result.name),
    );
    res.set('Content-Type', result.mimetype);
    console.log('mon media', mediaFile);
    return new StreamableFile(mediaFile);
  }

  findAll() {
    return `This action returns all medias`;
  }
}
