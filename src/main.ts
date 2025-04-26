import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export default async function createNestServer() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  //DOCS - SWAGGER
  const config = new DocumentBuilder()
    .setTitle('TAYA')
    .setDescription('API Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  //DOCS - SCALAR
  app.use(
    '/scalar',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  SwaggerModule.setup('api', app, document);

  await app.init();
  return app.getHttpAdapter().getInstance();
}

if (require.main === module) {
  (async () => {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: '*' });

    //DOCS - SWAGGER
    const config = new DocumentBuilder()
      .setTitle('TAYA')
      .setDescription(
        'API Taya<br><br>Legenda:<br>🌐 - Público<br>🔑 - Requer autenticação (user_id)<br>🔐 - Requer nível administrador',
      )
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    //DOCS - SCALAR
    app.use(
      '/scalar',
      apiReference({
        spec: {
          content: document,
        },
      }),
    );

    SwaggerModule.setup('api', app, document);

    await app.listen(3005, () => {
      console.log('-----------------------');
      console.log('🎉 - Servidor Online !');
      console.log('\x1b[34m%s\x1b[0m', '🔗 - http://localhost:3005');
      console.log('\x1b[33m%s\x1b[0m', '📃 - http://localhost:3005/api');
      console.log('\x1b[33m%s\x1b[0m', '📃 - http://localhost:3005/scalar');
      console.log('-----------------------');
    });
  })();
}
