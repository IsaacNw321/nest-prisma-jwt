
import { IsString, IsEmail, MinLength } from 'class-validator';
import { User } from 'src/user/entities/user.entitie';
import { Role } from 'src/user/entities/user.entitie';
export class LoginDto {
  email: string;
  password: string;
}



type CreateUserType = Omit<User,'role' | 'age' | 'id' | 'createdAt' | 'updatedAt'>; 
export class CreateUserDto implements CreateUserType {
  
  @IsEmail()
  email: string; 

  @IsString()
  @MinLength(8)
  password: string;


 @IsString()
  userName: string ;

}
type UserType = Omit<User, 'age' |'role' | 'password' | 'createdAt' | 'updatedAt' | 'email'>; 
export class UNP implements UserType {
 @IsString()
  id : string
 @IsString()
  userName: string ;
}

export class UL implements UserType {
 @IsString()
  id : string
 @IsString()
  userName: string ;
 @IsString()
   role : Role;
}