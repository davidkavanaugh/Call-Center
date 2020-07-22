import React from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUsername } from "../../actions/auth.actions";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@material-ui/core';
import axios from "axios";
import classnames from 'classnames';
import './Settings.css';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ChangeUsername extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      username: '',
      open: false,
      errors: {},
      alert: false,
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
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
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

  handleAlert = () => {
    console.log(this.state.alert)
  }
  onSubmit = (e) => {
    e.preventDefault();
    let errors = {};
    if (!this.state.username) {
      errors.username = 'username required'
      this.setState({
        errors: errors,
        alert: true
      })  
    } else if (this.state.username === this.state.user.username) {
        errors.username = 'no changes to username'
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
                errors: {}
              })
        
              let update = {
                username: this.state.username,
              }
            this.props.updateUsername(update, this.state.user._id, this.props.history);
            this.SnackBar()
          } 
        })
      }
    };

SnackBar = async () => {
    this.setState({
      snackbarOpen: true
    })
    this.handleClose()
    setTimeout(() => window.location.reload(), 2000)
}

  render() {
    let username = this.state.user.username
  return (
    <React.Fragment>
      <span className="label">Username:</span>
      
      <div className="settings-input">
        <TextField
          disabled
          fullWidth
          value={username}
          variant="outlined"
          style={{marginRight: '10px'}}
        />
      <Button variant="contained" disableElevation color="primary" style={{textTransform: 'capitalize'}} onClick={this.handleClickOpen}>Change</Button>
      </div>
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <form onSubmit={this.onSubmit} className="settings-form">
        <DialogTitle id="form-dialog-title">Change Username</DialogTitle>
        {this.state.alert ? (
                      <div className="alert-box">
                          <p>{this.state.errors.username}</p>
                      </div>
                  ) : null}  
        <DialogContent>
          <TextField
            margin="dense"
            id="username"
            label="New Username"
            type="text"
            fullWidth
            variant="outlined"
            onChange={this.onChange}
            error={this.state.errors.username}
            className={classnames("form-input", {
              invalid: this.state.errors.username
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
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

ChangeUsername.propTypes = {
  updateUsername: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(
  mapStateToProps,
  { updateUsername }
)(withRouter(ChangeUsername)));