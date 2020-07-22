import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Divider, TextField, Typography, IconButton } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import DeleteIcon from '@material-ui/icons/Delete';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import FontDownloadIcon from '@material-ui/icons/FontDownload';
import Answer from './Answer';

import { callCenterState } from '../../actions/call-center.actions';

import './CallScript.css'

class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state={ 
            queryEditorOpen: false,
            query: '',
            answerInput: '',
            answers: [],
            questionInput: null,
            callCenter: {},
            callScript: {},
            multipleChoice: true
         }
    }

    componentDidMount() {
        if (this.props.question.answers) {
            this.setState({
                query: this.props.question.query,
                callScript: this.props.callScript,
                callCenter: this.props.callCenter,
                answers: this.props.question.answers,   
                multipleChoice: this.props.question.multipleChoice 
            })
            this.props.callCenterState(this.state.callCenter)
        } else {
            this.setState({
                query: this.props.query,
                callScript: this.props.callScript,
                callCenter: this.props.callCenter,
                multipleChoice: this.props.question.multipleChoice
            })
            this.props.callCenterState(this.state.callCenter)
        }
    }

    enableQueryEditor = () => {
        this.setState({
            questionInput: this.props.question.query,
            queryEditorOpen: true
        })
    }

    disableQueryEditor = () => {
        if (this.state.questionInput) {
            this.setState({
                query: this.state.questionInput,
                queryEditorOpen: false,
                questionChanges: true
            })
            let callCenter = {...this.props.callCenter};
            let questions = this.props.callScript.questions;
            questions[this.props.id].query = this.state.questionInput;
            let callScript = this.props.callScript;
            callScript.questions = questions;
            this.props.callCenterState(callCenter)
        } else {
            this.setState({
                queryEditorOpen: false
            })
        }
    }

    handleQuery = (e) => {
        let callScript = this.state.callScript
        let callCenter = this.props.callCenter;
        if (e.target.value) {
            callScript.questions[this.props.id].query = e.target.value
            for (let [key] of Object.entries(callCenter.callScripts)) {
                if (callCenter.callScripts[key]._id === callScript._id) {
                    if (this.props.location.pathname.substring(45,61) === 'edit-call-script') {
                        callScript.updated = Date.now();
                        callScript.updatedBy = this.props.auth.user.id
                    }
                    callCenter.callScripts[key] = callScript
                    this.setState({
                        callCenter: callCenter,
                    })
                }
            }  
            this.setState({
                callScript: callScript,
                questionInput: e.target.value
            })   
        } else {    
            this.setState({
                callScript: callScript,
                questionInput: e.target.value
            })
        }
    }

    deleteQuestion = () => {
        if (this.props.location.pathname.substring(1,28) === 'call-center/new-call-script') {
            let callCenter = {...this.props.callCenter};
            let callScript = {...this.props.callScript};
            let questions = callScript.questions;
            questions.splice(this.props.id, 1)
            callScript.questions = questions;
            callCenter.callScripts[callCenter.callScripts.length-1] = callScript;
            this.props.callCenterState(callCenter)
        } else {
            let callCenter = {...this.state.callCenter};
            let callScript = {...this.state.callScript};
            let questions = callScript.questions;
            questions.splice(this.props.id, 1)
            callScript.questions = questions;
            callScript.updated = Date.now();
            callScript.updatedBy = this.props.auth.user.id
            for (let [key] of Object.entries(callCenter.callScripts)) {
                if (callCenter.callScripts[key]._id === callScript._id) {
                    callCenter.callScripts[key] = callScript
                    this.setState({
                        callCenter: callCenter
                    })
                    this.props.callCenterState(this.state.callCenter)
                }
            }
        }
    }

    switchFormat = () => {
        let callCenter = this.state.callCenter;
        let callScript = this.state.callScript;
        callScript.questions[this.props.id].multipleChoice = !this.state.multipleChoice;
        this.setState({
            multipleChoice: !this.state.multipleChoice,
            callScript: callScript
        })
        if (this.props.location.pathname.substring(45,61) === 'edit-call-script') {
            for (let [key] of Object.entries(callCenter.callScripts)) {
                if (callCenter.callScripts[key]._id === callScript._id) {
                    callCenter.callScripts[key].updated = Date.now();
                    callCenter.callScripts[key].updatedBy = this.props.auth.user.id;
                    this.setState({
                        callCenter: callCenter
                    })
                    this.props.callCenterState(this.state.callCenter)
                }
            }
        }
    }

    handleAnswerInput = (e) => {
        this.setState({
            answerInput: e.target.value
        })

    }

    submitAnswer = (e) => {
        e.preventDefault();

        if (this.state.answerInput) {
            let callScript = this.state.callScript;
            let answers = this.state.answers;
            answers.push(this.state.answerInput)
            callScript.questions[this.props.id].answers = answers;
            this.setState({
                answers: answers,
                answerInput: '',
                callScript: callScript
            })
            let callCenter = this.state.callCenter;
            callCenter.callScripts.forEach(callScript => {
                if (callScript._id === this.state.callScript._id) {
                    if (this.props.location.pathname.substring(45,61) === 'edit-call-script') {
                        callScript.updated = Date.now();
                        callScript.updatedBy = this.props.auth.user.id
                    }
                    this.props.callCenterState(callCenter)
                }
            })
        }
    }

    render() {
            return (
                <div id='question'>
                    <div id="question-row-1">
                        <div id="query">
                            <ClickAwayListener onClickAway={this.disableQueryEditor}>
                                {this.state.queryEditorOpen ? (
                                    <TextField
                                        margin="dense"
                                        id="query"
                                        name="query"
                                        type="text"
                                        label="Question"
                                        value={this.state.questionInput}
                                        onChange={this.handleQuery}
                                        variant="outlined"
                                        fullWidth
                                    />
                                ) : <Typography style={{width: '100%'}} key={this.props.key} component="h4" variant="h5" onClick={this.enableQueryEditor}>{this.props.question.query}</Typography>}
                            </ClickAwayListener>
                        </div>
                        <div id="switch-answers">
                            <IconButton className="action-button" onClick={this.switchFormat}>
                                    {this.state.multipleChoice ? 
                                    <FontDownloadIcon className="action-icon" style={{fontSize: '1.1em', borderRadius: '50%'}} />
                                    : <LibraryAddCheckIcon className="action-icon" style={{fontSize: '1.1em', borderRadius: '50%'}}/>}
                                    <div className="overlay"></div>
                            </IconButton>
                        </div>
                        <div id="delete">
                            <IconButton className="action-button" onClick={this.deleteQuestion}>
                                    <DeleteIcon className="action-icon" style={{fontSize: '1.1em', borderRadius: '50%'}}/>
                                    <div className="overlay"></div>
                            </IconButton>
                        </div>
                    </div>
                    <div id="question-row-2">
                    {this.props.question.answers ? this.props.question.answers.map((answer, key) => 
                        <div><Answer id={key} answer={answer} answers={this.props.question.answers} callScript={this.state.callScript} callCenter={this.state.callCenter} multipleChoice={this.props.question.multipleChoice}/></div>
                    )
                    : null}
                    <form id="answer-form" onSubmit={this.submitAnswer}>
                        <input
                            autoFocus
                            placeholder="add an answer"
                            margin="dense"
                            id="answer"
                            name="answer"
                            type="text"
                            value={this.state.answerInput}
                            onChange={this.handleAnswerInput}
                        />
                    </form>   
                    <Divider /> 
                    </div>
                </div>
            )
    }
}

Question.propTypes = {
    auth: PropTypes.object.isRequired,
    callCenterState: PropTypes.func.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default withRouter(connect(
    mapStateToProps,
    { callCenterState }
  )(Question));