import React from 'react';
import emails from './data/emails.json';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import TrashIcon from '@material-ui/icons/Delete';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

// borrowed code from material ui about dialog and card
// and from the following stack overflow link about drawers and appbars
// https://stackoverflow.com/questions/42749907/react-material-ui-responsive-appbar-and-drawer


const drawerWidth = 240;
const styles = (theme) => ({
  root: { // overall
    flexGrow: 1,
    // zIndex: 1,
    // overflow: 'hidden',
    display: 'flex',
  },
  appBar: { // CSE183 header
    position: 'fixed',
    height: '50px',
    [theme.breakpoints.up('md')]: {
      // width: `calc(100% - ${drawerWidth}px)` + drawerWidth,
      flexGrow: 1,
    },
  },
  navIconHide: { // navigation bar
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: { // buttons
    position: 'fixed',
    top: '55px',
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: { // table
    // top: '250px',
    left: '250px',
    flexGrow: 1,
    padding: theme.spacing.unit * 6,
  },
  appHar: {
    position: 'flex',
    flexGrow: 1,
  },
  title: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
  },
  card: {
    position: 'fixed',
    top: 360,
    left: 250,
    width: '80%',
    height: '100%',
  },
});

/**
*
*/
class SomeComponent extends React.Component {
  /**
*@return{void}
*/
  constructor() {
    super();
    this.state = {
      filter: 1,
      mobileOpen: false,
      open: 0,
      setOpen: 0,
      email: 0,
    };
    this.changetoTrash = this.changetoTrash.bind(this);
    this.changetoInbox = this.changetoInbox.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.openContent = this.openContent.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  /**
  *@return{void}
  */
  handleDrawerToggle() {
    this.setState((state) => ({mobileOpen: !this.state.mobileOpen}));
  };
  /**
 *@param{object} filt
 *@return{object} correct date
 */
  fixeddate(filt) {
    const a = [];
    let j = 0;
    emails.sort(function(a, b) {
      const c = new Date(a.received);
      const d = new Date(b.received);
      return d - c;
    });
    const filtered = emails.filter(function(f) {
      if (!f.trash == filt) {
        return true;
      } else {
        return false;
      }
    });
    const today = new Date();
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (const email of filtered) {
      let time = 0;
      const currdate = new Date(email.received);
      if ((currdate.getMonth() == today.getMonth()) &&
        (currdate.getDate() ==today.getDate()) &&
        (currdate.getFullYear() == today.getFullYear())) {
        let hour = currdate.getHours();
        let minutes = currdate.getMinutes();
        if (hour < 10) {
          hour = '0' + hour;
        }
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        time = hour + ':' + minutes;
      } else if (currdate.getFullYear() == today.getFullYear()) {
        const mm = currdate.getMonth();
        const day = currdate.getDate();
        time = month[mm] + ' ' + day;
      } else if (currdate.getFullYear() < today.getFullYear()) {
        time = currdate.getFullYear();
      }
      a[j] =<tr> <td style =
        {{textAlign: 'left', padding: '10px', width: '150px'}}>
        {email.from}</td><td
        style = {{padding: '10px', width: '150px', textAlign: 'left'}}>
        <Button onClick = {() => this.openContent(email)}>
          {email.subject}</Button> </td>
      <td style = {{textAlign: 'center', padding: '10px', width: '150px'}}>
        {time} </td> </tr>;
      j++;
    }
    return (a);
  }
  /**
  *@param{object} email
  */
  openContent(email) {
    this.setState((state) => ({
      setOpen: 1,
      email: email,
    }));
  }
  /**
  *@return{void}
  */
  handleClose() {
    this.setState((state) => ({
      setOpen: 0,
    }));
  }
  /**
  * @return{void}
  */
  changetoTrash() {
    this.setState((state) => ({
      filter: 0,
      setOpen: 0,
    }));
  }
  /**
  *@return{void}
  */
  changetoInbox() {
    this.setState((state) => ({
      filter: 1,
      setOpen: 0,
    }));
  }
  /**
  *@param{object} time
  *@return{string}
  */
  datefix(time) {
    const date = new Date(time);
    let a = 'Received: ';
    let hour = date.getHours();
    let minutes = date.getMinutes();
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    const month = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    a = a + month[date.getMonth()] + ' ' + date.getDate() +
    ', '+ date.getFullYear() + ' @ ' + hour + ':' + minutes;
    return a;
  }
  /**
 * Simple component with no state.
 *
 * See the basic-react from lecture 11 for an example of adding and
 * reacting to changes in state and lecture 16 for details on Material-UI
 *
 *@return {object} JSX
 */
  render() {
    const {classes, theme} = this.props;
    const drawer = (
      <div>
        <Paper> <Button style={{width: '18%', position: 'fixed'}}
          onClick = {this.changetoInbox}
          startIcon = {<InboxIcon />}> Inbox
        </Button> </Paper>
        <Paper> <Button style={{top: '100px', width: '18%', position: 'fixed'}}
          onClick = {this.changetoTrash}
          startIcon = {<TrashIcon />}>
              Trash
        </Button> </Paper>
      </div>
    );
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              CSE183 Mail - {this.state.filter ? 'Inbox' : 'Trash'}
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <div className={classes.content}>
          <table style = {{width: '80%'}}>
            <tbody>
              {this.fixeddate(this.state.filter)}
            </tbody>
          </table>
        </div>
        <Hidden mdUp>
          <Dialog
            fullScreen
            open={this.state.setOpen}
            onClose={this.handleClose}
          >
            <AppBar className={classes.appHar}>
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  {this.state.email.subject}
                </Typography>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={this.handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <List style = {{top: '57px'}}>
              <ListItem>
                <ListItemText primary={'From: ' + this.state.email.from +
              ' (' + this.state.email.email + ')'}/>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={'To: App User (user@app.com)'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={'Subject: '+ this.state.email.subject}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={this.datefix(this.state.email.received)}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={this.state.email.content}
                />
              </ListItem>
            </List>
          </Dialog>
        </Hidden>
        <Hidden smDown>
          {this.state.setOpen ?
          (<Card className={classes.card}>
            <CardContent>
              <CardActions>
                <appBar>
                  <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                      {this.state.email.subject}
                    </Typography>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={this.handleClose}
                      aria-label="close"
                      className = {classes.title}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Toolbar>
                </appBar>
              </CardActions>
              <List>
                <ListItem>
                  <ListItemText primary={'From: ' + this.state.email.from +
              ' (' + this.state.email.email + ')'}/>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={'To: App User (user@app.com)'}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={'Subject: '+ this.state.email.subject}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={this.datefix(this.state.email.received)}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={this.state.email.content}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>) :
          null
          }

        </Hidden>
      </div>
    );
  }
}

SomeComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};
export default withStyles(styles, {withTheme: true})(SomeComponent);
