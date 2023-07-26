const supertest = require('supertest');
const http = require('http');

const app = require('../src/app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
});

afterAll((done) => {
  server.close(done);
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

test('GET Inbox Mailbox', async() => {
   await request.get('/v0/mail?mailbox=inbox')
   .expect(200)
   .expect('Content-Type', /json/)
   .then(data => {
     expect(data).toBeDefined();
     expect(data.body).toBeDefined();
   })
});

test('GET Trash Mailbox', async() => {
   await request.get('/v0/mail?mailbox=trash')
   .expect(200)
   .expect('Content-Type', /json/)
   .then(data => {
     expect(data).toBeDefined();
     expect(data.body).toBeDefined();
   })
});

test('GET Invalid Mailbox', async() => {
   await request.get('/v0/mail?mailbox=adsfad')
   .expect(404)
});

test('GET One', async () => {
  await request.get('/v0/mail/df49393d-1dc1-416c-bf71-f7cf7a1a1ec5')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      expect(data.body["to-name"]).toEqual('CSE183 Student');
      expect(data.body["to-email"]).toEqual('cse183-student@ucsc.edu');
      expect(data.body.subject).toEqual('Kiss Me (Kyss Mig)');
      expect(data.body.received).toEqual('2020-10-24T07:22:47Z');
      expect(data.body["from-name"]).toEqual('Joey Myall');
      expect(data.body["from-email"]).toEqual('jmyall1@hugedomains.com');
    })
});

test('GET Missing', async () => {
  await request.get('/v0/mail/df49393d-1dc1-393c-bf71-f7cf7a1a1ec5')
    .expect(404)
});

test('GET Invalid Id', async () => {
  await request.get('/v0/mail/4987331178-1')
    .expect(400)
});

const email = {
  ['to-email']: "BarackObama@freedom.com",
  ['to-name']: 'Bob Dylan',
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
      expect(data.body['to-email']).toBeDefined();
      expect(data.body['to-email']).toEqual(email['to-email']);
      expect(data.body['to-name']).toEqual(email['to-name']);
      expect(data.body.subject).toEqual(email.subject);
      expect(data.body.content).toEqual(email.content);
      expect(data.body.received).toEqual(email.received);
      id = data.body.id;
    })
});

test('GET After POST', async () => {
  await request.get('/v0/mail/' + id)
    .expect(200)
    .then(data => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body['to-email']).toBeDefined();
      expect(data.body['to-email']).toEqual(email['to-email']);
      expect(data.body['to-name']).toEqual(email['to-name']);
      expect(data.body.subject).toEqual(email.subject);
      expect(data.body.content).toEqual(email.content);
      expect(data.body.received).toEqual(email.received);
    })
});

test('POST Invalid Id', async () => {
  email.id = 'some-old-guff';
  await request.post('/v0/mail/')
    .send(email)
    .expect(400)
});

test('POST invalid time', async () => {
  email.received = 'Hello World';
  await request.post('/v0/mail/')
    .send(email)
    .expect(400)
});

test('POST invalid email', async () => {
  email.received = '2020-10-24T07:22:47Z';
  email['to-email'] = 'asdadsa';
  await request.post('/v0/mail/')
    .send(email)
    .expect(400)
});

const email1 = {
     id: "591b428e-1b99-4a56-b653-dab17210b3b7",
}

test('Put an Email from Inbox', async () => {
  await request.put('/v0/mail/591b428e-1b99-4a56-b653-dab17210b3b7?mailbox=inbox')
    .expect(204)
});

test('Put an Email from Sent', async () => {
  await request.put('/v0/mail/d10cbbfe-8b96-4d30-851e-f39b0eb4be0b?mailbox=sent')
    .expect(204)
});

test('Put an Email from Trash', async () => {
  await request.put('/v0/mail/eedc0231-49e2-488c-98f6-57c9588da7dc?mailbox=trash')
    .expect(204)
});

test('Put an Email from Trash', async () => {
  await request.put('/v0/mail/eedc0231-49e2-488c-98f6-57c9588da7dc?mailbox=trash')
    .expect(204)
});

test('Put an Email from Inbox to Sent', async () => {
  await request.put('/v0/mail/c794a841-643e-43db-8a50-5b700a277935?mailbox=sent')
    .expect(409)
});

test('Put an Email from Inbox to Trash', async () => {
  await request.put('/v0/mail/b50fb70c-3c56-4044-8b8d-f0170b29bd6c?mailbox=trash')
    .expect(204)
});


test('Put an Email from Sent to Inbox', async () => {
  await request.put('/v0/mail/d10cbbfe-8b96-4d30-851e-f39b0eb4be0b?mailbox=inbox')
    .expect(204)
});

test('Put an Email from Sent to Inbox', async () => {
  await request.put('/v0/mail/cf0d38b5-86ee-48f9-83d3-f54ee84fb606?mailbox=trash')
    .expect(204)
});

test('Put an Email from Trash to Inbox', async () => {
  await request.put('/v0/mail/eedc0231-49e2-488c-98f6-57c9588da7dc?mailbox=inbox')
    .expect(204)
});

test('Put an Email from Trash to Sent', async () => {
  await request.put('/v0/mail/ed5776e6-fac2-411e-9bea-e16063ab4408?mailbox=sent')
    .expect(409)
});

test('Put an Email from Trash to Sent', async () => {
  await request.put('/v0/mail/ed5776e6-fac2-411e-9bea-e16063ab4409?mailbox=sent')
    .expect(404)
});

