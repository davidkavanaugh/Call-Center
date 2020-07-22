
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, ClickAwayListener, Snackbar, InputAdornment } from '@material-ui/core';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/auth.actions";
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import classnames from "classnames";
import './Register.css';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

const Alert = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Register extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      password2: "",
      showPassword: false,
      showPassword2: false,
      alert: false,
      errors: {},
      dialogOpen: true,
      snabarOpen: false,
      isDisabled: false
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to profile
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
        this.setState({
            errors: nextProps.errors,
            alert: true
        });
    }
}


handleClickOpen = () => {
  this.setState({
    dialogOpen: true
  })
}

handleClose = () => {
  this.setState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    password2: "",
    showPassword: false,
    showPassword2: false,
    alert: false,
    errors: {},
  })
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

  success = () => {
      this.handleClose()
      this.setState({
        snackbarOpen: true
      })
      setTimeout(() => window.location="/login", 1500)
  }

  snackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    this.setState({
      snackbarOpen: false
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    let errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email)) {
        errors.email = "invalid email address"
        this.setState({
          errors: errors,
          alert: true
        })  
    } else if (this.state.password.length < 6) {
      errors.password = "password must be at least 6 characters in length"
      this.setState({
        errors: errors,
        alert: true
      })
    } else if (this.state.password !== this.state.password2) {
      errors.password2 = "passwords must match"
      this.setState({
        errors: errors,
        alert: true
      })
    } else {
      axios.get('/api/users/by-email/' + this.state.email)
      .then(res => {
        if (res.data[0]) {
          errors.email = "email address already in use"
          this.setState({
            errors: errors,
            alert: true
          })
        } else {
          axios.get('/api/users/by-username/' + this.state.username)
            .then(res => {
              if (res.data[0]) {
                errors.username = "username already exists"
                this.setState({
                  errors: errors,
                  alert: true
                })
              } else {
                this.setState({
                  alert: false,
                  errors: {},
                  isDisabled: true
                })
                const newUser = {
                  firstName: this.state.firstName,
                  lastName: this.state.lastName,
                  email: this.state.email.toLowerCase(),
                  username: this.state.username.toLowerCase(),
                  password: this.state.password,
                  password2: this.state.password2
                }
                this.props.registerUser(newUser);
                this.success()
              }
              })
            }
          })
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <React.Fragment>
        <Dialog open={this.state.dialogOpen} onClose={this.handleClose}>
          <form onSubmit={this.onSubmit}>
            <DialogTitle id="form-dialog-title">Register New User</DialogTitle>
            {this.state.alert ? (
              <div className="alert-box">
                <p>{errors.firstName}</p>
                <p>{errors.lastName}</p>
                <p>{errors.email}</p>
                <p>{errors.username}</p>
                <p>{errors.password}</p>
                <p>{errors.password2}</p>
              </div>
            ) : null} 
            <DialogContent>
            <TextField
            required
            autoFocus
            id="firstName"
            label="First name"
            name="firstName"
            type="text"
            fullWidth
            style={{marginBottom: '10px'}}
            variant="outlined"
            onChange={this.onChange}
            value={this.state.firstName}
            error={errors.firstName}
            className={classnames("form-input", {
              invalid: errors.firstName
            })}
          />
          <TextField
            required
            id="lastName"
            label="Last Name"
            name="lastName"
            type="text"
            fullWidth
            style={{marginBottom: '10px'}}
            variant="outlined"
            onChange={this.onChange}
            value={this.state.lastName}
            error={errors.lastName}
            className={classnames("form-input", {
              invalid: errors.lastName
            })}
          />
          <TextField
            required
            id="email"
            label="Email Address"
            name="email"
            type="text"
            fullWidth
            style={{marginBottom: '10px'}}
            variant="outlined"
            onChange={this.onChange}
            value={this.state.email}
            error={errors.email}
            className={classnames("form-input", {
              invalid: errors.email
            })}
          />
          <TextField
            required
            id="username"
            label="Username"
            name="username"
            type="text"
            fullWidth
            style={{marginBottom: '10px'}}
            variant="outlined"
            onChange={this.onChange}
            value={this.state.username}
            error={errors.username}
            className={classnames("form-input", {
              invalid: errors.username
            })}
          />
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
            error={errors.password}
            className={classnames("form-input", {
                  invalid: errors.password
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
            error={errors.password2}
            className={classnames("form-input", {
                  invalid: errors.password2
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
            </DialogContent>
            <ClickAwayListener onClickAway={this.handleClickAway}>
              <DialogActions>
                <Link to="/login" style={{marginRight: '10px'}}>
                  Cancel
                </Link>| 
                <Button disabled={this.state.isDisabled} type="submit" color="primary">
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));