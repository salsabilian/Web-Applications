const db = require('./db');

const uuid =
/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

exports.getAll = async (req, res) => {
  const mail = await db.selectMail(req.query.mailbox);
  res.status(200).json(mail);
};

exports.getById = async (req, res) => {
  if (req.params.id.match(uuid)) {
    const mail = await db.selectid(req.params.id);
    if (mail) {
      res.status(200).json(mail);
    } else {
      res.status(404).send();
    }
  } else {
    res.status(404).send();
  }
};

exports.post = async (req, res) => {
  await db.insert(req.body);
  res.status(201).send(req.body);
};

exports.put = async (req, res) =>{
  if (req.params.id.match(uuid)) {
    const ret = await db.move(req.query.mailbox, req.params.id);
    if (ret == -1) {
      res.status(404).send();
    } else if (ret == -2) {
      res.status(409).send();
    } else {
      res.status(204).send();
    }
  } else {
    res.status(404).send();
  }
};

