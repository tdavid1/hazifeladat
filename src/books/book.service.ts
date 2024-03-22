import { Injectable, NotFoundException } from "@nestjs/common";
import { IsNumber, IsString } from "class-validator";
export class BookInput{
  @IsString()
  cim!: string;

  @IsString()
  szerzo!: string;

  @IsNumber()
  kiadaseve!: number;
}
@Injectable()
export class BookService{
  private readonly books : Book[] = [];

  getBooks():Book[]{
    return this.books;
  }
  getBook(bookid: string):Book{
    for(let book of this.books){
      if(book.id===bookid){
        return book;
      }
    }
    throw new NotFoundException();
  }
  createBook(partsbook: BookInput){
    let index: Book ={id: Math.random().toString(),...partsbook}
    this.books.push(index);
    return index;
  }
  updateBook(index: string, bookparts: BookInput){
    for(let book of this.books){
      if(book.id === index){
        book.cim=bookparts.cim;
        book.szerzo=bookparts.szerzo;
        book.kiadaseve=bookparts.kiadaseve;
        return book;
      }
    }
    throw new NotFoundException();
  }
  deleteBook(index: string){
    this.books.forEach((book, counter)=>{
      if(book.id===index){
        this.books.splice(counter,1);
      }
    });
  }
}