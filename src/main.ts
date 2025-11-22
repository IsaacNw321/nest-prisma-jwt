import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SocketIoAdapter } from './socket-io-adapter';
import * as cookieParser from "cookie-parser"; 

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    const configService = app.get(ConfigService);
    const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'; 
    const port = configService.get<number>('PORT') ?? 3000;
    app.enableCors({
        origin: frontendUrl,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
    });
    app.useWebSocketAdapter(new SocketIoAdapter(app, frontendUrl));
    await app.listen(port);
    console.log(`Server (HTTP & WS) running on: ${await app.getUrl()}`);
}

bootstrap();