const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectMail = async (mailbox) => {
  let select = 'SELECT * FROM mail';
  if (mailbox) {
    select += ` WHERE mailbox = $1`;
  }
  const query = {
    text: select,
    values: mailbox ? [`${mailbox}`] : [],
  };
  const {rows} = await pool.query(query);
  const inbox = [];
  const sent = [];
  const trash = [];
  const mailboxes = [];
  if (mailbox == undefined) {
    for (const row of rows) {
      const allinfo = {'id': row.id, 'to': row.mail.to,
        'from': row.mail.from, 'sent': row.mail.sent,
        'subject': row.mail.subject, 'received': row.mail.received};
      if (row.mailbox == 'inbox') {
        inbox.push(allinfo);
      } else if (row.mailbox == 'sent') {
        sent.push(allinfo);
      } else {
        trash.push(allinfo);
      }
    }
    return [{'name': 'inbox', 'mail': inbox},
      {'name': 'sent', 'mail': sent}, {'name': 'trash', 'mail': trash}];
  } else {
    for (const row of rows) {
      const allinfo = {'id': row.id, 'to': row.mail.to,
        'from': row.mail.from, 'sent': row.mail.sent,
        'subject': row.mail.subject, 'received': row.mail.received};
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
  const allinfo = {'id': id, 'to': rows[0].mail.to, 'from': rows[0].mail.from,
    'sent': rows[0].mail.sent, 'content': rows[0].mail.content,
    'subject': rows[0].mail.subject, 'received': rows[0].mail.received};
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
