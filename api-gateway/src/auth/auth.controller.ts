import { Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { Controller, Inject, Post, UseGuards, Body, Get } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  LoginRequest,
} from './auth.pb';
import { HasRoles } from './roles.decorator';
import { Role } from './role.enum';
import { AuthGuard } from './auth.guard';
import { Req } from '@nestjs/common/decorators';
import { Request } from 'express';

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

  @HasRoles(Role.Admin)
  @UseGuards(AuthGuard)
  @Get('test')
  test(@Req() req: Request): string {
    console.log(req.body);
    return 'masuk';
  }
}
