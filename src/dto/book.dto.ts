import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class BookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  constructor(book: BookDto) {
    this.title = book.title;
    this.author = book.author;
    this.date = new Date(book.date);
  }
}
