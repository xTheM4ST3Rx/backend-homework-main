import serverlessExpress from '@codegenie/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

let cachedServer;
export const handler = async (event, context) => {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);

    nestApp.enableCors({});

    const config = new DocumentBuilder()
      .setTitle('TAYA')
      .setDescription('API Service')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(nestApp, config);

    nestApp.use(
      '/scalar',
      apiReference({
        spec: {
          content: document,
        },
      }),
    );

    SwaggerModule.setup('api', nestApp, document);

    await nestApp.init();
    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    });
  }
  return cachedServer(event, context);
};
