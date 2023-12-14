import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guards/role/role.guard';
@ApiTags('roles')
@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @UseGuards(new RoleGuard('admin'))
  // @Post()
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.rolesService.create(createRoleDto);
  // }
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }
  // @UseGuards(new RoleGuard('admin'))
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.update(+id, updateRoleDto);
  // }
  // @UseGuards(new RoleGuard('admin'))
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }
}
