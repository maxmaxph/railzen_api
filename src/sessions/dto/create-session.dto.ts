import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  Matches,
  IsNumber,
} from 'class-validator';
import { Media } from 'src/medias/entities/media.entity';

export class CreateSessionDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'La durée est requise.' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'La durée doit être au format HH:MM:SS.',
  })
  duration: string;

  @ApiProperty()
  @IsNotEmpty()
  media_id: Media;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
