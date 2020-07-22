import React from 'react';
import { List, Divider, ListItem } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import Spinner from '../../components/Spinner/Spinner';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

class ToEditor extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        callCenter: null,
        isAdmin: false
    }
}

componentDidMount() {
    axios.get('/api/call-centers/call-center/'+this.props.location.pathname.split('/').pop())
    .then(response => {
        this.setState({
          callCenter: response.data
        })
        for (let [key, value] of Object.entries(this.state.callCenter.users)) {
            if (value.id === this.props.auth.user.id) {
                if (value.isAdmin) {
                    this.setState({
                        isAdmin: true
                    })
                }
            } 
        }
    })
    .catch((error) => {
        console.log(error);
    })
}


render () {
    if (!this.state.callCenter && this.props.location.pathname.substring(0,13) === '/call-center/' && this.props.location.pathname.substring(38, 44) !== 'client'){
        return(
        <div>
            <React.Fragment>
                <Spinner />
            </React.Fragment>
        </div>
        )
    } else if (this.state.isAdmin && this.props.location.pathname.substring(0,13) === '/call-center/') {
            return(
                <div>
                    <List className="drawer-links" onClick={this.props.toggleDrawer}> 
                        <Link to={'/call-center/editor/' + this.state.callCenter._id}><ListItem className="navlink"><EditIcon style={{color: '#545454', paddingRight: '10px'}}/>Editor</ListItem></Link> 
                    </List>
                    <Divider />
                </div>  
            )              
     } else {
        return null
        }
    }
}

ToEditor.propTypes = {
    client: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    client: state.client,
    auth: state.auth,
  });
  
  export default withRouter(connect(
    mapStateToProps
  )(ToEditor));