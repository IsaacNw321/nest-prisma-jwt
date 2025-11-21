import { IsString, IsEmail, IsInt, Min, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique username for the user' })
  @IsString()
  userName: string;

  @ApiProperty({ description: 'Unique email address', format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password (will be hashed by the service layer)' })
  @IsString()
  password: string;


}