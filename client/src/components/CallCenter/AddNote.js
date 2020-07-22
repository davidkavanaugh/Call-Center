import React from 'react';
import { Typography, TextField, RadioGroup, FormGroup, Checkbox, FormControlLabel, Radio } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { saveNote } from '../../actions/client.actions';
import { connect } from "react-redux";
import PropTypes from "prop-types";

class AddNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            client: {
                firstName: '',
                lastName: ''
            },
            note: {},
            callCenter: {},
            callScript: {},
            additionalNotes: '' ,
            rows: ''        }
    }

    componentDidMount = () => {
        if (this.props.location.state.callScript) {
            let note = this.props.location.state.note;
            let questions = [];
            if (this.props.location.state.callScript.questions) {
                this.props.location.state.callScript.questions.forEach(question => {
                    questions.push(question)
                })
                note.content.questions = questions;
            }
            
            this.setState({
                callScript: this.props.location.state.callScript,
                client: this.props.location.state.client,
                callCenter: this.props.location.state.callCenter,
                note: note,
                rows: 10
            })
        } else {
            this.setState({
                client: this.props.location.state.client,
                callCenter: this.props.location.state.callCenter,
                note: this.props.location.state.note,
                rows: 20
            })
        }
    }

    handleAdditionalNotes = (e) => {
        let note = this.state.note;
        note.content.additionalNotes = e.target.value;
        this.setState({
            note: note,
            additionalNotes: e.target.value
        })

    }

    handleRadio = (answer, questionKey) => {
        let note = this.state.note;
        let questions = note.content.questions;
        questions[questionKey].selections = [answer];
        this.setState({
            note: note
        })
        this.handleSave();
    }

    handleCheckBox = (answer, questionKey) => {
        let note = this.state.note;
        let questions = note.content.questions;
        if (questions[questionKey].selections) {
            if (questions[questionKey].selections.indexOf(answer) === -1) {
                questions[questionKey].selections.push(answer) 
            } else {
                questions[questionKey].selections.splice(questions[questionKey].selections.indexOf(answer), 1)
            }
        } else {
            questions[questionKey].selections = [];
            questions[questionKey].selections.push(answer)
        }
        note.content.questions = questions;
        this.setState({
            note: note
        })

        this.handleSave();
    }

    handleOtherAnswer = (e, questionKey) => {
        let note = this.state.note;
        let questions = note.content.questions;
        questions[questionKey].otherAnswer = e.target.value;
        note.content.questions = questions;
        this.setState({
            note: note
        })
    }

    handleSave = () => {
        let data = {
            note: this.state.note,
            clientId: this.state.client._id
        }
        this.props.saveNote(data)
    }

    render() { 
        const client = this.state.client;


// Note With CallScript
    if (Object.keys(this.state.callScript).length > 0) {
        return(
            <div id="add-note">
                <div className="header">
                    <Typography component='h3' variant='h5'>
                        {`${this.props.location.state.note.subject}`}
                    </Typography>
                    <Typography component='h4' variant='h6'>
                        {`${client.firstName} ${client.lastName}`}
                    </Typography>
                </div>
                <div id="QnA">
                    {this.props.location.state.note.content.questions.map((question, questionKey) => {
                        return(
                                <div>
                                        <div className="query">
                                            <Typography component="h5" variant='h6'>
                                                {question.query}
                                            </Typography>
                                        </div>
                                    {question.answers ?
                                        question.multipleChoice ?
                                                <RadioGroup>
                                                    {question.answers.map((answer, answerKey) => {
                                                        return(
                                                                <FormControlLabel
                                                                    control={
                                                                        <Radio 
                                                                            onChange={() => this.handleRadio(answer, questionKey)}
                                                                            key={answerKey} name={answer} 
                                                                            value={answer} 
                                                                        />}
                                                                    label={answer}
                                                                />
                                                        )
                                                    })}
                                                    <TextField
                                                        label="Other"
                                                        variant="outlined"
                                                        margin="dense"
                                                        fullWidth
                                                        value={question.otherAnswer}
                                                        onBlur={this.handleSave}
                                                        onChange={(e) => this.handleOtherAnswer(e, questionKey)}
                                                    />
                                                </RadioGroup>
                                            : 
                                        
                                                <FormGroup>
                                                    {question.answers.map((answer, answerKey) => {
                                                        return(
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox 
                                                                            key={answerKey} name={answer} 
                                                                            value={answer}
                                                                            onChange={() => this.handleCheckBox(answer, questionKey)}
                                                                        />}
                                                                    label={answer}
                                                                />   
                                                        )
                                                    })}
                                                    <TextField 
                                                        label="Other"
                                                        variant="outlined"
                                                        margin="dense"
                                                        fullWidth
                                                        onBlur={this.handleSave}
                                                        value={question.otherAnswer}
                                                        onChange={(e) => this.handleOtherAnswer(e, questionKey)}
                                                    />
                                                </FormGroup>
                                            : 
                                                <TextField 
                                                label="Type an Answer"
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                                onBlur={this.handleSave}
                                                value={question.otherAnswer}
                                                onChange={(e) => this.handleOtherAnswer(e, questionKey)}
                                            />
                                            }
                                </div>
                        )}
                    )}
                </div>
                <div id="notes">
                        <TextField
                            label="Notes"
                            variant="outlined"
                            value={this.state.additionalNotes}
                            onChange={this.handleAdditionalNotes}
                            onBlur={this.handleSave}
                            multiline
                            rows={this.state.rows}
                            fullWidth
                        />
                </div>
            </div>
        )
    }

// Note Without Call Script
    else {
        return(
            <div id="add-note">
                <div className="header">
                    <Typography component='h3' variant='h5'>
                        {`${this.props.location.state.note.subject}`}
                    </Typography>
                    <Typography component='h4' variant='h6'>
                        {`${client.firstName} ${client.lastName}`}
                    </Typography>
                </div>
                <div id="notes">
                        <TextField
                            label="Notes"
                            variant="outlined"
                            value={this.state.additionalNotes}
                            onChange={this.handleAdditionalNotes}
                            multiline
                            onBlur={this.handleSave}
                            rows={this.state.rows}
                            fullWidth
                        />
                </div>
            </div>
        )        
    }
}
}
 
AddNote.propTypes = {
    saveNote: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default withRouter(connect(
    mapStateToProps,
    { saveNote }
  )(AddNote));