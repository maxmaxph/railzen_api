import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @IsOptional()
  role_id?: number; // Ajoutez cette ligne pour inclure role_id
}
