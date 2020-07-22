import React from 'react';
import { withRouter } from 'react-router-dom';
import { callCenterState } from '../../actions/call-center.actions';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Typography, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios'
import Spinner from '../Spinner/Spinner';
import MaterialTable from 'material-table';
import AddIcon from '@material-ui/icons/Add';

import './Editor.css';

  class AddUsers extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        emailAddresses: '',

      }
    }

    handleChange = e => {
      this.setState({ 
        emailAddresses: e.target.value
      });
    };
  

    invite = () => {
      let arr = this.state.emailAddresses.split(',').map((item) => {
        return item.trim();
      });

      let title = this.props.data.name,
          message = 'would like you to join their Call Center.',
          from = this.props.user,
          callCenter = this.props.callCenter

      let notification = {
        title,
        message,
        from,
        callCenter
      }
      arr.forEach((emailAddress) => {
        axios.post('/api/users/notifications/' + emailAddress, notification)
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err))
      })

      this.handleClose();
    }

    handleClickOpen = () => {
      this.setState({
        open: true
      })
    };
  
    handleClose = () => {
      this.setState({
        open: false
      })
    };

    render() {
      return(
        <div id="add-user-div" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Tooltip title="Add" placement="bottom">
            <AddIcon className="add-user" onClick={this.handleClickOpen}/>
          </Tooltip>            
          <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Users</DialogTitle>
            <DialogContent style={{width: '250px'}}>
              <DialogContentText>
                Invite users via email address
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Seperate with a comma."
                type="email"
                fullWidth
                multiline
                rows={4}
                onChange={this.handleChange}
                value={this.state.emailAddresses}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={this.invite} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )
    }
  }

  class UsersTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        columns: [
          { title: 'First', field: 'firstName', editable: 'never' },
          { title: 'Last', field: 'lastName', editable: 'never' },
          { title: 'Username', field: 'username', editable: 'never' },
          { title: 'Admin', field: 'isAdmin', type: 'boolean' }
        ],
        data: [],
        emailAddresses: '',
        open: false
      }
      this.tableRef = React.createRef();
    }

    componentDidMount = () => {
      axios.get('/api/call-centers/call-center/'+this.props.data._id)
        .then((res) => {
          let users = res.data.users
          for (let [key, value] of Object.entries(users)) {
            axios.get('/api/users/' + value.id)
              .then((res) => {
                users[key].firstName = res.data[0].firstName;
                users[key].lastName = res.data[0].lastName;
                users[key].username = res.data[0].username;
                this.setState({
                  data: users
                })
              })
          }
        })
        .catch((err) => console.log(err))
    }
  
    render() {
      return (
        <div id="users">
          <AddUsers data={this.props.data} user={this.props.user} callCenter={this.props.callCenter} />
          <MaterialTable
            title="Users"
            tableRef={this.tableRef}
            columns={this.state.columns}
            data={this.state.data}    
            editable={{
              onRowAdd: () => {
                console.log('add user')
              },
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    {
                      const data = this.state.data;
                      const index = data.indexOf(oldData);
                      data[index] = newData;  
                      axios.post('/api/call-centers/edit/users/'+ this.props.data._id, newData)
                          .then(res => console.log(res.data));             
                    }
                    resolve()
                    this.componentDidMount();
                  }, 1000)
                }),
            }}
          />
        </div>
      )
    }
  } 


class QuestionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callCenter: {},
      callScripts: [],
      user: {}
    }
  }

componentDidMount = async () => {
  await this.getUser();
  await this.getCallCenter();
  await this.getCallScripts();
}

getUser = async () => {
  await axios.get('/api/users/' + this.props.userId)
    .then(res => {
      this.setState({
        user: res.data[0]
      })
    })
    .catch((err) => console.log(err))
}

getCallCenter = async () => {
  this.setState({
    callCenter: this.props.callCenter
  })
}

getCallScripts = async () => {
  let callScripts = this.props.callCenter.callScripts
  for (let [key, value] of Object.entries(callScripts)) {
    axios.get('/api/users/' + value.createdBy)
      .then((res) => {
        callScripts[key].createdBy = res.data[0].username;
        callScripts[key].created = callScripts[key].created.substring(0, 10);
        if (callScripts[key].updated) {
          callScripts[key].updated = callScripts[key].updated.substring(0, 10)
          axios.get('/api/users/' + callScripts[key].updatedBy)
            .then((res) => {
              callScripts[key].updatedBy = res.data[0].username
              this.setState({
                callScripts: callScripts
              })
            })
            .catch(err => console.log(err))
        } else {
          this.setState({
            callScripts: callScripts
          })
        }
      })
      .catch(err => console.log(err))
  }  
}

