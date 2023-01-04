import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from './service/jwt.service';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt/dist';

@Module({
  imports: [
    JwtModule.register({
      secret: 'idk',
      signOptions: { expiresIn: '30m' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
