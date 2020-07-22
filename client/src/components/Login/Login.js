import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/auth.actions";
import classnames from "classnames";
import { Button, TextField, ClickAwayListener, Typography, InputAdornment } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Link, withRouter } from "react-router-dom";
import './Login.css';

class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {
        username: "",
        password: "",
        showPassword: false,
        alert: false,
        errors: {}
      };
    }

    componentDidMount = () => {
        // If logged in and user navigates to Register page, should redirect them to profile
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
                alert: true
            });
        }
    }

    handleClickAway = () => {
        this.setState({
            alert: false
        })
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value, alert: false });
    };

    handleClickShowPassword = () => {
        this.setState({ ...this.state, showPassword: !this.state.showPassword });
    };

    handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    isDisabled = () => {
        if (!this.state.username || !this.state.password) {
            return true
        } else {
            return false
        }
    }
    
    onSubmit = e => {
        e.preventDefault();

        const userData = {
            username: this.state.username.toLowerCase(),
            password: this.state.password
        };

        this.props.loginUser(userData);    

    };
    
render() {
    const { errors } = this.state;

return(
    <div id="login">
        <br />
        <Typography variant="h3" component="h1" style={{textAlign: 'center'}}>Call Center</Typography>
        <br />
        <form onSubmit={this.onSubmit}>    
            <TextField
                required
                autoFocus
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
                    invalid: errors.username || errors.userNotFound
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
                    invalid: errors.password || errors.passwordincorrect
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
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <ClickAwayListener onClickAway={this.handleClickAway}>
                    <React.Fragment>
                    <div style={{alignSelf: 'flex-end'}}>
                        <Link to="/register" style={{marginRight: '10px'}}>
                               Register
                        </Link>| 
                        <Button type="submit" color="primary" disabled={this.isDisabled()}>
                            Login
                        </Button>
                        <br /><br />
                    </div>
                    </React.Fragment>
                </ClickAwayListener>
            </div>
            {this.state.alert ? (
                        <div className="alert-box">
                            <p>{errors.username}</p>
                            <p>{errors.userNotFound}</p>
                            <p>{errors.password}</p>
                            <p>{errors.passwordincorrect}</p>
                        </div>
                    ) : <span className="alert-box-hidden"> </span>}    
        </form>
    </div>
)
};
};

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
    };

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default withRouter(connect(
    mapStateToProps,
    { loginUser }
)(Login));