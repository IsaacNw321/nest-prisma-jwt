import { User } from 'src/user/entities/user.entitie';
import { Chat } from 'src/chats/entities/chat.entity';

export class Message {
  id: string;
  body: string;
  fromId: string;
  chatId: string;
  createdAt: Date;
  from?: User;
  chat?: Chat;

  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }
}
