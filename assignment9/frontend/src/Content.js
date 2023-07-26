import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import SharedContext from './SharedContext';
import StarIcon from '@material-ui/icons/Star';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import TrashIcon from '@material-ui/icons/Delete';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SaveIcon from '@material-ui/icons/Save';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  appHar: {
    zIndex: theme.zIndex.drawer + 500,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

/**
* @param {string} id
* @param {string} info
* @param {integer} value
*/
function updateMail(id, info, value) {
  fetch('http://localhost:3010/v0/mail/'+id+'?info='+info+'&value='+value, {
    method: 'POST',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return;
      });
}
/**
* @param {string} id
* @param {string} mailbox
*/
function moveMail(id, mailbox) {
  fetch('http://localhost:3010/v0/mail/'+id+'?mailbox='+mailbox, {
    method: 'PUT',
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return;
      });
}

/**
* @param {string} to
* @param {string} subject
* @param {string} content
* @param {string} received
* @param {function} setTo
* @param {function} setSubject
* @param {function} setContent
*/
function postMail(to, subject, content, received,
    setTo, setSubject, setContent) {
  fetch('http://localhost:3010/v0/mail/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'from': {
        'email': to,
      },
      'subject': subject,
      'received': received,
      'content': content,
    }),
  })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return;
      });
  setTo('');
  setSubject('');
  setContent('');
}
/**
 * Simple component with no state.
 *
 * @param {function} setDummy set the dummy state
 * @param {function} mailbox tells us which mailbox to open
 */
function getMail(setDummy, mailbox) {
  if (mailbox == 'starred') {
    fetch('http://localhost:3010/v0/mail')
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          setDummy(json);
        })
        .catch((error) => {
          setDummy(error.toString());
        });
  } else {
    fetch('http://localhost:3010/v0/mail?mailbox='+mailbox)
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          setDummy(json);
        })
        .catch((error) => {
          setDummy(error.toString());
        });
  }
}

/**
*@param {string} received
*@return {string}
**/
function fixtime(received) {
  const today = new Date();
  const yesterday =
  new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let time = 0;
  const currdate = new Date(received);
  if ((currdate.getMonth() == today.getMonth()) &&
        (currdate.getDate() == today.getDate()) &&
        (currdate.getFullYear() == today.getFullYear())) {
    let hour = currdate.getHours();
    let minutes = currdate.getMinutes();
    if (hour < 12) {
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      time = hour + ':' + minutes + ' ' + 'AM';
    } else {
      hour = hour % 12;
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      time = hour + ':' + minutes + ' ' + 'PM';
    }
  } else if (yesterday.getFullYear() == currdate.getFullYear() &&
      currdate.getMonth() == yesterday.getMonth() &&
      currdate.getDate() == yesterday.getDate()) {
    time = 'yesterday';
  } else if (currdate.getFullYear() == today.getFullYear()) {
    const mm = currdate.getMonth();
    const day = currdate.getDate();
    time = month[mm] + ' ' + day;
  } else if (currdate.getFullYear() < today.getFullYear()) {
    time = currdate.getFullYear();
  }
  return time;
}

/**
 * Simple component with no state.
 *@param {object} dummy set the dummy state
 *@param {function} setChange rerender
 *@param {number} change
 *@param {function} setOpen
 *@param {function} setEmail
 *@param {string} mailbox
 *@param {string} userAvatar
 *@param {string} username
 * @return {object} a our list
 */
