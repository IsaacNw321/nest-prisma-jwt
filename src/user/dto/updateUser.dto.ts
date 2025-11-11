import { PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsInt, Min, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CreateUserDto } from './createUser.dto';
import { Role } from 'generated/prisma';


export class UpdateUserDto extends PartialType(CreateUserDto) {}