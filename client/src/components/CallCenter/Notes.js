import React from 'react';
import { Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, 
    TextField, FormControl, MenuItem, Select, InputLabel } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import MaterialTable from 'material-table'
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { withRouter } from 'react-router-dom';
import { saveAlert, getClient, addNote } from '../../actions/client.actions';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from 'axios';
import './CallCenter.css'
import { uuid } from 'uuidv4';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

class Notes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            notes: [],
            alertInput: '',
            alertOpen: false,
            noteOpen: false,
            otherSubject: '',
            callScript: {},
            subject: ''
        }
    }

    componentDidMount = () => {
        this.getClient();
        if (this.props.client.notes) {
            let notes = this.props.client.notes;
            notes.forEach(note => {
                axios.get('/api/users/' + note.user)
                    .then((res, err) => {
                        note.user = res.data[0].username;
                        this.setState({
                            notes: notes
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                note.date = note.date.toString().substring(0,10);
            })
            this.setState({
                notes: notes
            })
        }
        if (this.props.client.alert) {
            this.setState({
                alertOpen: true,
                alertInput: this.props.client.alert
            })
        }
      
    
    }

    getClient = () => {
        let client = {
            id: this.props.clientId
        }
        this.props.getClient(client)
    }

    handleAlertOpen = () => {
        this.setState({
            alertOpen: true,
        })
    }

    handleAlertChanges = (e) => {
        this.setState({
            alertInput: e.target.value
        })
    }

    handleAlertClose = async () => {
        if (this.props.client.alert) {
            this.setState({
                alertInput: this.props.client.alert,
                alertOpen: false
            })
        } else {
            this.setState({
                alertInput: '',
                alertOpen: false
            })
        }
    }

    alert = () => {
        if (this.state.alertInput.length > 0) {
            return 'secondary'
        } else {
            return 'default'
        }
    }
    handleSaveAlert = () => {
        let client = this.props.client;
        client.alert = this.state.alertInput;
        let update = {
            client: client
        }
        this.props.saveAlert(update)
        this.getClient();
        setTimeout(() => {
            this.setState({
                alertOpen: false,
                alertInput: this.props.client.alert
            })
        }, 500)
    }

    closeNote = () => {
        this.setState({
            noteOpen: false,
            callScript: {},
            subject: '',
            otherSubject: '',
            otherSubjectOpen: false
        })
    }

    handleSubject = (e) => {       
        if (e.target.value === 'other') {
            this.setState({
                subject: 'other'
            })
        } else {
            this.setState({
                subject: '',
                callScript: e.target.value,
            })
        }
    }

    handleOtherSubject = (e) => {
        this.setState({
            otherSubject: e.target.value
        })
    }

    addNote = (e) => {
        e.preventDefault();
        let subject = '';

        if (this.state.callScript.title !== '') {
            if (this.state.subject === 'other') {
                subject = `Other -- ${this.state.otherSubject}`
            } else {
                subject = this.state.callScript.title;
            }
            
            let note = {
                subject: subject,
                content: {},
                date: new Date(),
                user: this.props.auth.user.id,
                _id: uuid()
            }
        
            axios
            .post('/api/clients/add-note/' + this.props.client._id, note)
            .then(res => {
                this.props.history.push(`/call-center/${this.props.callCenter.callCenter._id}/client/${res.data._id}/add-note/${note._id}`, { client: res.data, callCenter: this.props.callCenter.callCenter, note: note, callScript: this.state.callScript })
            })
            .catch(err => console.log(err))
        }
    }

    export = (data) => {
        let csvData = [];
        data.forEach(note => {
            let myNote = {
                date: '',
                lastName: '',
                firstName: '',
                subject: '',
                content: '',
                user: '',
                _id: ''
            };
            for (let [key, value] of Object.entries(note)) {
                if (key !== 'tableData') {
                    myNote[key] = value
                }
                myNote['firstName'] = this.props.client.firstName;
                myNote['lastName'] = this.props.client.lastName;
                myNote['content'] = JSON.stringify(note.content)
            }
            csvData.push(myNote)
            this.exportToCSV(csvData, `${myNote.date}_${myNote.lastName}_${myNote.firstName}_${myNote._id}`);
        })
    }

    exportToCSV = (csvData, fileName) => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    render() { 

        return ( 
            <div id="notes">
                <Grid container spacing={1}>
                        <Grid item xs={12} sm={12}>
                            <Button onClick={this.handleAlertOpen} fullWidth disableElevation variant="contained" color={this.alert()}><ErrorOutlineIcon /></Button>
                        </Grid>
                </Grid>
                <Dialog open={this.state.alertOpen} onClose={this.handleAlertClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Alerts
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                            value={this.state.alertInput}
                            onChange={this.handleAlertChanges}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.handleAlertClose}>Cancel</Button>
                        <Button color="primary" onClick={this.handleSaveAlert}>Save</Button>
                    </DialogActions>
                </Dialog>
                <MaterialTable
                    style={{marginTop: '22px', marginBottom: '25px'}}
                    title="Notes"
                    columns={[
                        { title: 'Date', field: 'date' },
                        { title: 'Subject', field: 'subject' },
                        { title: 'User', field: 'user' },
                    ]}
                    data={this.state.notes}        
                    options={{
                        selection: true,
                    }}
                    localization={{
                        toolbar: {
                            nRowsSelected: '{0} Note(s) Selected'
                        }
                    }}
                    onRowClick={((evt, note) => {
                        this.props.history.push(`${this.props.location.pathname}/note/${note._id}`, { note: note, client: this.props.client })
                    })}
                    actions={[
                        {
                            tooltip: 'Export to .csv',
                            icon: () => <OpenInNewIcon />,
                            onClick: (e, data) => this.export(data)
                        },
                        {
                            icon: 'add',
                            tooltip: 'New Note',
                            isFreeAction: true,
                            onClick: () => this.setState({ noteOpen: true })
                        }
                    ]}
                    />
                    <Dialog open={this.state.noteOpen} onClose={this.closeNote} maxWidth='sm' fullWidth>
                    <form onSubmit={this.addNote}>
                        <DialogTitle>New Note</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth>
                                <InputLabel 
                                    id='subject'
                                    style={{marginLeft: '14px', marginTop: '-8.5px'}}
                                    margin="dense"
                                >Subject</InputLabel>
                                <Select
                                    labelId="subject"
                                    labelWidth={55}
                                    id="subject"
                                    variant="outlined"
                                    value={this.state.callScript.subject}
                                    onChange={this.handleSubject}
                                    margin="dense"
                                >   
                                    {this.props.callCenter.callCenter.callScripts ? this.props.callCenter.callCenter.callScripts.map((callScript, key) => {
                                        return <MenuItem key={key} name={callScript.title} value={callScript}>{callScript.title}</MenuItem>
                                    }) : null}
                                    <MenuItem value={'other'}>Other</MenuItem>
                                </Select>
                                {this.state.subject === 'other' 
                                    ? <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={this.state.otherSubject}
                                        onChange={this.handleOtherSubject}
                                        style={{marginTop: '10px'}}
                                    /> 
                                    : null}
                            </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button color='secondary' onClick={this.closeNote} style={{textTransform: 'none'}}>
                            Cancel
                        </Button>
                        <Button color='primary' type="submit">
                            OK
                        </Button>
                    </DialogActions>
                    </form>
                    </Dialog>
            </div>
         );
    }
}
 
Notes.propTypes = {
    getClient: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    saveAlert: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    client: state.client.clients
  });
  
  export default withRouter(connect(
    mapStateToProps,
    { saveAlert, getClient, addNote }
  )(Notes));