import { HttpStatus } from '@nestjs/common/enums';
import {
  RegisterRequestDto,
  LoginRequestDto,
  ValidateRequstDto,
} from './../auth.dto';
import { JwtService } from './jwt.service';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../auth.pb';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  public async register({
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponse> {
    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      return { status: HttpStatus.CONFLICT, error: ['Email Already Exist'] };
    }

    user = new User();

    user.email = email;
    user.password = this.jwtService.encodePassword(password);

    try {
      await this.repository.save(user);
    } catch {}
  }

  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse> {
    const user: User = await this.repository.findOne({ where: { email } });

    const isPasswordValid: boolean = this.jwtService.isValidPassword(
      password,
      user.password,
    );

    if (!user || !isPasswordValid) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: ['invalid email/password'],
        token: null,
      };
    }

    const token: string = this.jwtService.generateToken(user);
    return { status: HttpStatus.OK, error: null, token };
  }

  public async validate({
    token,
  }: ValidateRequstDto): Promise<ValidateResponse> {
    const decoded: User = await this.jwtService.verify(token);

    if (!decoded) {
      return {
        status: HttpStatus.FORBIDDEN,
        error: ['Token Invalid'],
        userId: decoded.id,
        userRole: decoded.role,
      };
    }
  }
}
