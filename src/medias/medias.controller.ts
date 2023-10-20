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

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('monFichier'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any, // <-- Injecter l'objet request ici
  ) {
    console.log(file);
    console.log(req.user);
    const userId = req.user.user_id;
    return this.mediasService.create(file, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMedia(@Res({ passthrough: true }) res): Promise<StreamableFile> {
    return this.mediasService.getMedia(res);
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
