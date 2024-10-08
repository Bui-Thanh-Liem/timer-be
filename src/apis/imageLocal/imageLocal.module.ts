import { Module } from "@nestjs/common";
import { ImageLocalController } from "./imageLocal.controller";
import { ImageLocalService } from "./imageLocal.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageLocalSchema } from "src/schemas/imageLocal.schema";
import { JwtModule } from "@nestjs/jwt";
import { TokenModule } from "../token/token.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'ImageLocal', schema: ImageLocalSchema }]),
        JwtModule,
        TokenModule,
    ],
    controllers: [ImageLocalController],
    providers: [ImageLocalService]
})
export class ImageLocalModule {}
