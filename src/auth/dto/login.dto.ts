
import { IsString, IsEmail, MinLength } from 'class-validator';
import { User } from 'generated/prisma';
export class LoginDto {
  email: string;
  password: string;
}



type CreateUserType = Omit<User, 'id' | 'createdAt' | 'updatedAt'>; 
export class CreateUserDto implements CreateUserType {
  
  @IsEmail()
  email: string; 

  @IsString()
  @MinLength(8)
  password: string;


 @IsString()
  firstName: string | null;

  @IsString()
  lastName: string | null;

}
type UserType = Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'email'>; 
export class UNP implements UserType {
 @IsString()
  id : string
 @IsString()
  firstName: string | null;

  @IsString()
  lastName: string | null;

}