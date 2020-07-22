import React from 'react';
import { withRouter } from 'react-router-dom';
import { clearSearch, updateClient, getClient } from '../../actions/client.actions';
import { getCallCenter } from '../../actions/call-center.actions';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { TextField, Grid, ClickAwayListener, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { AsYouType } from 'libphonenumber-js';
import Notes from './Notes';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Spinner from '../Spinner/Spinner'
import uss from './UnitedStates';



class Client extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            client: { },
            isLoading: true
         }
    }

    componentDidMount = () => {
        let client = {
            id: this.props.location.state.clients._id
        }
        this.props.getClient(client);
        setTimeout(() => 
            this.setState({
                client: this.props.client.clients
            })
        ,1000)

        setTimeout(() => {
            this.props.getCallCenter(this.props.location.state.callCenter)
        }, 1500)

        setTimeout(() => {
            this.setState({
                isLoading: false
            })
        }, 2000)
    }


    handleFirstName = (e) => {
        let client = this.state.client;
        client.firstName = e.target.value
        this.setState({
            client: client
        })
    }

    handleLastName = (e) => {
        let client = this.state.client;
        client.lastName = e.target.value
        this.setState({
            client: client
        })
    }

    handlePhoneNumber = (event) => {
        let client = this.state.client;
        client.phoneNumber = event.target.value;
        this.setState({
            client: client
        })
        if (this.state.client.phoneNumber.charAt(0) !== '1') {
            if (this.state.client.phoneNumber.length < 14) {
                if (this.state.client.phoneNumber.length <= 5) {
                    client.phoneNumber = event.target.value
                    this.setState({
                        client: client
                    })
                } else {
                    client.phoneNumber = new AsYouType('US').input(event.target.value);
                    this.setState({
                        client: client
                    })
                }
            } else {
                let longNumber = event.target.value.substring(0,14)
                client.phoneNumber = new AsYouType('US').input(longNumber);
                this.setState({
                    client: client
                })
            }
        } else {
            client.phoneNumber = event.target.value.charAt(1);
            this.setState({
                client: client
            })
        }
    }    

    handleDob = (dob) => {
        let client = this.state.client;
        client.dob = dob
        this.setState({
            client: client
        })
    }

    handleEmail = (e) => {
        let client = this.state.client;
        client.email = e.target.value;
        this.setState({
            client: client
        })
    }

    handleStreet = (e) => {
        let client = this.state.client;
        client.address.street = e.target.value;
        this.setState({
            client: client
        })
    }

    handleCity = (e) => {
        let client = this.state.client;
        client.address.city = e.target.value;
        this.setState({
            client: client
        })
    }

    handleState = (e) => {
        let client = this.state.client;
        client.address.state = e.target.value;
        this.setState({
            client: client
        })
    }

    handleZip = (e) => {
        let client = this.state.client;
        client.address.zip = e.target.value;
        this.setState({
            client: client
        })
    }

    save = async () => {
        let client = this.state.client
        let update = {};
        for (let [key, value] of Object.entries(client)) {
            if (client[key]) {
                update[key] = value
            }
        }
        await this.props.updateClient(update);
    }

    render() { 
        if (this.state.isLoading) {
            return(
                <div style={{paddingTop: '100px'}}>
                    <Spinner />
                </div>
            )
        } else {
            return ( 
                <React.Fragment>
                    <div id="client-demographics">
                        <ClickAwayListener onClickAway={this.save}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        label="First Name"
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth
                                        value={this.state.client.firstName}
                                        onChange={this.handleFirstName}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        label="Last Name"
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth
                                        value={this.state.client.lastName}
                                        onChange={this.handleLastName}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email Address"
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth
                                        value={this.state.client.email}
                                        onChange={this.handleEmail}
                                        autoComplete="off"
                                    /> 
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField 
                                        label="Phone Number"
                                        placeholder="(xxx) xxx-xxxx"
                                        variant="outlined"
                                        value={this.state.client.phoneNumber}
                                        margin="dense"
                                        onChange={this.handlePhoneNumber}
                                        autoComplete="off"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            inputVariant="outlined"
                                            format="MM/dd/yyyy"
                                            margin="dense"
                                            label="Date of Birth"
                                            placeholder="mm/dd/yyyy"
                                            value={this.state.client.dob ? this.state.client.dob : null}
                                            onChange={this.handleDob}
                                            autoComplete="off"
                                            KeyboardButtonProps={{
                                                'aria-label': 'select DOB',
                                            }}
                                            fullWidth
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        label="Street Address"
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth
                                        value={this.state.client.address.street}
                                        onChange={this.handleStreet}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="City"
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth
                                        value={this.state.client.address.city}
                                        onChange={this.handleCity}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControl fullWidth style={{marginTop: '8.5px'}}>
                                        <InputLabel 
                                            id='state-label'
                                            style={{marginLeft: '14px', marginTop: '-8.5px'}}
                                            margin="dense"
                                        >State</InputLabel>
                                        <Select
                                            labelId="state-label"
                                            labelWidth={40}
                                            id="state"
                                            variant="outlined"
                                            value={this.state.client.address.state}
                                            onChange={this.handleState}
                                            margin="dense"
                                        >   
                                            {uss.map((state, key) => {
                                                return <MenuItem key={key} value={state.abbreviation}>{state.abbreviation + ' -- ' + state.name}</MenuItem>
                                            })}
                                        </Select>
                                </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        label="Zipcode"
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth
                                        value={this.state.client.address.zip}
                                        onChange={this.handleZip}
                                        autoComplete="off"
                                    />
                                </Grid>
                            </Grid>
                        </ClickAwayListener>
                    </div>
                    <Notes clientId={this.state.client._id} callCenter={this.props.callCenter} />
                </React.Fragment>
             );
        }
    }
}
 
Client.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    getCallCenter: PropTypes.func.isRequired,
    getClient: PropTypes.func.isRequired,
    updateClient: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    callCenter: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    client: state.client,
    callCenter: state.callCenter
  });
  
  export default withRouter(connect(
    mapStateToProps,
    { clearSearch, getCallCenter, updateClient, getClient }
  )(Client));