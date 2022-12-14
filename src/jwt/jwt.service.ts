import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOption } from './jwt.interface';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from './jwt.contants';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOption,
  ) {
    console.log('In JwtService : ' + options);
  }

  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey);
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
