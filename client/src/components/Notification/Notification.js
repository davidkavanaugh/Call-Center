import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Dialog, IconButton, Divider, Button, Slide, AppBar, Toolbar, List, ListItem, ListItemText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function Notification(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);
    let arr;

    React.useEffect(() => {
      axios('/api/users/' + props.auth.user.id)
      .then(res => {
          setNotifications(res.data[0].notifications)
      })
    }, [notifications, props.auth.user]);


    const handleClickOpen = () => {
        setOpen(true);
        arr = notifications.reverse();
      };
    
    const handleClose = () => {
      setOpen(false);
      axios('/api/users/' + props.auth.user.id)
        .then(res => {
          setNotifications(res.data[0].notifications)
          arr = notifications.reverse();
        })
    };

    const handleBadgeNumber = () => {
      let count = 0;
      if (notifications) {
        notifications.forEach(notification => {
          if (notification.checked === false) {
            count++
          }
        })
        return count
      }
    }
  
    if (notifications) {
      arr = notifications.reverse()
    }

  return (
    <div className={classes.root}>
      {props.auth.isAuthenticated ?
        <React.Fragment>
        {notifications.length ?
        <IconButton onClick={handleClickOpen} aria-label="notification" style={{color: '#ffffff'}}>
            <Badge badgeContent={handleBadgeNumber()} color="secondary">
                <NotificationsIcon />
            </Badge>
        </IconButton>
        : null}
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
            <Toolbar>
                <Button autoFocus color="inherit" onClick={handleClose}>
                    <CloseIcon />
                </Button>
            </Toolbar>
            </AppBar>
            <List>
              {notifications.length ? 
              arr.map((notification, key) => {
                if (notification.checked) {
                  return (
                    <React.Fragment key={key}>
                      <Link to={'/invite/' + notification._id} onClick={handleClose}>
                        <ListItem button style={{backgroundColor: '#f2f2f2'}}>
                          <ListItemText primary={notification.title} secondary={notification.message} />
                        </ListItem>
                      </Link>
                      <Divider />
                    </React.Fragment>                  
                  )               
                } else {
                  return (
                    <React.Fragment key={key}>
                      <Link to={'/invite/' + notification._id} onClick={handleClose}>
                        <ListItem button style={{backgoundColor: 'white'}}>
                          <ListItemText primary={notification.title} secondary={notification.message} />
                        </ListItem>
                      </Link>
                      <Divider />
                    </React.Fragment>                  
                  )                         
                }
              })
              : null}
            </List>

        </Dialog>
        </React.Fragment>
      : null}
    </div>
  );
}