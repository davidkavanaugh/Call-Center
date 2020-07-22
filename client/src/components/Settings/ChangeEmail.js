import React from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUserEmail } from "../../actions/auth.actions";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, ClickAwayListener, Snackbar } from '@material-ui/core';
import axios from "axios";
import classnames from 'classnames';
import './Settings.css';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ChangeEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      email: '',
      open: false,
      snackbarOpen: false,
      errors: {},
      alert: false
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
    open: false,
    alert: false,
    errors: {}
  })
};

SnackBar = () =>{
    this.handleClose()
    this.setState({
      snackbarOpen: true
    })
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

onSubmit = (e) => {
  e.preventDefault();
  let errors = {};
  if (!this.state.email) {
    errors.email = 'email address required'
    this.setState({
      errors: errors,
      alert: true
    })  
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email)) {
      errors.email = "invalid email address"
      this.setState({
        errors: errors,
        alert: true
      })  
  } else if (this.state.email === this.state.user.email) {
      errors.email = 'no changes'
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
          this.setState({
            alert: false,
            errors: {}
          })
    
          let update = {
            email: this.state.email,
          }
          this.props.updateUserEmail(update, this.state.user._id, this.props.history);
          this.SnackBar()
        }
      })
      .catch((err) => {
          console.log(err);
      })
    } 
  }

  render() {
    let email = this.state.user.email
  return (
    <React.Fragment>
      <span className="label">Email Address:</span>
      
      <div className="settings-input">
        <TextField
          disabled
          fullWidth
          value={email}
          variant="outlined"
          style={{marginRight: '10px'}}
        />
      <Button variant="contained" disableElevation color="primary" style={{textTransform: 'capitalize'}} onClick={this.handleClickOpen}>Change</Button>
      </div>
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <form onSubmit={this.onSubmit} className="settings-form">
        <DialogTitle id="form-dialog-title">Change Email Address</DialogTitle>
        {this.state.alert ? (
                      <div className="alert-box">
                          <p>{this.state.errors.email}</p>
                      </div>
                  ) : null}  
        <DialogContent>
          <TextField
            margin="dense"
            id="email"
            label="New Email Address"
            type="text"
            fullWidth
            variant="outlined"
            onChange={this.onChange}
            error={this.state.errors.email}
            className={classnames("form-input", {
              invalid: this.state.errors.email
            })}
          />
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

ChangeEmail.propTypes = {
  updateUserEmail: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(
  mapStateToProps,
  { updateUserEmail }
)(withRouter(ChangeEmail)));