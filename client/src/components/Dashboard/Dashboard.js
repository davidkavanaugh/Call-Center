import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import './Dashboard.css'

const CallCenters = props => {
    const formatDate = (oldDate) => {
      let newDate = oldDate.substring(5,7) + '/' + oldDate.substring(8,10) + '/' + oldDate.substring(0,4);
      return newDate
    }
    let callCenters = props.callCenters;
    
    return Object.entries(callCenters).map(([key, value]) => 
      <Link to={'call-center/' + callCenters[key]._id} key={`call-center ${key}`}>
        <div className='call-center'>
          <div className='company-logo'><img src={callCenters[key].img} alt='Company Logo' /></div>
          <div style={{marginLeft: '25px'}}>
              <Typography variant="h4" component="h4">{callCenters[key].name}</Typography>
              <div className="meta">created by <span className='created-by'>{callCenters[key].username}</span> on <span className='data'>{formatDate(callCenters[key].date)}</span></div>
          </div>
        </div>    
      </Link>  
    );
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      callCenters: null
    };
  }

  componentDidMount = async() => {
    // If logged out and user navigates to Dashboard page, should redirect them to login
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    } 
    else {
      await this.getUser()
      .then((res) => {
        this.setState({
          ...this.state,
          user: res.data[0]
        })
      })
      .catch(err => console.log(err))

      await this.getCallCenters()
      .then((res) => {
        let callCenters = res.data;
        let filtered = [];
        for (let [key, value] of Object.entries(callCenters)) {
          value.users.forEach(user => {
            if (user.id === this.props.auth.user.id) {
              filtered.push(value)
            }
          })
          this.setState({
            callCenters: filtered,
          })
        }
      })
      .catch(err => console.log(err))
      
      await this.getAuthor()
    }
    
  };

  getUser = async () => {
    const user = await axios('/api/users/'+this.props.auth.user.id);
    return user  
  };

  getCallCenters = async () => {
    const callCenters = await axios('/api/call-centers/');
    return callCenters
  }

  getAuthor = async () => {
    let callCenters = {...this.state.callCenters}

    const getUsername = (key, id) => {
      axios('/api/users/' + id)
      .then(res => {
        callCenters[key].username = res.data[0].username
        this.setState({ callCenters })
      })
      .catch((err) => console.log(err))
    }

    for (let [key] of Object.entries(callCenters)) {
      getUsername(key, callCenters[key].creator);
    }
  }
  
  
  componentDidUpdate(nextProps) {
    if (!nextProps.auth.isAuthenticated) {
      this.props.history.push("/login"); // push user to login
    }
  }

  render() {
      const user = this.state.user;
      if (user) {
      return (
        <div id="dashboard">
          <Helmet>
            <title>Call Center | Dashboard</title>
          </Helmet>
          <Typography variant="h3" component="h2" style={{textAlign: 'center', marginBottom: '10px'}}>Welcome {user.firstName}</Typography>
          <Typography variant="body1" component="h3" style={{textAlign: 'center'}}>
            Please select a Call Center
          </Typography>  

          {this.state.callCenters ? <CallCenters callCenters={this.state.callCenters}/> : <span></span>}
          <Link to="/create-call-center" className='to-create-call-center'>
            <Button variant="contained" color="primary" disableElevation style={{padding: '10px 15px'}}>
              <AddCircleIcon style={{paddingRight: '5px'}}/>New Call Center
            </Button>
          </Link>
        </div>
      )
      } else {
        return(<span></span>)
      }
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
)(Dashboard);