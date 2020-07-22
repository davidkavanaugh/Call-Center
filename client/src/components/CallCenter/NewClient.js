import React from 'react';
import { withRouter } from 'react-router-dom';
import { newClient } from '../../actions/client.actions';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl,InputLabel } from '@material-ui/core';
import { AsYouType } from 'libphonenumber-js';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import Spinner from '../Spinner/Spinner';
import uss from './UnitedStates';
import './CallCenter.css';

class NewClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            firstName: '',
            lastName: '',
            dob: null,
            phoneNumber: '',
            email: '',
            address: {
                street: '',
                city: '',
                state: '',
                zip: ''
            },
            errors: {},
            alert: false,
            open: true
        }
    }

    cancel = () => {
        this.props.history.goBack();
    };

    handleFirstName = (event) => {
        this.setState({
            firstName: event.target.value
        })
    }

    handleLastName = (event) => {
        this.setState({
            lastName: event.target.value
        })
    }

    handleDob = (dob) => {
        this.setState({
            dob: dob
        })
    }

    handlePhoneNumber = (event) => {
        if (this.state.phoneNumber.charAt(0) !== '1') {
            if (this.state.phoneNumber.length < 14) {
                if (this.state.phoneNumber.length <= 5) {
                    this.setState({
                        phoneNumber: event.target.value
                    })
                } else {
                    let phone = new AsYouType('US').input(event.target.value);
                    this.setState({
                        phoneNumber: phone
                    })
                }
            } else {
                let longNumber = event.target.value.substring(0,14)
                let phone = new AsYouType('US').input(longNumber);
                this.setState({
                    phoneNumber: phone
                })
            }
        } else {
            this.setState({
                phoneNumber: event.target.value.charAt(1)
            })
        }
    }

    handleEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    validateEmail = () => {
        let errors = this.state.errors;
        if (!this.state.email) {
            return null
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email)) {
            errors.email = "invalid email address"
            this.setState({
                ...this.state,
                errors: errors,
                alert: true
            })  
        }
    }

    handleStreet =(event) => {
        let address = this.state.address;
        address.street = event.target.value;
        this.setState({
            ...this.state,
            address: address
        })
    }

    handleCity = (event) => {
        let address = this.state.address;
        address.city = event.target.value;
        this.setState({
            ...this.state, 
            address: address
        })
    }

    handleState = (event) =>{
        let address = this.state.address;
        address.state = event.target.value;
        this.setState({
            ...this.state,
            address: address
        })
    }

    handleZip = (event) => {
        let address = this.state.address;
        address.zip = event.target.value;
        this.setState({
            ...this.state,
            address: address
        })
    }

    onSubmit = async (event) => {
        event.preventDefault();
        await this.validateEmail(this.state.email)
        if (this.state.alert) {
            console.log(this.state.errors)
            this.setState({
                errors: {},
                alert: false
            })
        } else {
            const client = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                dob: this.state.dob,
                email: this.state.email,
                address: this.state.address,
                callCenter: this.props.location.pathname.split('/').pop()
            }
            await this.props.newClient(client)
            this.setState({
                open: false
            })
            setTimeout(() => this.props.history.push(`/call-center/${this.props.location.pathname.split('/').pop()}/client/${this.props.client.clients._id}`, { clients: this.props.client.clients, callCenter: this.props.location.pathname.split('/').pop() })
            , 1000)
        }
    }

    render() { 
        if (this.state.open) {
        return ( 
            <Dialog 
                open={this.state.open}
                fullWidth
                maxWidth='xs'
                onClose={this.cancel}
            >
                <DialogTitle>New Client</DialogTitle>
                <form onSubmit={this.onSubmit}>
                    <DialogContent>
                        <TextField 
                            autoFocus
                            label="First Name"
                            id="firstName"
                            variant="outlined"
                            margin="dense"
                            value={this.state.firstName}
                            onChange={this.handleFirstName}
                            autoComplete="off"
                            fullWidth
                            required
                        />
                        <TextField 
                            label="Last Name"
                            id="lastName"
                            variant="outlined"
                            margin="dense"
                            value={this.state.lastName}
                            onChange={this.handleLastName}
                            autoComplete="off"
                            fullWidth
                        />
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                inputVariant="outlined"
                                format="MM/dd/yyyy"
                                margin="dense"
                                id="dob"
                                label="Date of Birth"
                                placeholder="mm/dd/yyyy"
                                value={this.state.dob}
                                onChange={this.handleDob}
                                autoComplete="off"
                                KeyboardButtonProps={{
                                    'aria-label': 'select DOB',
                                }}
                                fullWidth
                            />
                        </MuiPickersUtilsProvider>
                        <TextField 
                            id="phoneNumber"
                            label="Phone Number"
                            placeholder="(xxx) xxx-xxxx"
                            type="text"
                            name="phoneNumber"
                            variant="outlined"
                            value={this.state.phoneNumber}
                            margin="dense"
                            onChange={this.handlePhoneNumber}
                            autoComplete="off"
                            fullWidth
                        />
                        <TextField 
                            label="Email Address"
                            id="email"
                            variant="outlined"
                            margin="dense"
                            value={this.state.email}
                            onChange={this.handleEmail}
                            autoComplete="off"
                            fullWidth
                        />

                        <TextField
                            label ="Street"
                            id="address"
                            variant="outlined"
                            margin="dense"
                            value={this.state.address.street}
                            onChange={this.handleStreet}
                            autoComplete="off"
                            fullWidth
                        />
                        <TextField
                                label ="City"
                                id="city"
                                variant="outlined"
                                margin="dense"
                                value={this.state.address.city}
                                onChange={this.handleCity}
                                autoComplete="off"
                                fullWidth
                        />
                        <div id="stateAndZip">
                            <FormControl style={{width: '100%', paddingRight: '1%'}}>
                                <InputLabel 
                                    id='state-label'
                                    style={{marginLeft: '14px', marginTop: '-1.5px'}}
                                    margin="dense"
                                >State</InputLabel>
                                <Select
                                    labelId="state-label"
                                    labelWidth={40}
                                    id="state"
                                    variant="outlined"
                                    value={this.state.address.state}
                                    onChange={this.handleState}
                                    margin="dense"
                                    style={{marginTop: '5px'}}
                                >   
                                    {uss.map((state, key) => {
                                        return <MenuItem key={key} value={state.abbreviation}>{state.abbreviation + ' -- ' + state.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Zipcode"
                                id="zip"
                                variant="outlined"
                                margin="dense"
                                value={this.state.address.zip}
                                onChange={this.handleZip}
                                autoComplete="off"
                                fullWidth
                            />
                        </div>
                        <DialogActions>
                            <Button onClick={this.cancel} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                Submit
                            </Button>
                        </DialogActions>                        
                    </DialogContent>
                </form>
            </Dialog>
        )} else return(<div style={{paddingTop: '100px'}}><Spinner /></div>);
    }
}
 
NewClient.propTypes = {
    newClient: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    client: state.client
  });
  
  export default withRouter(connect(
    mapStateToProps,
    { newClient }
  )(NewClient));