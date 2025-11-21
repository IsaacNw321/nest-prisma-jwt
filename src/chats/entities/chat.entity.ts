import {User} from "../../user/entities/user.entitie"
import { Message } from 'src/messages/entities/message.entity';

export class Chat {
  id: string;
  users?: User[];
  messages?: Message[];

  constructor(partial: Partial<Chat>) {
    Object.assign(this, partial);
  }
}