function fixdate(dummy, setChange, change, setOpen, setEmail,
    mailbox, userAvatar, username) {
  const a = [];
  let mail = [];
  if (dummy.length != 0) {
    const keys = Object.keys(dummy[0]);
    mail = dummy[0][keys[1]];
    mail.sort(function(a, b) {
      const c = new Date(a.received);
      const d = new Date(b.received);
      return d - c;
    });
    const today = new Date();
    const yesterday =
    new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let time = 0;
    let j = 0;
    for (let i = 0; i<mail.length; ++i) {
      const currdate = new Date(mail[i].received);
      if ((currdate.getMonth() == today.getMonth()) &&
        (currdate.getDate() == today.getDate()) &&
        (currdate.getFullYear() == today.getFullYear())) {
        let hour = currdate.getHours();
        let minutes = currdate.getMinutes();
        if (hour < 12) {
          if (hour < 10) {
            hour = '0' + hour;
          }
          if (minutes < 10) {
            minutes = '0' + minutes;
          }
          time = hour + ':' + minutes + ' ' + 'AM';
        } else {
          hour = hour % 12;
          if (hour < 10) {
            hour = '0' + hour;
          }
          if (minutes < 10) {
            minutes = '0' + minutes;
          }
          time = hour + ':' + minutes + ' ' + 'PM';
        }
      } else if (yesterday.getFullYear() == currdate.getFullYear() &&
      currdate.getMonth() == yesterday.getMonth() &&
      currdate.getDate() == yesterday.getDate()) {
        time = 'yesterday';
      } else if (currdate.getFullYear() == today.getFullYear()) {
        const mm = currdate.getMonth();
        const day = currdate.getDate();
        time = month[mm] + ' ' + day;
      } else if (currdate.getFullYear() < today.getFullYear()) {
        time = currdate.getFullYear();
      }
      let avatar ='asdf';
      let name = mail[i].from.name.toString();
      if (mailbox == 'sent') {
        avatar= userAvatar;
        name = username;
      } else if (mail[i].avatar) {
        avatar=mail[i].avatar.toString();
      }
      a[j] = <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar style={{width: '60px', height: '60px'}}
            alt={name}
            src={avatar}/>
        </ListItemAvatar>
        <Button onClick={() =>
          read(mail[i], setChange, change, 1, setOpen, setEmail)}
        style={{textAlign: 'left'}}>
          {mail[i].read ?
          (<ListItemText
            primary = {
              <div style ={{width: '90%'}}>
                <Typography noWrap>
                  {name}</Typography>
              </div>
            }
            secondary = {
              <div style ={{width: '90%'}}>
                <Typography noWrap>{mail[i].subject.toString()}</Typography>
                <Typography noWrap>{mail[i].content.toString()}</Typography>
              </div>
            }
          />) :
          (<ListItemText
            primary = {
              <div style ={{width: '90%'}}>
                <Typography noWrap><b>
                  {name}</b></Typography>
              </div>
            }
            secondary = {
              <div style ={{width: '90%'}}>
                <Typography noWrap><b>
                  {mail[i].subject.toString()}</b></Typography>
                <Typography noWrap>{mail[i].content.toString()}</Typography>
              </div>
            }
          />)
          }
        </Button>
        {mail[i].starred ?
        (<ListItemSecondaryAction align='center'>
          <div style = {{position: 'relative'}}>
            <Typography
            > {time} </Typography>
            <StarIcon
              style={{color: 'yellow', stroke: 'black', strokeWidth: '2'}}
              edge="end"
              onClick={() => starred(mail[i], setChange, change)}
            >
            </StarIcon>
          </div>
        </ListItemSecondaryAction>):
        (<ListItemSecondaryAction align='center'>
          <div style = {{position: 'relative'}}>
            <Typography
            > {time} </Typography>
            <StarIcon
              style={{color: 'white', stroke: 'black', strokeWidth: '2'}}
              edge="end"
              onClick={() => starred(mail[i], setChange, change)}
            >
            </StarIcon>
          </div>
        </ListItemSecondaryAction>)
        }
      </ListItem>;
      j++;
    }
  }
  return (a);
}
/**
* @param{object} mail
* @param{function} setChange
* @param{number} change
*/
function starred(mail, setChange, change) {
  if (change == 0) {
    setChange(1);
  } else {
    setChange(0);
  }
  if (mail.starred == 0) {
    updateMail(mail.id, 'starred', 1);
  } else {
    updateMail(mail.id, 'starred', 0);
  }
}
/**
* @param{object} mail
* @param{function} setChange
* @param{number} change
* @param{number} value
* @param{function} setOpen
* @param{function} setEmail
*/
function read(mail, setChange, change, value, setOpen, setEmail) {
  if (change == 0) {
    setChange(1);
  } else {
    setChange(0);
  }
  if (value == 1) {
    setOpen(true);
  } else {
    setOpen(false);
  }
  setEmail(mail);
  updateMail(mail.id, 'read', value);
}

