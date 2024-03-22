import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BookInput, BookService } from "./book.service";

@Controller('books')
export class BookController {
  @Get()
  getBooks(){
    return this.bookService.getBooks();
  }
  @Get('/:id')
  getBook(@Param('id')bookid:string){
    return this.bookService.getBook(bookid)
  }
  @Post()
  createBook(@Body()bookpart: BookInput){
    return this.bookService.createBook(bookpart);
  }
  @Put('/:id')
  updateBook(@Param('id')index:string,@Body() bookparts: BookInput){
    return this.bookService.updateBook(index,bookparts);
  }
  @Delete('/:id')
  deleteBook(@Param('id')index:string){
    this.bookService.deleteBook(index);
  }
  constructor(private readonly bookService: BookService) {}
}