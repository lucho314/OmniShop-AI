import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { initPhoneOverrides } from './common/utils/phone.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // ✅ inicializamos los overrides con ConfigService
  initPhoneOverrides(config);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
