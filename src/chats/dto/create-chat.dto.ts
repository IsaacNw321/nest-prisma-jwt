import { IsString,IsArray, IsUUID, IsNotEmpty, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  userIds: string[]; 
}
