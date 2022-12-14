import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.contants';
import { JwtModuleOption } from './jwt.interface';
import { JwtService } from './jwt.service';

// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from 'src/users/entities/user.entity';
// import { UsersModule } from 'src/users/users.module';
// import { UsersService } from 'src/users/users.service';
// import { JwtMiddleware } from './jwt.middleware';

@Module({})
@Global()
export class JwtModule {
  static forRoot(option: JwtModuleOption): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: option,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
