import React from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updatePassword } from "../../actions/auth.actions";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, ClickAwayListener, InputAdornment, Snackbar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from "axios";
import classnames from 'classnames';
import MuiAlert from '@material-ui/lab/Alert';


import './Settings.css';

const Alert = props => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      errors: {},
      password: "",
      password2: "",
      showPassword: false,
      showPassword2: false,
      open: false,
      snackbarOpen: false
    }
  }

  componentDidMount() {
    axios.get('/api/users/'+this.props.auth.user.id)
        .then(response => {
            this.setState({
              user: response.data[0]
            })
        })
        .catch((error) => {
            console.log(error);
        })
}

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
        this.setState({
            errors: nextProps.errors,
            alert: true
        });
    }
}

onChange = e => {
  this.setState({ ...this.state, [e.target.id]: e.target.value, alert: false, errors: {} });
};

handleClickShowPassword = () => {
  this.setState({ ...this.state, showPassword: !this.state.showPassword });
};

handleClickShowPassword2 = () => {
  this.setState({ ...this.state, showPassword2: !this.state.showPassword2})
}

handleMouseDownPassword = (e) => {
  e.preventDefault();
};

handleClickAway = () => {
  this.setState({
      alert: false
  })
}

  handleClickOpen = () => {
    this.setState({
      ...this.state,
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      password: '',
      password2: '',
      open: false,
      alert: false,
      errors: {}
    })
  };

  SnackBar = () =>{
      this.setState({
        snackbarOpen: true
      })
      this.handleClose()
      this.componentDidMount()
  }
  
  snackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    this.setState({
      snackbarOpen: false
    })
  }

  onSubmit = e => {
    e.preventDefault();
    let errors = {};
    if (!this.state.password) {
      errors.password = 'password required'
      this.setState({
        errors: errors,
        alert: true
      })  
    } else if (!this.state.password2) {
      errors.password = 'please confirm your password'
      this.setState({
        errors: errors,
        alert: true
      })
    } else if (this.state.password.length < 6) {
      errors.password = 'password must be at least 6 characters in length'
      this.setState({
        errors: errors,
        alert: true
      })
    } else if (this.state.password !== this.state.password2) {
      errors.password = "passwords must match"
      this.setState({
        errors: errors,
        alert: true
      })
    } else {
      let update = {
        password: this.state.password,
      }
        
      this.props.updatePassword(update, this.state.user._id, this.props.history);    
      setTimeout(() => this.SnackBar(), 500)
    }
  };

  render() {

  return (
    <React.Fragment>
      <span className="label">Password:</span>
      <div className="settings-input">
        <TextField
          disabled
          fullWidth
          value='*******'
          variant="outlined"
          style={{marginRight: '10px'}}
        />
      <Button variant="contained" disableElevation color="primary" style={{textTransform: 'capitalize'}} onClick={this.handleClickOpen}>Change</Button>
      </div>
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <form onSubmit={this.onSubmit}>
        <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
        {this.state.alert ? (
                      <div className="alert-box">
                          <p>{this.state.errors.password}</p>
                          <p>{this.state.errors.password2}</p>
                      </div>
                  ) : null} 
        <DialogContent>
        <TextField
            required
            id="password"
            label="Password"
            name="password"
            type={this.state.showPassword ? 'text' : 'password'}
            fullWidth
            style={{marginBottom: '10px'}}
            variant="outlined"
            onChange={this.onChange}
            value={this.state.password}
            error={this.state.errors.password}
            className={classnames("form-input", {
                  invalid: this.state.errors.password
            })}
            InputProps={{
              endAdornment:  
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={this.handleMouseDownPassword}
                >
                  {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
              }}
            />
          <TextField
            required
            id="password2"
            label="Confirm Password"
            name="password2"
            type={this.state.showPassword2 ? 'text' : 'password'}
            fullWidth
            style={{marginBottom: '10px'}}
            variant="outlined"
            onChange={this.onChange}
            value={this.state.password2}
            error={this.state.errors.password2}
            className={classnames("form-input", {
                  invalid: this.state.errors.password2
            })}
            InputProps={{
              endAdornment:  
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={this.handleClickShowPassword2}
                  onMouseDown={this.handleMouseDownPassword}
                >
                  {this.state.showPassword2 ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
              }}
          />
          <br />
        </DialogContent>
        <ClickAwayListener onClickAway={this.handleClickAway}>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
        </ClickAwayListener>
        </form>
      </Dialog>
      <Snackbar open={this.state.snackbarOpen} autoHideDuration={5000} onClose={this.snackBarClose}>
        <Alert onClose={this.snackBarClose} severity="success">
          {this.props.auth.success}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
  }
}

ChangePassword.propTypes = {
  updatePassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(
  mapStateToProps,
  { updatePassword }
)(withRouter(ChangePassword)));