import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import DeleteIcon from '@material-ui/icons/Delete';
// import MailIcon from '@material-ui/icons/Mail';
// import StarIcon from '@material-ui/icons/Star';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import SharedContext from './SharedContext';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SettingsIcon from '@material-ui/icons/Settings';

/**
* @param{string} mailbox
* @param{function} setUnread
* @param{array} unread
* @param{number} i
*/
function getUnread(mailbox, setUnread, unread, i) {
  fetch('http://localhost:3010/v0/mail/unread/'+mailbox)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        const keys = Object.keys(json[0]);
        const value = json[0][keys[0]];
        unread[i] = value.toString();
        setUnread(unread);
        return json.toString();
      })
      .catch((error) => {
        return error.toString();
      });
  return;
}

/**
* @param{string} mailbox
* @return{string}
*/
function getUnread2(mailbox) {
  const [initvalue, setInitValue] = React.useState('0');
  fetch('http://localhost:3010/v0/mail/unread/'+mailbox)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        const keys = Object.keys(json[0]);
        const value = json[0][keys[0]];
        setInitValue(value.toString());
        return json.toString();
      })
      .catch((error) => {
        return error.toString();
      });
  return initvalue;
}

/**
* @param {function}setOpen
*/
const handleClickOpen = (setOpen) => {
  setOpen(true);
};

/**
* @param {function} setOpen
* @param {string} title
* @param {array} boxes
* @param {function} setBoxes
* @param {array} unread
* @param {function} setUnread
**/
const saveValue = (setOpen, title, boxes, setBoxes, unread, setUnread) => {
  boxes.push({name: title, icon: <ArrowForwardIcon/>});
  setBoxes(boxes);
  setOpen(false);
  unread.push('0');
  setUnread(unread);
};
/**
* @param {function}setOpen
*/
const handleClose = (setOpen) => {
  setOpen(false);
};


/**
* @param{array} boxes
* @param{function} setUnread
* @param {array} unread
*/
const populate = (boxes, setUnread, unread) => {
  for (let i = 0; i<boxes.length; ++i) {
    getUnread(boxes[i].name, setUnread, unread, i);
  }
};

/**
 * @return {object} JSX
 */
function MailboxList() {
  const {mailbox, selectMailbox, boxes, setBoxes, change,
    open2, username, userAvatar, drawerOpen, openSetting, setopenSetting} =
  React.useContext(SharedContext);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [unread, setUnread] = React.useState([getUnread2('inbox'),
    getUnread2('starred'), getUnread2('sent'), getUnread2('trash')]);
  React.useEffect(() => {
    populate(boxes, setUnread, unread);
  }, [mailbox, change, open2, username, boxes, userAvatar,
    drawerOpen, openSetting]);
  return (
    <div>
      <Toolbar />
      <List style={{textAlign: 'right'}}>
        {boxes.map((box, i) => (
          <ListItem button
            key={box.name}
            disabled={mailbox == box.name}
            style ={mailbox == box.name ?
            {backgroundColor: '#fdff32'} : {backgroundColor: 'white'}}
            onClick={() => selectMailbox(box.name)}
          >
            <ListItemIcon>
              {box.icon}
            </ListItemIcon>
            <ListItemText primary={box.name}/>
            <ListItemText primary=
              {unread[i]}/>
          </ListItem>
        ))}
        <ListItem button onClick={() => handleClickOpen(setOpen)}>
          <AddIcon/>
        New Mailbox
        </ListItem>
        <ListItem button onClick={() => setopenSetting(true)}>
          <SettingsIcon/>
          Settings
        </ListItem>
      </List>
      <Dialog open={open} onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Mailbox</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Please enter the name of the mailbox you would like to create
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="mailbox name"
            type="email"
            onChange={() => setTitle(event.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(setOpen)} color="primary">
            Cancel
          </Button>
          <Button onClick={() =>
            saveValue(setOpen, title, boxes,
                setBoxes, unread, setUnread)} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MailboxList;
