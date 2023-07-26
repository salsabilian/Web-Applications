import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DeleteIcon from '@material-ui/icons/Delete';
import MailIcon from '@material-ui/icons/Mail';
import StarIcon from '@material-ui/icons/Star';
import SharedContext from './SharedContext';
import TitleBar from './TitleBar';
import Content from './Content';
import MailboxDrawer from './MailboxDrawer';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  const [mailbox, setMailbox] = React.useState('inbox');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [change, setChange] = React.useState(0);
  const [boxes, setBoxes] = React.useState([{name: 'inbox', icon: <MailIcon/>},
    {name: 'starred', icon: <StarIcon/>},
    {name: 'sent', icon: <MailIcon/>},
    {name: 'trash', icon: <DeleteIcon/>}]);
  const [username, setUsername] = React.useState('CSE 183 STUDENT');
  const [userAvatar, setUserAvatar] = React.useState('asdfasd');
  const [openSetting, setopenSetting] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  window.addEventListener('resize', () => {
    setDrawerOpen(false);
  });

  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <SharedContext.Provider value= {{
        mailbox, setMailbox, open2, setOpen2, change, username, setUsername,
        userAvatar, setUserAvatar, openSetting, setopenSetting,
        setChange, drawerOpen, setDrawerOpen, boxes, setBoxes,
        toggleDrawerOpen,
      }}
      >
        <MailboxDrawer/>
        <TitleBar/>
        <Content/>
      </SharedContext.Provider>
    </div>
  );
}

export default App;
