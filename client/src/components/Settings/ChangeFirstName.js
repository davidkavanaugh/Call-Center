import React from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUserFirstName } from "../../actions/auth.actions";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, ClickAwayListener, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import axios from "axios";
import classnames from 'classnames';


import './Settings.css';


const Alert = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class ChangeFirstName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      errors: {},
      firstName: '',
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

snackBarClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  this.setState({
    snackbarOpen: false
  })
}

onSubmit = async (e) => {
  await e.preventDefault();
  let errors = {};
  if (!this.state.firstName) {
    errors.firstName = 'first name required'
    this.setState({
      errors: errors,
      alert: true
    })  
  } else if (this.state.firstName === this.state.user.firstName) {
    errors.firstName = 'no changes'
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
      firstName: this.state.firstName,
    }
    await this.props.updateUserFirstName(update, this.state.user._id, this.props.history);
    setTimeout(() => this.SnackBar(), 500)
  } 
};

SnackBar = async () =>{
  if (this.props.auth.success) {
    this.setState({
      snackbarOpen: true
    })
    this.handleClose()
    this.componentDidMount()
  }
}

  render() {
    let firstName = this.state.user.firstName
  return (
    <React.Fragment>
      <span className="label">First Name:</span>
      <div className="settings-input">
        <TextField
          disabled
          fullWidth
          value={firstName}
          variant="outlined"
          style={{marginRight: '10px'}}
        />
      <Button variant="contained" disableElevation color="primary" style={{textTransform: 'capitalize'}} onClick={this.handleClickOpen}>Change</Button>
      </div>
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <form onSubmit={this.onSubmit}>
        <DialogTitle id="form-dialog-title">Change First Name</DialogTitle>
        {this.state.alert ? (
                      <div className="alert-box">
                          <p>{this.state.errors.firstName}</p>
                      </div>
                  ) : null} 
        <DialogContent>
          <TextField
            margin="dense"
            id="firstName"
            label="New First Name"
            type="text"
            fullWidth
            variant="outlined"
            onChange={this.onChange}
            error={this.state.errors.firstName}
            className={classnames("form-input", {
              invalid: this.state.errors.firstName
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

ChangeFirstName.propTypes = {
  updateUserFirstName: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(
  mapStateToProps,
  { updateUserFirstName }
)(withRouter(ChangeFirstName)));