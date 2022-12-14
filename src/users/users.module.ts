import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // dependencies pass entity to service, service to resolver
  providers: [UsersResolver, UsersService], // export logic to app.module
})
export class UsersModule {}