addCallScript = () => {
  window.location=`/call-center/new-call-script/${this.state.callCenter._id}`
}

render() {
    return (
      <div id="editor">
        <div id="add-user-div" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Tooltip title="Add" placement="bottom">
              <AddIcon className="add-user" onClick={this.addCallScript}/>
            </Tooltip>
        </div>
      <MaterialTable
        columns={[
          { title: 'Title', field: 'title' },
          { title: 'Created', field: 'created' },
          { title: 'Created By', field: 'createdBy' },
          { title: 'Updated', field: 'updated' },
          { title: 'Updated By', field: 'updatedBy' },
        ]}
        data={this.state.callScripts}
        editable={{
          onRowAdd: () => {
            console.log('add call-script')
          }}}
        title="Call Scripts"
        onRowClick={(event, rowData, togglePanel) => window.location="/call-center/editor/" + this.state.callCenter._id + "/edit-call-script/" + rowData._id}
      />
      </div>
    )
  }
}

class UpdateCallCenterName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      alert: false,
      errors: {},
      nameDialogOpen: false,
    }
  }

handleInput = (e) => {
    this.setState ({
        input: e.target.value,
        alert: false,
        errors: {}
    })
}

openNameDialog = () => {
    this.setState({
        nameDialogOpen: true,
        input: this.props.callCenter.name
    })
}

closeNameDialog = () => {
    this.setState({
        nameDialogOpen: false,
        alert: false,
        errors: {}
    })
}

handleName = (event) => {
    event.preventDefault();
    let callCenter = this.props.callCenter;
    callCenter.name = this.state.input
    this.setState({
        newName: this.state.input,
        callCenter: callCenter,
        nameDialogOpen: false
    })

    this.props.callCenterState(callCenter);
}

  render() {
    const callCenter = this.props.callCenter
    return(
      <React.Fragment>
          {this.state.newName ? 
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Typography component="h3" variant="h4" style={{textAlign: 'center', padding: '10px 10px'}}>{this.state.newName}</Typography>
                <EditIcon className="edit-icon" onClick={this.openNameDialog}/>
            </div>
          :
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Typography component="h3" variant="h4" style={{textAlign: 'center', padding: '10px 10px'}}>{callCenter.name}</Typography>
                <EditIcon className="edit-icon" onClick={this.openNameDialog}/>
            </div>
          }
        <Dialog open={this.state.nameDialogOpen} onClose={this.closeNameDialog} aria-labelledby="form-dialog-title">
          <form onSubmit={this.handleName}>
          <DialogTitle id="form-dialog-title">Edit Name</DialogTitle>
          <DialogContent style={{width: '235px'}}>
              <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label='Edit Name'
                  type="text"
                  value={this.state.input}
                  onChange={this.handleInput}
                  fullWidth
              />
          </DialogContent>
          <DialogActions>
          <Button onClick={this.closeNameDialog} color="secondary">
              Cancel
          </Button>
          <Button type="submit" color="primary">
              Submit
          </Button>
          </DialogActions>
          </form>
        </Dialog>
      </React.Fragment>
    )
  }
}

class UpdateDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      input: '',
      alert: false,
      errors: {},
      descriptionDialogOpen: false,

    }
  }

  handleInput = (e) => {
    this.setState ({
        input: e.target.value,
        alert: false,
        errors: {}
    })
  }

  openDescriptionDialog = () => {
      this.setState({
          descriptionDialogOpen: true,
          input: this.props.callCenter.about
      })
  }

  closeDescriptionDialog = () => {
      this.setState({
          descriptionDialogOpen: false,
          alert: false,
          errors: {}
      })
  }

  handleDescription = (event) => {
      event.preventDefault();
      let callCenter = this.props.callCenter;
      callCenter.about = this.state.input
      this.setState({
          newDescription: this.state.input,
          callCenter: callCenter,
          descriptionDialogOpen: false,
      })
      this.props.callCenterState(callCenter);
  }

  render() {
    const callCenter = this.props.callCenter;
    return(
      <div style={{display: 'flex', alignItems: 'center'}}>
        {
            callCenter.about ? 
                <div id="about-us-editor">
                    {callCenter.about}
                    <EditIcon className="edit-icon" onClick={this.openDescriptionDialog}/>
                </div>
            : 
                <div id="about-us-editor">
                    <i>(Description)</i>
                    <EditIcon className="edit-icon" onClick={this.openDescriptionDialog}/>
                </div>
        }

        <Dialog open={this.state.descriptionDialogOpen} onClose={this.closeDescriptionDialog} aria-labelledby="form-dialog-title">
            <form onSubmit={this.handleDescription}>
                <DialogTitle id="form-dialog-title">Change Description</DialogTitle>
                <DialogContent style={{width: '250px'}}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="about"
                        name="about"
                        label='Edit Description'
                        type="text"
                        value={this.state.input}
                        onChange={this.handleInput}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={this.closeDescriptionDialog} color="secondary">
                    Cancel
                </Button>
                <Button type="submit" color="primary">
                    Submit
                </Button>
                </DialogActions>
            </form>
        </Dialog>
      </div>
    )
  }
}

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            input: '',
            callCenter: {},
            uploadedFile: {},
            newName: null,
            isAdmin: null,
            errors: {},
            alert: false, 
            nameDialogOpen: false,
            descriptionDialogOpen: false
         }
        
    }

    componentDidMount() {
        axios.get('/api/call-centers/call-center/'+this.props.location.pathname.split('/').pop())
        .then(response => {
            this.setState({
              callCenter: response.data
            })
            for (let [key, value] of Object.entries(this.state.callCenter.users)) {
                if (value.username === this.props.auth.user.username) {
                    if (value.isAdmin) {
                        this.setState({
                            isAdmin: true
                        })
                    } else {
                        this.props.history.push('/dashboard')
                    }
                }
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    handleImgSelect = async e => {
        e.preventDefault();
        let errors = {}
    
        this.setState({ 
          errors: {},
          alert: false,
          file: e.target.files[0],
          fileName: e.target.files[0].name
         });
    
        const formData = new FormData();
        formData.append('logo', e.target.files[0]);
        let extension = e.target.files[0].name.toLowerCase().split('.').pop();
    
        if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
          try {
            const res = await axios.post('/api/call-centers/img-upload', formData, {
              headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US, en;q=0.8',
                'enctype': 'multipart/form-data',
                'Content-Type': `multipart/form-data`
              }
            });
      
            const { fileName, filePath } = res.data;
            setTimeout(() => {
                this.setState({ uploadedFile: { fileName, filePath } })
                let callCenter = this.state.callCenter;
                callCenter.img = this.state.uploadedFile.filePath
        
                this.props.callCenterState(callCenter);
            }, 700)


          } catch (err) {
            if (err.response.status === 500) {
              errors.img = 'There was a problem with the server'
              this.setState({ 
                errors: errors,
                alert: true
               })
            } else {
              errors.img = err.response.data;
              this.setState({ errors: errors, alert: true })
            }
          }
        } else {
          errors.img = 'image must be .png or .jpeg/jpg'
          this.setState({
            errors: errors,
            alert: true
          })
        }
      };

    render() {
        const callCenter = this.state.callCenter
        if (this.state.alert) {
          alert(this.state.errors.img)
        }
        if (!callCenter.img) {
            return(
                <div style={{paddingTop: '100px'}}>
                    <Spinner />
                </div>
            )
        } else
        return (
            <div id="call-center-editor">
                <div id="call-center-editor-header">
                    
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {this.state.uploadedFile.filePath ? (
                        <img src={this.state.uploadedFile.filePath} alt='logo' id="logo-editor" />
                        ) : 
                        <img src={callCenter.img} alt="logo" id="logo-editor"/>}
                      
                        <div>
                            <input
                                type='file'
                                className='hidden'
                                accept="image/*"
                                id='logo'
                                name="logo"
                                onChange={this.handleImgSelect}
                            />
                                <label htmlFor='logo' className="edit-icon">
                                    <EditIcon style={{cursor: 'pointer'}}/>
                                </label>
                        </div>
                    </div>
                    <UpdateCallCenterName callCenter={this.state.callCenter} callCenterState={this.props.callCenterState}/>
                </div>
                <Divider />
                <UpdateDescription callCenter={this.state.callCenter} callCenterState={this.props.callCenterState}/>
                <QuestionsTable callCenter={this.state.callCenter} userId={this.props.auth.user.id} />
                <br /><br />
                <UsersTable data={this.state.callCenter} user={this.props.auth.user.id} callCenter={this.state.callCenter} />

            </div>
        )
    }
}
 
Editor.propTypes = {
    callCenterState: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    callCenter: state.callCenter
  });
  
  export default withRouter(connect(
    mapStateToProps,
    { callCenterState }
  )(Editor));