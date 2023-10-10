import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  description: string;
}