/**
* @param{function} setOpen
* @param{object} email
* @param{number} change
* @param{function} setChange
*/
const trashy = (setOpen, email, change, setChange) => {
  if (change == 0) {
    setChange(1);
  } else {
    setChange(0);
  }
  setOpen(false);
  moveMail(email.id, 'trash');
};

/**
* @param {function} setTempAvatar
* @param {string} temptempAvatar
* @param {function} setOpen3
*/
const savetempavatar = (setTempAvatar, temptempAvatar, setOpen3) => {
  setTempAvatar(temptempAvatar);
  setOpen3(false);
};


/**
* @param{string} mailbox
* @param{object} email
* @param{number} change
* @param{function} setChange
* @param{function} setMove
* @param {function} setMailbox
*/
const movetonewBox = (mailbox, email, change, setChange,
    setMove, setMailbox) => {
  if (change == 0) {
    setChange(1);
  } else {
    setChange(0);
  }
  setMailbox(mailbox);
  setMove(false);
  moveMail(email.id, mailbox);
};

/**
* @param{string} to
* @param{string} subject
* @param{string} content
* @param{function} setOpen2
* @param {function} setTo
* @param {function} setSubject
* @param {function} setContent
*/
const makeEmail = (to, subject, content, setOpen2,
    setTo, setSubject, setContent) => {
  const received = new Date();
  postMail(to, subject, content, received,
      setTo, setSubject, setContent);
  setOpen2(false);
};
/**
*  @param{function} setOpen
*/
const handleClose = (setOpen) => {
  setOpen(false);
};

/**
*  @param{function} setOpen4
*  @param{function} setopenSetting
*  @param{function} setTempAvatar
*  @param{function} settempuserName
*  @param{function} setUsername
*  @param{function} setUserAvatar
*  @param{string} tempAvatar
*  @param{string} tempuserName
*  @param{string} userAvatar
*  @param{string} username
*  @param{boolean} save
*/
const handleClosingSetting = (setOpen4, setopenSetting,
    setTempAvatar, settempuserName, setUsername, setUserAvatar,
    tempAvatar, tempuserName, userAvatar, username, save) => {
  if (save == true) {
    setUsername(tempuserName);
    setUserAvatar(tempAvatar);
  } else {
    setTempAvatar(userAvatar);
    settempuserName(username);
  }
  setOpen4(false);
  setopenSetting(false);
};

/**
* @param{function} setOpen4
* @param{function} setopenSetting
* @param{string} username
* @param{string} tempuserName
* @param{string} userAvatar
* @param{string} tempAvatar
*/
const savechanges = (setOpen4, setopenSetting, username,
    tempuserName, userAvatar, tempAvatar) => {
  if (username == tempuserName && userAvatar==tempAvatar) {
    setopenSetting(false);
  } else {
    setOpen4(true);
  }
};

/**
* @param{function} setopenSetting
* @param {string} tempAvatar
* @param {function} setUserAvatar
* @param {string} tempuserName
* @param {function} setUsername
*/
const saveAvatar = (setopenSetting, tempAvatar, setUserAvatar,
    tempuserName, setUsername) => {
  setUserAvatar(tempAvatar);
  setUsername(tempuserName);
  setopenSetting(false);
};

/**
* @param {array} boxes
* @param {object} email
* @param {number} change
* @param {function} setChange
* @param {function} setMove
* @param {function} setMailbox
* @return {object}
*/
const makeMenu = (boxes, email, change, setChange, setMove, setMailbox) => {
  const a = [];
  for (let i=0; i<boxes.length; ++i) {
    a[i] = <Button onClick=
      {()=>movetonewBox(boxes[i].name, email,
          change, setChange, setMove, setMailbox)}>
      <MenuItem> <ListItemText primary=
        <div style={{textAlign: 'center'}}>
          {boxes[i].name}</div>/></MenuItem></Button>;
  }
  return (a);
};
/**
* @param {object} email
* @param {string} mailbox
* @param {string} username
* @param {string} userAvatar
* @return {object}
*/
const makeHeader = (email, mailbox, username, userAvatar) => {
  const a = [];
  let name = email.from ? email.from.name.toString() : 'what?';
  let avatar = email.avatar;
  if (mailbox == 'sent') {
    name = username;
    avatar = userAvatar;
  }
  a[0] = <ListItem>
    <ListItemAvatar>
      <Avatar alt={name}
        src={avatar}/>
    </ListItemAvatar>
    <ListItemText
      primary=<div>
        {name}
        {' '}{fixtime(email.received)}</div>
      secondary={email.from ? email.from.email.toString() : 'what?'}/>
    <ListItemSecondaryAction>
      <ArrowBackIcon/>
    </ListItemSecondaryAction>
  </ListItem>;
  return a;
};
/**
 * @return {object} JSX
 */
