
import React, { Component } from "react";
import { Typography } from '@material-ui/core';
import ChangeFirstName from './ChangeFirstName';
import ChangeLastName from './ChangeLastName';
import ChangeUsername from './ChangeUsername';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';
import Spinner from '../Spinner/Spinner'
import './Settings.css';

class AccountSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 1000)
  }

render() {
  if (this.state.loading) {
    return (<div style={{paddingTop: '100px'}}><Spinner /></div>)
  } else {    
    return (
      <div id="settings">
        <br />
          <Typography variant="h4" component="h1" style={{textAlign: 'center'}}>User Settings</Typography>
        <br />
          
          <ChangeFirstName />
          <ChangeLastName />
          <ChangeEmail />
          <ChangeUsername />
          <ChangePassword />
          <br /> 
      </div>
    );
  }
  }
}




export default AccountSettings;