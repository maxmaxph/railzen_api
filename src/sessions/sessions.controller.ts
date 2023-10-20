import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
@ApiTags('sessions')
@Controller('sessions')
@UseGuards(AuthGuard('jwt'))
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(new RoleGuard('admin'))
  @Post()
  @UseInterceptors(FileInterceptor('sound_file', multerConfig))
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @UploadedFile() file,
    @Req() req: any,
  ) {
    // Enregistrement le chemin du fichier dans le DTO
    createSessionDto.sound_file = file.path; // ou file.filename selon votre configuration

    // Création de la session avec le DTO mis à jour
    return this.sessionsService.create(createSessionDto, req.user);
  }
  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(+id);
  }
  @UseGuards(new RoleGuard('admin'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(+id, updateSessionDto);
  }
  @UseGuards(new RoleGuard('admin'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(+id);
  }
}
