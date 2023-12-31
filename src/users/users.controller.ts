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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guards/role/role.guard';
import { SelfGuard } from 'src/guards/self/self.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(new RoleGuard('admin'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(SelfGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(SelfGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(SelfGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  @Patch('change-password/:userId')
  async changeUserPassword(
    @Param('userId') userId: number,
    @Body() passwordDto: ChangePasswordDto,
  ) {
    return this.usersService.updatePassword(userId, passwordDto.newPassword);
  }
}
