import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from 'axios';
import { Dialog, DialogTitle, ClickAwayListener, DialogContent, TextField, Typography, DialogActions, Button, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { callCenterState } from '../../actions/call-center.actions';
import Question from './Question';

import './CallScript.css'

class NewCallScript extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            user: {},
            callCenter: {},
            callScript: {
                title: 'New Call Script',
                created: Date.now(),
                createdBy: this.props.auth.user.id,
                questions: []
            },
            titleEditorOpen: false,
            addQuestionOpen: false,
            input: ''
         }
    }

    componentDidMount = async () => {
        await this.getUser();
        await this.getCallCenter();
        let callCenter = this.state.callCenter;
        callCenter.callScripts.push(this.state.callScript)
        this.props.callCenterState(this.state.callCenter)
    }
    
    getUser = async () => {
        await axios.get('/api/users/' + this.props.auth.user.id)
            .then(res => {
                this.setState({
                    user: res.data[0]
                })
            })
            .catch((err) => console.log(err))
    }
    
    getCallCenter = async () => {
        await axios.get('/api/call-centers/call-center/' + this.props.location.pathname.split('/').pop())
            .then(res => {
                this.setState({
                    callCenter: res.data
                })
            })
            .catch((err) => console.log(err));
    }

    handleTitle = (e) => {
        let callScript = this.state.callScript
        if (e.target.value) {
            callScript.title = e.target.value  
            this.setState({
                callScript: callScript,
                input: e.target.value
            })   
        } else {
            callScript.title = 'New Call Script'    
            this.setState({
                callScript: callScript,
                input: e.target.value
            })
        }
    }

    enableTitleEditor = () => {
        this.setState({
            titleEditorOpen: true,
            input: this.state.callScript.title
        })
    }

    disableTitleEditor = () => {
        if (this.state.input) {
            let callScript = this.state.callScript
            callScript.title = this.state.input    
            this.setState({
                callScript: callScript,
                titleEditorOpen: false
            })
        } else {
            let callScript = this.state.callScript
            callScript.title = 'New Call Script'    
            this.setState({
                callScript: callScript,
                titleEditorOpen: false
            })            
        }
    }

    handleQuestionInput = (e) => {
        this.setState({ questionInput: e.target.value })
    }

    addQuestion = () => {
        this.setState({ addQuestionOpen: true })
    }

    closeAddQuestion = () => {
        this.setState({ addQuestionOpen: false, questionInput: '' })
    }
    
    submitQuestion = async (e) => {
        e.preventDefault();
        await this.getCallCenter();
        let callScript = this.state.callScript;
        let callCenter = this.state.callCenter;
        callCenter.callScripts.push(this.state.callScript)
        let questions = this.state.callScript.questions;
        let question = {
            multipleChoice: true,
            query: this.state.questionInput
        };
        questions.push(question);
        callScript.questions = questions;
        this.setState({
            callScript: callScript
        })
        this.props.callCenterState(this.state.callCenter)
        this.closeAddQuestion();
    }    

    render() { 
            let questions = this.state.callScript.questions;
            return ( 
                <div id="new-call-script">
                    <ClickAwayListener onClickAway={this.disableTitleEditor}>
                    <div id="call-script-title">
                        {this.state.titleEditorOpen ? (
                            <TextField
                                autoFocus
                                margin="dense"
                                id="title"
                                name="title"
                                type="text"
                                label="Title"
                                value={this.state.input}
                                onChange={this.handleTitle}
                                fullWidth
                                variant="outlined"
                            />
                        ) : <Typography component='h3' variant='h4' onClick={this.enableTitleEditor}>{this.state.callScript.title}</Typography>}
                    </div>
                    </ClickAwayListener>
    
                    {/* Questions */}
                    <div id="questions">
                        {questions ? questions.map((question, key) => 
                            <div><Question id={key} question={question} query={question.query} callScript={this.state.callScript} callCenter={this.state.callCenter} /></div>
                        ) : null}
                    </div>
                    {/* Add A Question */}
                    <IconButton className="add-question-button" onClick={this.addQuestion} style={{margin: '20px 20px', padding: '0px 0px', position: 'fixed', bottom: '0', right: '0'}}>
                        <AddIcon style={{fontSize: '1.5em', color: 'white', backgroundColor: '#3f51b5', padding: '10px 10px', borderRadius: '50%'}}/>
                        <div className="overlay"></div>
                    </IconButton>
                    <Dialog open={this.state.addQuestionOpen} onClose={this.closeAddQuestion} aria-labelledby="Add Question">
                        <DialogTitle id="Add Question">New Question</DialogTitle>
                        <DialogContent style={{width: '250px'}}>
                            <form onSubmit={this.submitQuestion}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="question"
                                    name="question"
                                    type="text"
                                    value={this.state.questionInput}
                                    onChange={this.handleQuestionInput}
                                    fullWidth
                                />
                            </form>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.closeAddQuestion} color="secondary">
                            Cancel
                        </Button>
                        <Button color="primary" onClick={this.submitQuestion}>
                            Submit
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
             );
    }
}
 
NewCallScript.propTypes = {
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
  )(NewCallScript));