import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // FIND ALL USERS
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: true },
      select: ['id', 'email', 'username', 'firstName', 'lastName', 'createdAt'],
    });
  }

  // FIND BY ID
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  //  FIND BY EMAIL / USERNAME
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email, isActive: true } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username, isActive: true } });
  }

  // CREATE USER
  async create(userData: CreateUserDto): Promise<User> {
    const existingEmail = await this.findByEmail(userData.email);
    if (existingEmail) throw new ConflictException('Email already exists');

    const existingUsername = await this.findByUsername(userData.username);
    if (existingUsername) throw new ConflictException('Username already exists');

    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  // UPDATE USER
  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  //  DEACTIVATE USER
  async deactivate(id: string): Promise<User> {
    const user = await this.findById(id);
    user.isActive = false;
    return this.userRepository.save(user);
  }

  //  VALIDATE USER LOGIN
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }
}
