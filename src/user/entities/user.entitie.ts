import { Exclude } from 'class-transformer';
import { Chat } from '../../chats/entities/chat.entity';
import { Message } from 'src/messages/entities/message.entity';

export enum Role {
  USER = 'USER',
  SUPERUSER = 'SUPERUSER',
}

export class User {
  id: string;
  userName: string;
  email: string;
  role: Role;
  @Exclude()
  age: number;
  password: string; 
  chats?: Chat[];
  messages?: Message[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}