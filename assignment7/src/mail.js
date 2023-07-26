const inbox = require('../data/inbox.json');
const sent = require('../data/sent.json');
const trash = require('../data/trash.json');

/**
*@return{void}
**/
function uuidcreator() { // uuid creator derived from stack overflow
// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid/2117523#2117523
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 12 | 0; const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const uuid =
/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
exports.getAll = async (req, res) => {
  const temp = JSON.parse(JSON.stringify(inbox));
  for (Email of temp) {
    delete Email.content;
  }
  const temp1 = JSON.parse(JSON.stringify(sent));
  for (Email of temp1) {
    delete Email.content;
  }
  const temp2 = JSON.parse(JSON.stringify(trash));
  for (Email of temp2) {
    delete Email.content;
  }
  if (req.param('mailbox') == undefined) {
    res.status(200).json([{inbox: temp}, {sent: temp1}, {trash: temp2}]);
  } else if (req.param('mailbox') == 'inbox') {
    res.status(200).json([{inbox: temp}]);
  } else if (req.param('mailbox') == 'trash') {
    res.status(200).json([{trash: temp2}]);
  } else if (req.param('mailbox') == 'sent') {
    res.status(200).json([{sent: temp1}]);
  } else {
    res.status(404).send();
  }
};

exports.getById = async (req, res) => {
  if (req.params.id.match(uuid)) {
    const mail = inbox.find((Email) => Email.id == req.params.id) ||
    sent.find((Email) => Email.id == req.params.id) ||
    trash.find((Email) => Email.id == req.params.id);
    if (mail) {
      res.status(200).json(mail);
    } else {
      res.status(404).send();
    }
  } else {
    res.status(400).send();
  }
};

exports.post = async (req, res) => {
  const id = uuidcreator();
  req.body.id = id;
  req.body['from-email']= 'cse183-student@ucsc.edu';
  req.body['from-name'] = 'CSE183 Student';
  sent.push(req.body);
  res.status(201).send(req.body);
};
exports.put = async (req, res) => {
  const mail = inbox.find((Email) => Email.id == req.params.id) ||
    sent.find((Email) => Email.id == req.params.id) ||
    trash.find((Email) => Email.id == req.params.id);
  if (!mail) {
    res.status(404).send();
    return;
  }
  const temp = JSON.parse(JSON.stringify(mail));
  let index = inbox.findIndex((Email) => Email.id === req.params.id);
  if (index!=-1) {
    if (req.param('mailbox') == 'inbox') {
      inbox.splice(index, 1);
      inbox.push(temp);
      res.status(204).send();
      return;
    } else if (req.param('mailbox') == 'sent') {
      res.status(409).send();
      return;
    } else {
      inbox.splice(index, 1);
      trash.push(temp);
      res.status(204).send();
      return;
    }
  }
  index = sent.findIndex((Email) => Email.id === req.params.id);
  if (index!=-1) {
    sent.splice(index, 1);
    if (req.param('mailbox') == 'inbox') {
      inbox.push(temp);
      res.status(204).send();
      return;
    } else if (req.param('mailbox') == 'sent') {
      sent.push(temp);
      res.status(204).send();
      return;
    } else {
      trash.push(temp);
      res.status(204).send();
      return;
    }
  }
  index = trash.findIndex((Email) => Email.id === req.params.id);
  if (req.param('mailbox') == 'inbox') {
    trash.splice(index, 1);
    inbox.push(temp);
    res.status(204).send();
    return;
  } else if (req.param('mailbox') == 'sent') {
    res.status(409).send();
    return;
  } else {
    trash.splice(index, 1);
    trash.push(temp);
    res.status(204).send();
    return;
  }
};
