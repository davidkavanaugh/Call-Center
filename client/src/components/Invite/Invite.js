import React from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Typography, Button } from '@material-ui/core';
import Spinner from '../Spinner/Spinner'
import axios from 'axios';
import './Invite.css';

class Invite extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            notification: [],
            callCenter: {},
            subscribed: false,
            loading: true
        }
    }

    componentDidMount = () => {
        axios.get('/api/users/' + this.props.auth.user.id)
            .then((res) => {
                let filtered = res.data[0].notifications.filter(notification => 
                    notification._id === this.props.location.pathname.split('/').pop())
                axios.get('/api/call-centers/call-center/' + filtered[0].re._id)
                    .then((res) => {
                        this.setState({
                            notifications: filtered[0],
                            callCenter: res.data
                        })
                        res.data.users.forEach(user => {
                            if (user.id === this.props.auth.user.id) {
                                this.setState({
                                    subscribed: true
                                })             
                            }               
                        })
                        let update = {
                            id: this.props.location.pathname.split('/').pop()
                        };
                        axios.post('/api/users/notifications/check/' + this.props.auth.user.id, update)
                            .then(res => {
                                this.setState({
                                    loading: false
                                })
                            })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
          this.componentDidMount();
        }
    }

    onAccept = () => {
        let update = {
            id: this.props.auth.user.id
        }
        axios.post('/api/call-centers/invitation/accept/'+ this.state.callCenter._id, update)
            .then(res => {
                console.log(res.data)
                window.location='/dashboard'
            });
    }

    render() { 
        if (this.state.loading) {
            return (<div style={{paddingTop: '100px'}}><Spinner /></div>)
        } else {
            let callCenter = this.state.callCenter;
            let subscribed = this.state.subscribed;
            if (!subscribed) {
                return ( 
                    <div id="invite">
                        <div id="invite-text">
                            <Typography component="h4" variant="h5">{callCenter.name}</Typography>
                            <Typography component="p" variant="p">{callCenter.about}</Typography>
                        </div>
                        <div id="invite-buttons" style={{display: 'flex', justifyContent:'flex-end'}}>
                            <Link to="/dashboard">
                                <Button style={{textTransform: 'none'}}>
                                    Ignore
                                </Button>
                            </Link>
                            <Button disableElevation color="primary" variant="contained" onClick={this.onAccept}>
                                Accept
                            </Button>
                        </div>
                    </div>
                )
            } else {
                return ( 
                    <div id="subscribed">
                        <span style={{marginRight: '5px'}}>You are already subscribed to</span><Typography component="h4" variant="h6">{callCenter.name}</Typography>
                    </div>
                )            
            }
    }
    }
}
 
Invite.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
  });
  
  export default withRouter(connect(
    mapStateToProps
  )(Invite));