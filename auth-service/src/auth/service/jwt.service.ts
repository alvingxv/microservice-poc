import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  constructor(private readonly jwt: Jwt) {}

  public async validateUser(decoded: any): Promise<User> {
    return this.repository.findOne(decoded.id);
  }

  //decode jwt
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token);
  }

  //generate jwt
  public generateToken(user: User): string {
    return this.jwt.sign({ id: user.id, email: user.email });
  }

  //generate hashed password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  public isValidPassword(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  public verify(token: string): Promise<any> {
    try {
      return this.jwt.verify(token);
    } catch (err) {}
  }
}
