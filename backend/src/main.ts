import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {

    const app = await NestFactory.create(AppModule);
    
    // Validation
    app.useGlobalPipes(new ValidationPipe());

    // Logger
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`Received Request: [${new Date().toISOString()}] ${req.method} ${req.url} from IP: ${req.ip}`);
        next(); 
    });

    // CORS
    app.enableCors({
        origin: ['https://operand-test-9abb0.web.app', 'https://operand-test-9abb0.firebaseapp.com'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });

    // Swagger
    const config = new DocumentBuilder()
    .setTitle('Tasks Api')
    .setDescription('Api to Authenticate and manage tasks on firebase')
    .setVersion('1.0')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Start the app
    await app.listen(parseInt(process.env.PORT) || 3000);
}

bootstrap();