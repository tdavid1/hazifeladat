import * as request from 'supertest';
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from '@nestjs/common';
import { BookModule } from "./book.module";

describe('Books', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BookModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  //Konyvek Lekérdezésének tesztelése
  it('/books (GET) konyvek lekerdezese', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect([]);
  });
  //Kony keszitésének tesztelése
  it('/books (POST) konyv sikeres keszitése', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999})
      .expect(201)
      .expect((response)=>{
        expect(response.body).toEqual({id: expect.any(String),cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999})
      });
  });
  it('/books (POST) amikor semmit kuldunk', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({})
      .expect(400);
  });
  it('/books (POST) amikor egyel több adatott küldünk', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999, extra: 1111})
      .expect(400);
  });
  it('/books (POST) egy adat hibás', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({cím: 'testcim',szerzo:'testszerzo',kiadaseve: 1999})
      .expect(400);
  });
  //1 Köny lekérdezése
  it('/books/id (GET) hibas id', () => {
    return request(app.getHttpServer())
      .get('/books/42')
      .expect(404);
  });
  it('/todos/id (GET) mikor jó', async () => {
    const req = await request(app.getHttpServer())
      .post('/books')
      .send({cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999});
    const book = req.body as Book;
    return request(app.getHttpServer())
      .get(`/books/${book.id}`)
      .expect(200)
      .expect((response)=>{
        expect(response.body).toEqual({id:book.id,cim:book.cim,szerzo:book.szerzo,kiadaseve: book.kiadaseve})
      });
  });
  //Könyv modositása
  it('/books/id (PUT) mikor jó', async () => {
    const req = await request(app.getHttpServer())
      .post('/books')
      .send({cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999});
    const book = req.body as Book;
    return request(app.getHttpServer())
      .post(`/books/${book.id}`)
      .send({cim: 'testcim2',szerzo:'testszerzo',kiadaseve: 2000})
      .expect(200)
      .expect((response)=>{
        expect(response.body).toEqual({id:book.id,cim: 'testcim2',szerzo:book.szerzo,kiadaseve: 2000})
      });
  });
  it('/books/id (PUT) extra', async () => {
    const req = await request(app.getHttpServer())
      .post('/books')
      .send({cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999});
    const book = req.body as Book;
    return request(app.getHttpServer())
      .post(`/books/${book.id}`)
      .send({cim: 'testcim2',szerzo:'testszerzo',kiadaseve: 2000,extra:232})
      .expect(400)
  });
  it('/books/id (PUT) hiányzó', async () => {
    const req = await request(app.getHttpServer())
      .post('/books')
      .send({cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999});
    const book = req.body as Book;
    return request(app.getHttpServer())
      .post(`/books/${book.id}`)
      .send({cim: 'testcim2',szerzo:'testszerzo'})
      .expect(400)
  });
  it('/books/id (PUT) üres', async () => {
    const req = await request(app.getHttpServer())
      .post('/books')
      .send({cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999});
    const book = req.body as Book;
    return request(app.getHttpServer())
      .post(`/books/${book.id}`)
      .send({})
      .expect(400)
  });
  it('/books/id (PUT) rossz névet elüldőt', async () => {
    const req = await request(app.getHttpServer())
      .post('/books')
      .send({cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999});
    const book = req.body as Book;
    return request(app.getHttpServer())
      .post(`/books/${book.id}`)
      .send({cim2: 'testcim2',szerzo:'testszerzo',kiadaseve: 2000})
      .expect(400)
  });
  it('/books/id (PUT) 404', () => {
    return request(app.getHttpServer())
      .post(`/books/42`)
      .send({cim: 'testcim2',szerzo:'testszerzo',kiadaseve: 2000})
      .expect(404)
  });
  //Torles tesztelése
  it('/books/id (DELETE) delete', async () => {
    const req = await request(app.getHttpServer())
      .post('/books')
      .send({cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999});
    const book = req.body as Book;
    return request(app.getHttpServer())
      .delete(`/books/${book.id}`)
      .expect(200)
  });
  it('/books/delete (DELETE) 404', async () => {
    const req = await request(app.getHttpServer())
      .post('/books')
      .send({cim: 'testcim',szerzo:'testszerzo',kiadaseve: 1999});
    const book = req.body as Book;
    return request(app.getHttpServer())
      .post(`/books/${book.id}`)
      .expect(404)
  });
  it('/books/delete (DELETE) wrond id', async () => {
    return request(app.getHttpServer())
      .post(`/books/42`)
      .expect(404)
  });
});