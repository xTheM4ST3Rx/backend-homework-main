import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //DOCS - SWAGGER
  const config = new DocumentBuilder()
    .setTitle('TAYA')
    .setDescription('API Service')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  const document = SwaggerModule.setup('api', app, documentFactory);

  //DOCS - SCALAR
  app.use(
    '/scalar',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  await app.listen(3005, () => {
    console.log('-----------------------');
    console.log('🎉 - Servidor Online !');
    console.log('\x1b[34m%s\x1b[0m', '🔗 - http://localhost:3005');
    console.log('\x1b[33m%s\x1b[0m', '📃 - http://localhost:3005/api');
    console.log('\x1b[33m%s\x1b[0m', '📃 - http://localhost:3005/scalar');
    console.log('-----------------------');
  });
}
bootstrap();
