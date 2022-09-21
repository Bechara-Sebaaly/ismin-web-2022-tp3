import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bookshelf, BookDto, ApiBook, Books } from './dto';
import { readFile } from 'fs/promises';
import { HttpService } from '@nestjs/axios/dist';
import { map, tap } from 'rxjs';

@Injectable()
export class BookService implements OnModuleInit {
  bookshelf: Bookshelf;

  async onModuleInit() {
    await this.readBooksFromDataset();

    this.readBooksFromAPI();
  }

  constructor(private readonly httpService: HttpService) {
    this.bookshelf = new Bookshelf();
  }

  findAll(): Books[] {
    return this.sortBookshelf(this.bookshelf.books);
  }

  findByAuthor(author: string): Books[] {
    let b = this.bookshelf.books.filter(
      (element) => element.authors === author,
    );
    this.sortBookshelf(b);
    return b;

    //return this.sortBookshelf(this.bookshelf.books.filter((element) => element.author === author));
  }

  findByTitle(title: string): Books {
    const book = this.bookshelf.books.find(
      (element) => element.title === title,
    );
    if (!book) throw new Error('Book not found!');
    return book;
  }

  searchByTitle(title: string) {
    const book = this.bookshelf.books.filter((element) =>
      element.title.includes(title),
    );
    if (!book) throw new Error('Book not found!');
    if (book.length === 1) return book[0];
    else return book;
  }

  searchByAuthor(author: string) {
    let b = this.bookshelf.books.filter((element) =>
      element.authors.includes(author),
    );
    this.sortBookshelf(b);
    return b;
  }

  create(book: Books): Books {
    if (!this.bookshelf.books.find((element) => element === book)) {
      this.bookshelf.books.push(book);
      return book;
    }

    throw new Error('Book Already Exists!');
  }

  remove(title: string) {
    let i: number = -1;
    this.bookshelf.books.forEach((element, index) => {
      if (element.title === title) i = index;
    });

    if (i !== -1) this.bookshelf.books.splice(i, 1);
  }

  sortBookshelf(books: Books[]): Books[] {
    return this.bookshelf.books.sort((fo: Books, so: Books) =>
      fo.title.localeCompare(so.title),
    );
  }

  private readBooksFromAPI() {
    this.httpService
      .get<ApiBook[]>('https://api.npoint.io/1c88134cf081609075b7')
      .pipe(
        map((resp) => resp.data),
        tap((element) => {
          element.forEach((element) => {
            this.bookshelf.books.push({
              title: element.title,
              authors: element.authors,
              date: element.publication_date,
            });
          });
          console.log(this.bookshelf.books);
        }),
      )
      .subscribe();
  }

  private async readBooksFromDataset() {
    try {
      const data = await readFile('./src/datasets/dataset.json');
      this.bookshelf.books = JSON.parse(data.toString());
    } catch (err) {
      throw err;
    }
  }
}