function Content() {
  const [dummy, setDummy] = React.useState([]);
  const [move, setMove] = React.useState(false);
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [content, setContent] = React.useState('');
  const {change, setChange, boxes, openSetting, setopenSetting,
    userAvatar, setUserAvatar, username, setUsername} =
    React.useContext(SharedContext);
  const [email, setEmail] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const {open2, setOpen2} = React.useContext(SharedContext);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const {mailbox, setMailbox} =
    React.useContext(SharedContext);
  const [tempAvatar, setTempAvatar] = React.useState(userAvatar);
  const [temptempAvatar, setTempTempAvatar] = React.useState('false');
  const [tempuserName, settempuserName] = React.useState(username);
  React.useEffect(() => {
    getMail(setDummy, mailbox);
  }, [mailbox, change, open, open2]);
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Toolbar/>
      <h3>{mailbox}</h3>
      <p/>
      <Hidden smDown>
        <List dense style={{position: 'absolute', width: '80vw'}}>
          {fixdate(dummy, setChange, change, setOpen, setEmail,
              mailbox, userAvatar, username)}
        </List>
      </Hidden>
      <Hidden mdUp>
        <List dense style=
          {{width: '95vw', testAlign: 'center'}}>
          {fixdate(dummy, setChange, change, setOpen, setEmail,
              mailbox, userAvatar, username)}
        </List>
      </Hidden>
      <Dialog fullScreen open={open}
        onClose={() => handleClose(setOpen)}>
        <AppBar className={classes.appHar}>
          <Toolbar>
            <IconButton edge="start" color="inherit"
              onClick={() => handleClose(setOpen)} aria-label="close">
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
            </Typography>
            <Button autoFocus color = "inherit"
              onClick={() =>
                read(email, setChange, change, 0, setOpen, setEmail)}>
              <MailOutlineIcon/>
            </Button>
            <Button autoFocus color = "inherit"
              onClick={() => setMove(event.currentTarget)}>
              <SystemUpdateAltIcon/>
            </Button>
            <Button autoFocus color="inherit"
              onClick={() => trashy(setOpen, email, change, setChange)}>
              <TrashIcon/>
            </Button>
          </Toolbar>
        </AppBar>
        <List style={{top: '57px'}}>
          <ListItem>
            <ListItemText primary=<b>{email.subject}</b>
              secondary=<span style=
                {{fontSize: '17px', color: 'black',
                  backgroundColor: '#DCDCDC'}}>{mailbox}</span>/>
          </ListItem>
          <ListItem>
            {email.starred ?
        (<ListItemSecondaryAction align='center'>
          <div style = {{position: 'relative'}}>
            <StarIcon
              style={{color: 'yellow', stroke: 'black', strokeWidth: '2'}}
              edge="end"
              onClick={() => starred(email, setChange, change)}
            >
            </StarIcon>
          </div>
        </ListItemSecondaryAction>):
        (<ListItemSecondaryAction align='center'>
          <div style = {{position: 'relative'}}>
            <StarIcon
              style={{color: 'white', stroke: 'black', strokeWidth: '2'}}
              edge="end"
              onClick={() => starred(email, setChange, change)}
            >
            </StarIcon>
          </div>
        </ListItemSecondaryAction>)
            }
          </ListItem>
          {makeHeader(email, mailbox, username, userAvatar)}
          <ListItem>
            <ListItemText primary = {email.content}/>
          </ListItem>
        </List>
      </Dialog>
      <Dialog fullScreen open={open2}
        onClose={() => handleClose(setOpen2)}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit"
              onClick={() => handleClose(setOpen2)} aria-label="close">
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
            </Typography>
            <Button autoFocus color = "inherit"
              onClick={() => makeEmail(to, subject, content, setOpen2,
                  setTo, setSubject, setContent)}>
              <ArrowForwardIcon/>
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <TextField
            style={{top: '57px'}}
            autoFocus
            margin="dense"
            id="name"
            InputProps={{
              startAdornment:
              <InputAdornment position="start">To:</InputAdornment>,
              endAdornment:
              <InputAdornment position="end">
                <ArrowDropDownIcon/></InputAdornment>,
            }}
            type="email"
            onChange={() => setTo(event.target.value)}
            fullWidth
          />
          <TextField
            style={{top: '57px'}}
            autoFocus
            margin="dense"
            id="e"
            InputProps={{
              startAdornment:
              <InputAdornment position="start">Subject:</InputAdornment>,
            }}
            type="email"
            onChange={() => setSubject(event.target.value)}
            fullWidth
          />
          <TextField multiline
            style={{top: '57px'}}
            autoFocus
            margin="dense"
            id="me"
            type="email"
            onChange={() => setContent(event.target.value)}
            fullWidth
          />
        </DialogContent>
      </Dialog>
      <Hidden smDown>
        <Menu style ={{left: '87%', zIndex: 3000}}
          id="customize"
          keepMounted
          open={Boolean(move)}
          onClose={() => setMove(false)}
        >
          {makeMenu(boxes, email, change, setChange, setMove, setMailbox)}
        </Menu>
      </Hidden>
      <Hidden mdUp>
        <Menu style ={{position: 'absolute',
          top: '-125vw', height: '40%',
          left: '54%', zIndex: 3000}}
        id="customized-menu"
        open={Boolean(move)}
        onClose={() => setMove(false)}
        >
          {makeMenu(boxes, email, change, setChange, setMove, setMailbox)}
        </Menu>
      </Hidden>
      <Dialog fullScreen open={openSetting}
        onClose={() => handleClosingSetting(setopenSetting, setTempAvatar,
            settempuserName, userAvatar, username)}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit"
              onClick={() => savechanges(setOpen4, setopenSetting,
                  username, tempuserName, userAvatar, tempAvatar)}
              aria-label="close">
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
            </Typography>
            <Button autoFocus color = "inherit"
              onClick={() => saveAvatar(setopenSetting, tempAvatar,
                  setUserAvatar, tempuserName, setUsername)}>
              <SaveIcon/>
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Button onClick={()=>setOpen3(true)}>
            <ListItemAvatar style={{position: 'absolute', top: '100px',
              left: '5vw'}}>
              <Avatar style={{width: '25vw', height: '25vw'}} alt={tempuserName}
                src={tempAvatar}/>
            </ListItemAvatar>
          </Button>
          <TextField
            style={{top: '100px', left: '20vw', width: '55vw'}}
            defaultValue={tempuserName}
            autoFocus
            margin="dense"
            id="na"
            onChange={() => settempuserName(event.target.value)}/>
          <Typography style={{position: 'absolute', top: '160px',
            left: '40vw', width: '55vw'}}>
          cse183student@ucsc.edu </Typography>
        </DialogContent>
      </Dialog>
      <Dialog open={open3} onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Avatar</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Please enter the link of the avatar you would like to create
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="nam"
            label="Avatar Link"
            type="email"
            onChange={() => setTempTempAvatar(event.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(setOpen3)} color="primary">
            Cancel
          </Button>
          <Button onClick={() =>
            savetempavatar(setTempAvatar, temptempAvatar, setOpen3)}
          color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open4} onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Avatar</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Would you like to save your new Settings?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClosingSetting(setOpen4, setopenSetting,
              setTempAvatar, settempuserName, setUsername, setUserAvatar,
              tempAvatar, tempuserName,
              userAvatar, username, true)} color="primary">
            Yes
          </Button>
          <Button onClick={() =>
            handleClosingSetting(setOpen4, setopenSetting,
                setTempAvatar, settempuserName, setUsername, setUserAvatar,
                tempAvatar, tempuserName, userAvatar, username, false)}
          color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Content;
