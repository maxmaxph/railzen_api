import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  Req,
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Media } from './entities/media.entity';
import { RoleGuard } from 'src/guards/role/role.guard';
@Controller('medias')
@UseGuards(AuthGuard('jwt'))
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post()
  @UseGuards(new RoleGuard('admin'))
  @UseInterceptors(FileInterceptor('monFichier'))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const userId = req.user.user_id;
    return this.mediasService.create(file, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllMedia(): Promise<Media[]> {
    return this.mediasService.getAllMedia();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getMediaById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    return this.mediasService.getMediaById(+id, res);
  }
}
