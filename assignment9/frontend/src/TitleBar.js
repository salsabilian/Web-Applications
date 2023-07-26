import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Search from '@material-ui/icons/Search';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import SharedContext from './SharedContext';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer,
  },
  menuButton: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  margin: {
    width: '80%',
    alignItems: 'center',
  },
}));

/**
 * @return {oject} JSX
 */
function TitleBar() {
  const {toggleDrawerOpen} = React.useContext(SharedContext);
  const {mailbox, setOpen2, userAvatar, setopenSetting, username} =
  React.useContext(SharedContext);
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleDrawerOpen}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Hidden smDown>
          <h3>CSE183 - {mailbox}</h3>
        </Hidden>
        <FormControl className={classes.margin}>
          <Input
            id="input-with-icon-adornment"
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        </FormControl>
        <MailOutlineIcon
          color = "inherit"
          edge = "start"
          onClick={() => setOpen2(true)}
        >
        </MailOutlineIcon>
        <Button onClick={() => setopenSetting(true)}>
          <ListItemAvatar>
            <Avatar alt={username}
              src={userAvatar}/>
          </ListItemAvatar>
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default TitleBar;
