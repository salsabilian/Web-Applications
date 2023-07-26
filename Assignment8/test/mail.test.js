const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../src/app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

test('GET Invalid URL', async () => {
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .expect(404);
});

test('GET Invalid URL', async () => {
  await request.get('/v0/Bolsehvlik-OClock/')
    .expect(404)
});

test('GET All', async () => {
  await request.get('/v0/mail')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.length).toEqual(3);
    })
});

test('GET Sent Mailbox', async() => {
   await request.get('/v0/mail?mailbox=sent')
   .expect(200)
   .expect('Content-Type', /json/)
   .then(data => {
     expect(data).toBeDefined();
     expect(data.body).toBeDefined();
   })
});

const email = {
  to: {name:'Bob Dylan', email:'BarackObama@freedom.com'},
  subject: 'Mumble Mumble',
  content: 'McDermit Smith Wilson',
  received: '2020-10-24T07:22:47Z',
};

var id;
test('POST New', async () => {
  await request.post('/v0/mail/')
    .send(email)
    .expect(201)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.to).toBeDefined();
      expect(data.body.to).toEqual(email['to']);
      expect(data.body.subject).toEqual(email.subject);
      expect(data.body.content).toEqual(email.content);
      expect(data.body.received).toEqual(email.received);
      id = data.body.id;
    })
});

test('GET One', async () => {
  await request.get('/v0/mail/'+id)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.id).toBeDefined();
      expect(res.body.id).toEqual(id);
      expect(res.body.to).toEqual(email['to']);
      expect(res.body.subject).toEqual(email.subject);
      expect(res.body.received).toEqual(email.received);
      expect(res.body.from).toEqual({name: 'CSE183 Student', email: 'cse183student@ucsc.edu'});
    })
});

test('Invalid GET', async () => {
  await request.get('/v0/mail/123567')
    .expect(404)
});

test('Invalid GET', async () => {
  await request.get('/v0/mail/876b8e1a-d293-4642-a9e2-cbeb97a68606')
    .expect(404)
});


test('PUT from sent', async () => {
  await request.put('/v0/mail/'+id+'?mailbox=trash')
    .expect(204)
});


test('PUT from trash to sent', async () => {
  await request.put('/v0/mail/'+id+'?mailbox=sent')
    .expect(409)
});

test('PUT with invalid id', async () => {
  await request.put('/v0/mail/123456?mailbox=trash')
    .expect(404)
});

test('PUT with missing id', async () => {
  await request.put('/v0/mail/4976ea61-5323-4584-90ce-3b0dacf50613?mailbox=trash')
    .expect(404)
});