import React from 'react'
import axios from 'axios'
import { Divider, Typography } from '@material-ui/core';
import Spinner from '../Spinner/Spinner';
import Clients from './Clients';

import './CallCenter.css'

class CallCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            callCenter: {}
        }
    }

    componentDidMount() {
        axios.get('/api/call-centers/call-center/'+this.props.match.params.id)
        .then(response => {
            this.setState({
              callCenter: response.data
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        const callCenter = this.state.callCenter
        if (!callCenter.img) {
            return(
                <div style={{paddingTop: '100px'}}>
                    <Spinner />
                </div>
            )
        } else
        return (
            <div id="call-center">
                <div id="call-center-header">
                    <img src={callCenter.img} alt="logo" id="logo"/>
                    <Typography component="h3" variant="h4" style={{textAlign: 'center', padding: '10px 10px'}}>{callCenter.name}</Typography>
                </div>
                <Divider />
                <div id="about-us">
                    {callCenter.about}
                </div>
                <Clients />
            </div>
        )
    }
}

export default CallCenter;