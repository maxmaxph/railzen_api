import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
@ApiTags('favorites')
@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':userId/:sessionId')
  async addToFavorites(
    @Param('userId') userId: number,
    @Param('sessionId') sessionId: number,
  ) {
    return this.favoritesService.addToFavorites(userId, sessionId);
  }

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Get('user/:userId')
  async findFavoritesByUserId(@Param('userId') userId: number) {
    return this.favoritesService.findFavoritesByUserId(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return this.favoritesService.update(+id, updateFavoriteDto);
  }

  @Delete('user/:userId/session/:sessionId')
  async removeFavoriteByUserIdAndSessionId(
    @Param('userId') userId: number,
    @Param('sessionId') sessionId: number,
    @Res() res: Response,
  ) {
    try {
      await this.favoritesService.removeFavoriteByUserIdAndSessionId(
        userId,
        sessionId,
      );
      res
        .status(HttpStatus.OK)
        .json({ message: 'Favorite removed successfully' });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }
}
