import React from 'react';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUserLastName } from "../../actions/auth.actions";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, ClickAwayListener, Snackbar} from '@material-ui/core';
import axios from "axios";
import classnames from 'classnames';
import './Settings.css';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ChangeLastName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      errors: {},
      lastName: '',
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
    if (!this.state.lastName) {
      errors.lastName = 'last name required'
      this.setState({
        errors: errors,
        alert: true
      })  
    } else if (this.state.lastName === this.state.user.lastName) {
      errors.lastName = 'no changes'
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
        lastName: this.state.lastName,
      }
      await this.props.updateUserLastName(update, this.state.user._id, this.props.history);
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
    let lastName = this.state.user.lastName
  return (
    <React.Fragment>
      <span className="label">Last Name:</span>
      <div className="settings-input">
        <TextField
          disabled
          fullWidth
          value={lastName}
          variant="outlined"
          style={{marginRight: '10px'}}
        />
      <Button variant="contained" disableElevation color="primary" style={{textTransform: 'capitalize'}} onClick={this.handleClickOpen}>Change</Button>
      </div>
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <form onSubmit={this.onSubmit}>
        <DialogTitle id="form-dialog-title">Change Last Name</DialogTitle>
        {this.state.alert ? (
                      <div className="alert-box">
                          <p>{this.state.errors.lastName}</p>
                      </div>
                  ) : null} 
        <DialogContent>
          <TextField
            margin="dense"
            id="lastName"
            label="New First Name"
            type="text"
            fullWidth
            variant="outlined"
            onChange={this.onChange}
            error={this.state.errors.lastName}
            className={classnames("form-input", {
              invalid: this.state.errors.lastName
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

ChangeLastName.propTypes = {
  updateUserLastName: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(
  mapStateToProps,
  { updateUserLastName }
)(withRouter(ChangeLastName)));