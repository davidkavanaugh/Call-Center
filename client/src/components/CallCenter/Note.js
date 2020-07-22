import React from 'react';
import { Typography, Divider, Container, IconButton } from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    handlePrint = () => {
        window.print();
    }

    render() { 
        const note = this.props.location.state.note;
        const client = this.props.location.state.client;
        return ( 
            <div id ="note">
                <IconButton className="new-call-button" onClick={this.handlePrint} style={{margin: '20px 20px', padding: '0px 0px', position: 'fixed', bottom: '0', right: '0'}}>
                        <PrintIcon style={{fontSize: '1.5em', color: 'white', backgroundColor: '#3f51b5', padding: '10px 10px', borderRadius: '50%'}}/>
                        <div className="overlay"></div>
                </IconButton>
                <Container maxWidth="md">
                <div className="header">
                    <Typography component="h4" variant="h6">{client.firstName + ' ' + client.lastName}</Typography>
                    <Typography component="subtitle1" variant="subtitle2">Subject: {note.subject}</Typography>
                    <Typography component="subtitle1" variant="subtitle2">User: {note.user}</Typography>
                    <Typography component="subtitle1" variant="subtitle2">Date: {note.date}</Typography>
                </div>
                <Divider />
                <div className="note-body">
                    {
                    note.content.questions ? 
                        note.content.questions.map(question => {
                            return(
                                <div style={{marginBottom: '10px'}}>
                                <Typography component="h5" variant="body1" color="primary">{question.query}</Typography>
                                {
                                question.selections ? 
                                    <ul>
                                    {question.selections.map(selection => {
                                        return(
                                            <li>{selection}</li>
                                        )
                                    })}
                                    </ul>
                                :
                                    null
                                }
                                {
                                question.otherAnswer ?
                                    <ul>
                                        <li>{question.otherAnswer}</li>
                                    </ul>
                                :
                                    null
                                }
                                </div>
                            )
                        })
                    : 
                        null
                    }
                    {note.content.additionalNotes ? 
                        <React.Fragment>
                            <p>{note.content.additionalNotes}</p>
                        </React.Fragment>
                    :
                        null
                    }
                    
                </div>
                </Container>
            </div>
         );
    }
}
 
export default Note;