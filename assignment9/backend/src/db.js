const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectUnread = async (mailbox) => {
   if(mailbox == 'starred'){
     let select = 'SELECT * FROM mail WHERE starred = 1';
      const query ={
        text: select,
     };
     const {rows} = await pool.query(query);
     return [{'unread': rows.length}];
   }else{
    let select = 'SELECT * FROM mail WHERE mailbox = $1 AND read = 0';
    const query ={
        text: select,
        values: [mailbox],
    };
    const {rows} = await pool.query(query);
    return [{'unread': rows.length}];
   }
};

exports.selectMail = async (mailbox) => {
  const mailboxes = [];
  if (mailbox == undefined) {
    let select = 'SELECT * FROM mail WHERE starred = $1';
    const query ={
        text: select,
        values: [1],
    };
    const {rows} = await pool.query(query);
    for(const row of rows){
      const allinfo = {'id': row.id, 'to': row.mail.to,
      'from': row.mail.from, 'read': row.read, 'sent': row.mail.sent, 'avatar': row.mail.avatar,
      'subject': row.mail.subject, 'received': row.mail.received, 'content': row.mail.content, 'starred': row.starred};
       mailboxes.push(allinfo);
    }
    return [{'name': 'starred', 'mail': mailboxes}];
  } else {
    let select = 'SELECT * FROM mail WHERE mailbox = $1';
    const query = {
      text: select,
      values: [mailbox],
    };
    const {rows} = await pool.query(query);
    for (const row of rows) {
      const allinfo = {'id': row.id, 'to': row.mail.to,
      'from': row.mail.from, 'read': row.read, 'sent': row.mail.sent, 'avatar': row.mail.avatar,
      'subject': row.mail.subject, 'received': row.mail.received, 'content': row.mail.content, 'starred': row.starred};
      mailboxes.push(allinfo);
    }
    return [{'name': mailbox, 'mail': mailboxes}];
  }
};

exports.selectid = async (id) => {
  const select = 'SELECT mail FROM Mail WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  const data = [];
  data.push(id);
  if (rows.length != 1) {
    return undefined;
  }
  data.push(rows[0].mail);
  const allinfo = {'id': rows[0].id, 'to': rows[0].mail.to,
        'from': rows[0].mail.from, 'read': rows[0].mail.read, 'sent': rows[0].mail.sent, 'avatar': rows[0].mail.avatar,
        'subject': rows[0].mail.subject, 'received': rows[0].mail.received, 'content': rows[0].mail.content, 'starred': rows[0].mail.starred};
  return allinfo;
};

exports.insert = async (mail) => {
  mail.from= {name: 'CSE183 Student', email: 'cse183student@ucsc.edu'};
  const insert = 'INSERT INTO mail(mailbox, mail) VALUES ($1, $2) RETURNING id';
  const query = {
    text: insert,
    values: ['sent', mail],
  };
  const x = await pool.query(query);
  mail.id = x.rows[0].id;
};

exports.move = async (mailbox, id) => {
  let sent = 0;
  const select = 'SELECT * FROM Mail WHERE id = $1';
  let query = {
    text: select,
    values: [id],
  };
  const x = await pool.query(query);
  if (x.rows.length != 1) {
    return -1;
  }
  if (x.rows[0].mailbox == 'sent') {
    sent = 1;
  }
  if (!sent && mailbox=='sent') {
    return -2;
  }
  const update = 'UPDATE Mail SET mailbox = $2 WHERE id = $1';
  query = {
    text: update,
    values: [id, mailbox],
  };
  await pool.query(query);
};

exports.change = async (id, info ,value) => { 
  if(info == 'read'){
    const update = 'UPDATE Mail SET read = $2 WHERE id = $1';
    query = {
      text: update,
      values: [id, value],
    }
  }else{
    const update = 'UPDATE Mail SET starred = $2 WHERE id = $1';
    query = {
      text: update,
      values: [id, value],
    }
  }
  await pool.query(query);
};
