import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './apis/auth/auth.module';
import { CategoryModule } from './apis/category/category.module';
import { SubCategoryModule } from './apis/subCategory/subCategory.module';
import { FeedbackModule } from './apis/feedbackImage/feedback.module';
import { UserModule } from './apis/user/user.module';
import { MongoDbConfigs } from './configs';

@Module({
  imports: [
    // Load
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod',
      isGlobal: true,
      load: [MongoDbConfigs],
    }),

    // Process
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>(`${CONST_CONNECT_DATABASE}.uri`),
    //   }),
    //   inject: [ConfigService],
    // }),
    MongooseModule.forRoot(`${process.env.MONGODB_URI}`),

    UserModule,

    AuthModule,

    CategoryModule,

    SubCategoryModule,

    FeedbackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
