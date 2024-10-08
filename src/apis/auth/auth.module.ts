import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from '../token/token.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    TokenModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
