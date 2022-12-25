import { Role } from './role.enum';
import { AuthService } from './auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ValidateResponse } from './auth.pb';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(AuthService)
  public readonly service: AuthService;

  constructor(private reflector: Reflector) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    const req: Request = ctx.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if (bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];
    const { status, userId, userRole }: ValidateResponse =
      await this.service.validate(token);

    if (status !== HttpStatus.OK) {
      throw new UnauthorizedException();
    }

    req.body.userId = userId;

    if (!requiredRoles.some((role) => role === userRole)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
