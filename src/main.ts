import helmet from 'helmet';
import { json, urlencoded } from 'express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

//
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './middlewares/errors.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //
  app.setGlobalPrefix('/api/v1');

  // Process cookies
  app.use(cookieParser());

  //
  app.enableCors({
    origin: process.env.CLIENT_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // access send request credentials(token, cookie, session)
  });

  // Compression response -> client
  app.use(compression());

  // Protect technologies
  app.use(helmet());

  // Convert json to javascript and check limit
  app.use(json({ limit: '10mb' }));

  // Check HTTP , extended : true => complicated
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Using validation global @IsString(), @IsInt(), @IsNotEmpty(), v.v., from class-validator.
  app.useGlobalPipes(new ValidationPipe());

  //
  app.useGlobalFilters(new HttpExceptionFilter());

  //
  // app.use('/public', express.static(join(__dirname, '..', 'public')));
  app.useStaticAssets(join(__dirname, '..', 'public'));

  //
  const configSwagger = new DocumentBuilder()
    .setTitle('Feed back to doctor Tuan Anh')
    .setVersion('1.0')
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/api', app, documentSwagger);

  await app.listen(process.env.SERVER_PORT || 9001);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
