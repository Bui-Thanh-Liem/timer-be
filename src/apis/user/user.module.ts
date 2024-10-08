import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Register the schema
    JwtModule,
    TokenModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
