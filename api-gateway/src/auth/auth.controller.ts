import { Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { Controller, Inject, Post } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  LoginRequest,
} from './auth.pb';
import { Body } from '@nestjs/common/decorators';

@Controller('auth')
export class AuthController {
  private svc: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('register')
  private async register(
    @Body() body: RegisterRequest,
  ): Promise<Observable<RegisterResponse>> {
    return this.svc.register(body);
  }

  @Post('login')
  private async login(
    @Body() body: LoginRequest,
  ): Promise<Observable<LoginResponse>> {
    return this.svc.login(body);
  }
}
