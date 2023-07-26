import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import SharedContext from './SharedContext';
import MailboxList from './MailboxList';

const drawerWidth = 160;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

/**
 * @return {object} JSX
 */
function MailboxDrawer() {
  const {mailbox, setMailbox, open2, setOpen2, change, username, setUsername,
    userAvatar, setUserAvatar, openSetting, setopenSetting,
    setChange, drawerOpen, setDrawerOpen, boxes, setBoxes,
    toggleDrawerOpen} =
    React.useContext(SharedContext);
  const selectMailbox= (mailbox) => {
    setMailbox(mailbox);
    setDrawerOpen(false);
  };

  const classes = useStyles();
  return (
    <SharedContext.Provider value={{mailbox, setMailbox, selectMailbox, open2,
      setOpen2, change, username, setUsername,
      userAvatar, setUserAvatar, openSetting, setopenSetting,
      setChange, drawerOpen, setDrawerOpen, boxes, setBoxes,
      toggleDrawerOpen}} >
      <Hidden smDown implementation="css">
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{paper: classes.drawerPaper}}
        >
          <MailboxList/>
        </Drawer>
      </Hidden>
      <Hidden smUp implementation="css">
        <Drawer
          className={classes.drawer}
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawerOpen}
          ModalProps={{keepMounted: true}}
        >
          <MailboxList/>
        </Drawer>
      </Hidden>
    </SharedContext.Provider>
  );
}

export default MailboxDrawer;
