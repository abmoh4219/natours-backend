import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;
    
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
    
    @IsOptional()
    @IsString()
    firstName?: string;
    
    @IsOptional()
    @IsString()
    lastName?: string;
}