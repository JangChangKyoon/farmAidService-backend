import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<string | undefined> {
    try {
      const exist = this.users.findOne({ where: { email } });
      if (exist) {
        return 'email exist';
      }
      await this.users.save(this.users.create({ email, password, role }));
    } catch (e) {
      return "couldn't create Account";
    }

    
  }
}
