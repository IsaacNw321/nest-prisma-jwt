import { IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'The content/body of the message.' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ description: 'The ID (UUID) of the user sending the message.' })
  @IsUUID()
  fromId: string;

  @ApiProperty({ description: 'The ID (UUID) of the chat this message belongs to.' })
  @IsUUID()
  chatId: string;
}