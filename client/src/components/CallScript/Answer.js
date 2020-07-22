import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { IconButton } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ClearIcon from '@material-ui/icons/Clear';
import { callCenterState } from '../../actions/call-center.actions';

import './CallScript.css'

class Answer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answerEditorOpen: true,
            callScript: {},
            answers: [],
            answer: '',
            input: '',
            alphabet: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        }
    }

    componentDidMount() {  
        this.setState({
            answer: this.props.answer,
            answers: this.props.answers,
            callScript: this.props.callScript
        })
    }
    enableAnswerEditor = () => {
        this.setState({
            input: this.state.answer,
            answerEditorOpen: true
        })
    }

    disableAnswerEditor = () => {
        if (this.state.input) {
            this.setState({
                answer: this.state.input,
                answerEditorOpen: false
            })
        }
        this.setState({
            answerEditorOpen: false
        })
    }

    deleteAnswer = () => {
        let answers = this.state.answers;
        answers.splice(this.state.answers.indexOf(this.props.answer), 1);
        this.setState({
            answers: answers
        })
        let callCenter = this.props.callCenter.callCenter;
        callCenter.callScripts.forEach(callScript => {
            if (callScript._id === this.props.callScript._id) {
                if (this.props.location.pathname.substring(45,61) === 'edit-call-script') {
                    callScript.updated = Date.now();
                    callScript.updatedBy = this.props.auth.user.id
                }
                this.props.callCenterState(callCenter)
            }
        })
    }

    render() {
        if (this.state.answer) {
            if (this.props.multipleChoice) {
                return(
                    <React.Fragment>
                        <div className="answer">
                            {this.state.alphabet[this.props.answers.indexOf(this.props.answer)]+'.) '}{this.props.answers[this.props.answers.indexOf(this.props.answer)]}
                            <IconButton className="action-button" onClick={this.deleteAnswer}>
                                        <ClearIcon className="action-icon" style={{fontSize: '20px', borderRadius: '50%'}}/>
                                        <div className="overlay"></div>
                            </IconButton>                       
                        </div>
                    </React.Fragment>
                )} else {
                    return(
                    <React.Fragment>
                        <div className="answer">
                            <span style={{display: 'flex', alignItems: 'center'}}><CheckBoxIcon style={{marginRight: '4px'}} />{this.props.answers[this.props.answers.indexOf(this.props.answer)]}</span>
                            <IconButton className="action-button" onClick={this.deleteAnswer}>
                                        <ClearIcon className="action-icon" style={{fontSize: '20px', borderRadius: '50%'}}/>
                                        <div className="overlay"></div>
                            </IconButton>                       
                        </div>
                    </React.Fragment> 
                    )                   
                }
        } else {
            return(
                null
            )
        }
    }    
}

Answer.propTypes = {
    auth: PropTypes.object.isRequired,
    callCenterState: PropTypes.func.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    callCenter: state.callCenter
  });
  
  export default withRouter(connect(
    mapStateToProps,
    { callCenterState }
  )(Answer));