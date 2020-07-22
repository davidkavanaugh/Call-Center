import React from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, TextField, Button  } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { AsYouType } from 'libphonenumber-js';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchResults from './SearchResults';
import { Link, withRouter } from 'react-router-dom';
import { findClient, clearSearch } from '../../actions/client.actions';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import BlockIcon from '@material-ui/icons/Block';

import './CallCenter.css'


class Clients extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            open: false,
            selectedDate: null,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            clients: []
         }
    }

    handleClickOpen = () => {
        this.setState({
            open: true
        })
    };
    
    handleClose = () => {
        this.setState({
            selectedDate: null,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            open: false
        })
        this.props.clearSearch()
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

    handleDateChange = (date) => {
        this.setState({
            selectedDate: date
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

    handleSearch = (e) => {
        e.preventDefault();
        const client = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            dob: this.state.selectedDate,
            callCenter: this.props.location.pathname.split('/').pop()
        }
        this.props.findClient(client)
    }

    handleClear = () => {
        this.setState({
            selectedDate: null,
            firstName: '',
            lastName: '',
            phoneNumber: ''  
        })
        this.props.clearSearch()
    }

    render() { 
        return ( 
            <React.Fragment>
                <IconButton className="new-call-button" onClick={this.handleClickOpen} style={{margin: '20px 20px', padding: '0px 0px', position: 'fixed', bottom: '0', right: '0'}}>
                        <PeopleAltIcon style={{fontSize: '1.5em', color: 'white', backgroundColor: '#3f51b5', padding: '10px 10px', borderRadius: '50%'}}/>
                        <div className="overlay"></div>
                </IconButton>
                <Dialog
                    fullWidth
                    maxWidth='sm'
                    open={this.state.open}
                    onClose={this.handleClose}
                >   
                    {this.props.client.clients.length > 0 ? 
                        null
                        :<DialogTitle>Find Client</DialogTitle>}
                    <DialogContent>
                        <form id="search" onSubmit={this.handleSearch}>
                            <div id="search-fields">
                                    <TextField 
                                        label="First"
                                        id="search-firstName"
                                        variant="outlined"
                                        size="small"
                                        margin="dense"
                                        value={this.state.firstName}
                                        onChange={this.handleFirstName}
                                        autoComplete="off"
                                        fullWidth
                                    />
                                    <TextField 
                                        label="Last"
                                        id="search-lastName"
                                        variant="outlined"
                                        size="small"
                                        margin="dense"
                                        value={this.state.lastName}
                                        onChange={this.handleLastName}
                                        autoComplete="off"
                                        fullWidth
                                    />
                                    <TextField 
                                        id="search-phoneNumber"
                                        label="Phone Number"
                                        placeholder="(xxx) xxx-xxxx"
                                        type="text"
                                        name="search-phoneNumber"
                                        variant="outlined"
                                        value={this.state.phoneNumber}
                                        margin="dense"
                                        onChange={this.handlePhoneNumber}
                                        autoComplete="off"
                                        fullWidth
                                    />
                                <div>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            inputVariant="outlined"
                                            format="MM/dd/yyyy"
                                            margin="dense"
                                            id="search-dob"
                                            label="Date of Birth"
                                            placeholder="mm/dd/yyyy"
                                            value={this.state.selectedDate}
                                            onChange={this.handleDateChange}
                                            autoComplete="off"
                                            KeyboardButtonProps={{
                                                'aria-label': 'select DOB',
                                            }}
                                            fullWidth
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                                </div>
                            <div id="search-buttons">
                                <Button onClick={this.handleSearch} type="submit" className='search-button' variant="contained" color="default" disableElevation>
                                    <SearchIcon/>
                                    <span style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                        <span>Search</span>
                                    </span>
                                </Button>
                                <Button onClick={this.handleClear} className='search-button' variant="contained" color="default" disableElevation>
                                    <ClearIcon />
                                    <span style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                        <span>Clear</span>
                                    </span>
                                </Button>
                                <Link to={`/call-center/new-client/${this.props.location.pathname.split('/').pop()}`}>
                                    <Button className='search-button' variant="contained" color="default" disableElevation>
                                        <PersonAddIcon />
                                        <span style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                            <span>Create New</span>
                                        </span>
                                    </Button>
                                </Link>
                                <Button disableElevation className="search-button" onClick={this.handleClose} color='default' style={{ textTransform: 'none' }} variant='outlined'>
                                    <BlockIcon />
                                    <span style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                        <span>Cancel</span>
                                    </span>
                                </Button>
                            </div>
                        </form>
                        {this.props.client.clients.length > 0 ? 
                        <SearchResults data={this.props.client.clients} />
                         : <div style={{height: '50px'}}></div>}
                    </DialogContent>
                </Dialog>
            </React.Fragment>
         );
    }
}
 
Clients.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    findClient: PropTypes.func.isRequired,
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
    { findClient, clearSearch }
  )(Clients));