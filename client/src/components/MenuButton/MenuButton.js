import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Button, Drawer, List, ListItem, Divider } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/auth.actions";
import { updateCallCenter, callCenterState, newCallScript, updateCallScript } from '../../actions/call-center.actions';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import ToEditor from '../../components/ToEditor/ToEditor';
import HomeIcon from '@material-ui/icons/Home';
import axios from 'axios';

class MenuButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        drawerOpen: false,
        user: null,
        callCenter: {}
      }
  
    }
  
componentDidMount = async() => {
  this.getUser()
  .then((res) => {
      this.setState({
      ...this.state,
      user: res.data[0],
      callCenter: this.props.callCenter
      })
  })
  .catch(err => console.log(err))
}
  
getUser = async () => {
  const res = await axios('/api/users/'+this.props.auth.user.id);
  return res;
};

handleLogout = e => {
    e.preventDefault();
    this.props.logoutUser();
    this.setState({ user: null })
};

handleUsername = (username) => {
if (username.length > 7) {
    return username.substring(0,7) + '...'
} else return username
}
  
toggleDrawer = () => () => {  
    this.setState({ drawerOpen: !this.state.drawerOpen });
};

goBack = () => {
  if (this.props.location.pathname.substring(38, 44) == 'client') {
    if (this.props.location.pathname.substring(70, 78) === 'add-note') {
      return (
        <React.Fragment>
          <List className="drawer-links" onClick={this.toggleDrawer()}> 
          <ListItem onClick={this.props.history.goBack} className="navlink"><PhoneCallbackIcon style={{color: '#545454', paddingRight: '10px'}}/>Back</ListItem>
          </List><Divider />
        </React.Fragment>
      )
    } else if (this.props.location.pathname.substring(70,74) === 'note') {
      return (
        <React.Fragment>
          <List className="drawer-links" onClick={this.toggleDrawer()}> 
          <ListItem onClick={this.props.history.goBack} className="navlink"><PhoneCallbackIcon style={{color: '#545454', paddingRight: '10px'}}/>Back</ListItem>
          </List><Divider />
        </React.Fragment>
      )
    }
    
    else {
      return(
        <React.Fragment>
          <List className="drawer-links" onClick={this.toggleDrawer()}> 
          <Link to={`/call-center/${this.props.location.state.callCenter}`}><ListItem className="navlink"><PhoneCallbackIcon style={{color: '#545454', paddingRight: '10px'}}/>Back</ListItem></Link> 
          </List><Divider />
        </React.Fragment>
      )
    }
  }
}

handleSave = () => {
  if (this.props.location.pathname.substring(0,29) === '/call-center/new-call-script/') {
    let update = {
      callScripts: this.props.callCenter.callScripts
    }
    this.props.newCallScript(update, this.props.location.pathname.split('/').pop())
    this.props.history.push('/call-center/editor/'+this.props.callCenter._id)
    setTimeout(() => window.location.reload(), 250);
  } else {
      if (this.props.location.pathname.substring(45,61) === 'edit-call-script') {
        let update = {
          callScripts: this.props.callCenter.callScripts,
          callCenterID: this.props.callCenter._id
        }
        this.props.updateCallScript(update);
        this.props.history.push('/call-center/editor/'+this.props.callCenter._id);
        setTimeout(() => window.location.reload(), 250);
      } else if (this.props.callCenter.img) {
        let update = {
          name: this.props.callCenter.name,
          about: this.props.callCenter.about,
          img: this.props.callCenter.img
        }
        this.props.updateCallCenter(update, this.props.location.pathname.split('/').pop())
        this.props.history.push('/call-center/'+this.props.callCenter._id)
      } else {
        this.props.history.push('/call-center/'+this.props.location.pathname.split('/').pop())
      }
  }
}
  
    render() {
      if (!this.props.auth.isAuthenticated) {
        // Render loading state ...
        return (
          <React.Fragment>
            <span></span>
          </React.Fragment>
        )
      } else {
          if (this.props.location.pathname.substring(0,20) === '/call-center/editor/') {
              return (
                  <React.Fragment>
                     <Button color="inherit" onClick={this.handleSave}>Save</Button>
                  </React.Fragment>
              )
          } else if (this.props.location.pathname.substring(0,29) === '/call-center/new-call-script/') {
            return (
              <React.Fragment>
                 <Button color="inherit" onClick={this.handleSave}>Save</Button>
              </React.Fragment>
            )            
          } else {
            return (
              <React.Fragment>
                <Button onClick={this.toggleDrawer()} color='inherit' variant="outlined" style={{margin: '5px 5px', fontSize: "1em", textTransform: "none"}}>
                  <PersonIcon style={{fontSize: "1.4em"}}/>
                  <span style={{paddingLeft: '5px', paddingRight:'5px'}}>
                    {
                      this.state.user ? this.handleUsername(this.state.user.username) : this.handleUsername(this.props.auth.user.username)
                    }
                  </span>
                </Button>
                <Drawer anchor="right" variant='temporary' open={this.state.drawerOpen} onClose={this.toggleDrawer()}>
                  {this.props.location.pathname === '/' || this.props.location.pathname === '/dashboard' || this.props.location.pathname === '/create-call-center' ? 
                    <React.Fragment>
                    <List className="drawer-links" onClick={this.toggleDrawer()}> 
                      <Link to='/create-call-center'><ListItem className="navlink"><AddCircleOutlineIcon style={{color: '#545454', paddingRight: '10px'}}/>New Call Center</ListItem></Link> 
                    </List><Divider />
                    </React.Fragment>
                    : this.goBack()}
                  <ToEditor toggleDrawer={this.toggleDrawer()}/>
                  <List className="drawer-links" onClick={this.toggleDrawer()}>
                  <Link to='/dashboard'><ListItem className="navlink"><HomeIcon style={{color: '#545454', paddingRight: '10px'}}/>Dashboard</ListItem></Link>
                    <Link to='/account-settings'><ListItem className="navlink"><SettingsIcon style={{color: '#545454', paddingRight: '10px'}}/>User Settings</ListItem></Link>
                    <Link to="/" onClick={this.handleLogout}><ListItem className="navlink"><ExitToAppIcon style={{color: '#545454', paddingRight: '10px'}}/>Logout</ListItem></Link>
                  </List>     
                </Drawer>
              </React.Fragment>
            )
          }
        }
    }
  }
  
  MenuButton.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    updateCallCenter: PropTypes.func.isRequired,
    callCenterState: PropTypes.func.isRequired,
    newCallScript: PropTypes.func.isRequired,
    updateCallScript: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    callCenter: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    callCenter: state.callCenter.callCenter,
    client: state.client.clients
  });
  
  export default withRouter(connect(
    mapStateToProps,
    { logoutUser, updateCallCenter, callCenterState, newCallScript, updateCallScript }
  )(MenuButton));