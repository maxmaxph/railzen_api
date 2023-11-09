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
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guards/role/role.guard';
@ApiTags('sessions')
@Controller('sessions')
@UseGuards(AuthGuard('jwt'))
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(new RoleGuard('admin'))
  @Post()
  async create(@Body() createSessionDto: CreateSessionDto, @Req() req: any) {
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

  @Get('/category/:categoryId')
  getSessionsByCategory(@Param('categoryId') categoryId: number) {
    return this.sessionsService.findSessionsByCategory(categoryId);
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
