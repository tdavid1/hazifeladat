import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";

@Module({
  controllers: [BookController],
  providers: [BookService,{
    provide: APP_PIPE,
    useValue: new ValidationPipe({whitelist: true, forbidNonWhitelisted: true})
  },
  ],
})
export class BookModule {}
