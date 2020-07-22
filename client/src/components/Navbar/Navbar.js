import React from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MenuButton from '../MenuButton/MenuButton';
import logo from '../../assets/call-center-logo.png'
import axios from 'axios'
import Notification from '../../components/Notification/Notification';

class CancelButton extends React.Component {
  constructor(props) {
    super(props);
    this.state={}
  }

  componentDidMount = () => {
    this.setState({
      callCenterID: this.props.pathname.substring(20,44),
      callScriptID: this.props.pathname.substring(62,86)
    })
  }

  render() {
    if (this.props.pathname.substring(0,20) === '/call-center/editor/') {
      if (this.props.pathname.substring(45,61) === 'edit-call-script') {
        return(
          <Link to={'/call-center/editor/' + this.state.callCenterID}>
            <Button color="inherit">Cancel</Button>
          </Link>  
        )
      } else {
        return (
          <Link to={'/call-center/' + this.props.pathname.split('/').pop()}>
            <Button color="inherit">Cancel</Button>
          </Link>          
        )
      }
    } else if (this.props.pathname.substring(0,29) === '/call-center/new-call-script/') {
      return (
        <Link to={'/call-center/editor/' + this.props.pathname.split('/').pop()}>
          <Button color="inherit">Cancel</Button>
        </Link>             
      )
    } else {
      return (<Notification auth={this.props.auth} user={this.props.user} />)
    }
  }
}


class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state={ 
          user: {}
        }
    };

    componentDidMount = () => {
      axios('/api/users/' + this.props.auth.user.id)
      .then(res => {
          this.setState({
            user: res.data[0]
          })
      })
    }

  render() {
        return (
          <div id="nav">
            <AppBar position="fixed">
              <Toolbar className="navbar">
                <span style={{width: '149px'}}>
                  <CancelButton pathname={this.props.location.pathname} auth={this.props.auth} user={this.state.user} />
                </span>               
                <img src={logo} className='logo' alt="Logo" />
                <div style={{width: '150px', display: 'flex', justifyContent: 'flex-end'}}>     
                  <MenuButton />
                </div>
              </Toolbar>
            </AppBar>
          </div>
        )
  };
}
  
Navbar.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  callCenter: state.callCenter
});

export default withRouter(connect(
  mapStateToProps
)(Navbar));