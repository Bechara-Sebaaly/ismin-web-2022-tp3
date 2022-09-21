import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiBook } from './api-book.interface';

export class BookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  authors: string;

  @IsString()
  @IsNotEmpty()
  publication_date: string;

  constructor(book: ApiBook) {
    this.title = book.title;
    this.authors = book.authors;
    this.publication_date = book.publication_date;
  }
}
