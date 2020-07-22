import React from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from 'axios';
import { TextField, Typography , ClickAwayListener, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Question from './Question';
import { callCenterState } from '../../actions/call-center.actions';
import './CallScript.css'

class EditCallScript extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            callCenter: {},
            callScript: {},
            titleInput: '',
            titleEditorOpen: false
         }
    }

    componentDidMount = async () => {
        await this.getCallCenter();
        this.state.callCenter.callScripts.forEach(callScript => {
            if (callScript._id === this.props.location.pathname.substring(62,86)) {
                this.setState({
                    callScript: callScript
                })
                this.props.callCenterState(this.state.callCenter)
            }
        })
    }

    getCallCenter = async () => {
        await axios.get('/api/call-centers/call-center/'+ this.props.location.pathname.substring(20,44))
            .then((res) => {
                this.setState({
                    callCenter: res.data
                })
            })
            .catch((err) => console.log(err))
    }

    handleTitle = (e) => {
        let callScript = this.state.callScript
        if (e.target.value) {
            callScript.title = e.target.value  
            callScript.updated = Date.now();
            callScript.updatedBy = this.props.auth.user.id
            this.setState({
                callScript: callScript,
                titleInput: e.target.value
            })   
        } else {    
            this.setState({
                callScript: callScript,
                titleInput: e.target.value
            })
        }
    }

    enableTitleEditor = () => {
        this.setState({
            titleEditorOpen: true,
            titleInput: this.state.callScript.title
        })
    }

    disableTitleEditor = () => {
        if (this.state.titleInput) {
            let callScript = this.state.callScript
            callScript.title = this.state.titleInput    
            callScript.updated = Date.now();
            callScript.updatedBy = this.props.auth.user.id
            this.setState({
                callScript: callScript
            })
        }
        this.setState({
            titleEditorOpen: false
        })
    }
    handleQuestionInput = (e) => {
        this.setState({ questionInput: e.target.value })
        let callScript = this.state.callScript;
        callScript.updated = Date.now();
        callScript.updatedBy = this.props.auth.user.id
        this.setState({
            callScript: callScript
        })
    }

    addQuestion = () => {
        this.setState({ addQuestionOpen: true })
    }

    closeAddQuestion = () => {
        this.setState({ addQuestionOpen: false, questionInput: '' })
        let callScript = this.state.callScript;
        callScript.updated = Date.now();
        callScript.updatedBy = this.props.auth.user.id
        this.setState({
            callScript: callScript
        })
    }

    submitQuestion = async (e) => {
        e.preventDefault();
        await this.getCallCenter();
        let callCenter = this.state.callCenter;
        let questions = this.state.callScript.questions;
        let question = {
            multipleChoice: true,
            query: this.state.questionInput
        };
            questions.push(question);
        let callScript = this.state.callScript;
            callScript.questions = questions;
            callScript.updated = Date.now();
            callScript.updatedBy = this.props.auth.user.id
            callScript.questions = questions;
        this.setState({
            callScript: callScript
        })
        for (let [key] of Object.entries(callCenter.callScripts)) {
            if (callCenter.callScripts[key]._id === this.state.callScript._id) {
                callCenter.callScripts[key] = this.state.callScript
                this.setState({
                    callCenter: callCenter
                })
            }
        }
        this.props.callCenterState(this.state.callCenter)
        this.closeAddQuestion();
    }        
     

    render() { 
        return ( 
            <div id="edit-call-script">
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
                                value={this.state.titleInput}
                                onChange={this.handleTitle}
                                fullWidth
                                variant="outlined"
                            />
                        ) : <Typography component='h3' variant='h4' onClick={this.enableTitleEditor}>{this.state.callScript.title}</Typography>}
                    </div>
                </ClickAwayListener>
                
                {/* Questions */}
                <div id="questions">
                        {this.state.callScript.questions ? this.state.callScript.questions.map((question, key) => 
                            <div><Question id={key} question={question} callScript={this.state.callScript} callCenter={this.state.callCenter}/></div>
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
 
EditCallScript.propTypes = {
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
  )(EditCallScript));