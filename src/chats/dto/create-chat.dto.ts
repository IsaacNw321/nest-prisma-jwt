import { IsArray, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ 
    description: 'An array of user IDs (UUIDs) who will participate in this chat.',
    type: [String], 
    minItems: 2
  })
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each user ID must be a valid UUID v4' })
  @IsNotEmpty({ each: true })
  userIds: string[];
}
