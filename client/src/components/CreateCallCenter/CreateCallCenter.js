import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Stepper, Step, Button, StepLabel, TextField, Typography } from '@material-ui/core'
import PropTypes from 'prop-types';
import axios from 'axios'
import { connect } from 'react-redux';
import classnames from "classnames";

import './CreateCallCenter.css';

class CreateCallCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: '',
      companyDescription: '',
      img: null,
      file: '',
      fileName: 'Choose File',
      uploadedFile: {},
      activeStep: 0,
      skipped: new Set(),
      errors: {},
      alert: false
    }
  }

  
  onChange = e => this.setState({ [e.target.name]: e.target.value, alert: false, errors: {} })

  getSteps = () => {
    return ['Name', 'Description', 'Logo'];
  }

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TextField 
            id="companyName"
            label="Company Name"
            name="companyName"
            type="text"
            style={{marginBottom: '10px'}}
            variant="outlined"
            onChange={this.onChange}
            value={this.state.companyName}
            error={this.state.errors.companyName}
            className={classnames("form-input", {
              invalid: this.state.errors.companyName
            })}
          />
        )
      case 1:
        return (
          <TextField
            id="Company Description"
            label="Description"
            name="companyDescription"
            type="text"
            style={{marginBottom: '10px'}}
            variant="outlined"
            onChange={this.onChange}
            value={this.state.companyDescription}
            multiline
            rows={4}
            error={this.state.errors.companyDescription}
            className={classnames("form-input", {
              invalid: this.state.errors.companyDescription
            })}
            
          />
        );
      case 2:
        return (
          <div id ="image-uploader">
            {this.state.alert ? 
              <div className="alert-box">
                <p>{this.state.errors.img}</p>
              </div> 
            : null}
            {this.state.uploadedFile ? (
              <div id="image">
                <img style={{ width: '100%' }} src={this.state.uploadedFile.filePath} alt='' />
              </div>
            ) : null}
          <div>
              <input
                type='file'
                className='hidden'
                accept="image/*"
                id='logo'
                name='logo'
                onChange={this.handleImgSelect}
              />
              <Button color="default" variant="contained" disableElevation className="image-upload-btn" style={{textTransform: 'none'}}>
                <label htmlFor='logo' style={{cursor: 'pointer'}}>
                  Choose Logo
                </label>
              </Button>
          </div>
        </div>
        );
      default:
        return 'Unknown step';
    }
  }

  isStepOptional = (step) => {
    return step === 1;
  };

  isStepSkipped = (step) => {
    return this.state.skipped.has(step);
  };

  handleNext = () => {
    let newSkipped = this.state.skipped;
    if (this.isStepSkipped(this.state.activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(this.state.activeStep);
    }

    this.setState({ 
      activeStep: this.state.activeStep + 1,
      skipped: newSkipped
    })
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1
    })
  };

  handleSkip = () => {
    if (!this.isStepOptional(this.state.activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step.");
    }
    const newSkipped = new Set(this.state.skipped.values());
    newSkipped.add(this.state.activeStep)
    this.setState({ 
      activeStep: this.state.activeStep + 1,
      skipped: newSkipped
    })
  };

  handleImgSelect = async e => {
    e.preventDefault();

    let errors = {};

    this.setState({
      file: e.target.files[0],
      errors: {},
      alert: false
    })

    const data = new FormData();

    data.append('logo', e.target.files[0]);

    for (var value of data.values()) {
      console.log(value); 
    }

    axios.post('/api/call-centers/img-upload', data, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US, en;q=0.8',
        'enctype': 'multipart/form-data',
        'Content-Type': `multipart/form-data`
      }
    })
    .then((res) => {
        // if fileSize is larger than expected
        if (res.data.error) {
          if ('LIMIT_FILE_SIZE' === res.data.error.code) {
            errors.img = 'Max Size: 2MB'
            this.setState({
              errors: errors,
              alert: true
            })
          } else { 
            console.log(res.data)
            errors.img = res.data.error
            this.setState({
              errors: errors,
              alert: true
            })
          }
        } else {
          // Success
          errors = {}
          this.setState({
            errors: errors,
            alert: false,
            uploadedFile: res.data
          })
        }
    })
    .catch((err) => {
      this.setState({
        errors: err,
        alert: true
      })
    })
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    })
  };

  tempLogo = (filePath) => {
    if(!filePath) {
      return `${process.cwd()}assets/call-center-logo-black.png`
    } else {
      return this.state.uploadedFile.filePath
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    let errors = {};

    if (!this.state.companyName) {
        errors.companyName = 'call center name required'
        this.setState({
          errors: errors,
          alert: true
        })
    } else {
      let creator = this.props.auth.user.id,
          name = this.state.companyName,
          about = this.state.companyDescription,
          img = this.tempLogo(this.state.uploadedFile.filePath)

      let callCenter = {
        creator,
        name,
        about,
        img
      }  
      this.setState({
        errors: {},
        alert: false
      })
      axios.post('/api/call-centers/add/' + this.props.auth.user.id, callCenter)
        .then(res => this.props.history.push('/dashboard'))
        .catch(err => console.log(err))
    }
};

  render() {
    const steps = this.getSteps();
    return(
      <React.Fragment>
      <div id="create-call-center">
        <Typography variant="h4" component="h3" style={{textAlign: 'center'}}>New Call Center</Typography><br />   
        <Stepper activeStep={this.state.activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
        {this.state.alert ? (
          <div className="alert-box">
              <p>{this.state.errors.companyName}</p>
          </div>
          ) : null}  
        <div className="form-group">
          {this.getStepContent(this.state.activeStep)}
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div id='form-buttons'>
              {this.state.activeStep === 0 ? 
                <Link to="/dashboard">
                  <Button color="secondary">Cancel</Button>
                </Link> : 
                <Button onClick={this.handleBack}>
                  Back
                </Button>
              }
              <Button
                color="primary"
                onClick={this.state.activeStep === steps.length - 1 ? this.onSubmit : this.handleNext}
              >
                {this.state.activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
          </div>
        </div>
        </div>
    </React.Fragment>
    )
  }

};

CreateCallCenter.propTypes = {
  callCenter: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  callCenter: state.callCenter,
  auth: state.auth,
});

export default connect(mapStateToProps,)(
  withRouter(CreateCallCenter)
);