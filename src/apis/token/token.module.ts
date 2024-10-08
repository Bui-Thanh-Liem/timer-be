import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from 'src/schemas/token.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]), // Register the schema
        JwtModule
      ],
    providers: [TokenService],
    exports: [TokenService]
})
export class TokenModule {}
