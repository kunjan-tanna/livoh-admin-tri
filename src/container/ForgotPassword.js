import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Alert, Label } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import Joi from 'joi-browser';
import { validateSchema, formValueChangeHandler, displayLog } from '../util/common';
import config from '../util/config';
import { Emit, GetResponse } from '../util/connect-socket'
import queryString from 'query-string'
import md5 from 'md5'



// app config
import AppConfig from 'Constants/AppConfig';

// redux action
import {
    signIn,
} from 'Actions';

//Auth File

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                confirm_password: '',
                new_password: ''
            },
            error: {
                status: false,
                message: ''
            },
            success: false
        }
        this.params = queryString.parse(this.props.location.search)
    }

    componentDidMount() {
        console.log('\n\n RTRTRTRTRT-->>', this.params);
    }


	/**
	 * On User Login
	 */
    onUserLogin = async () => {
        let schema = Joi.object().keys({
            new_password: Joi.string().trim().min(6).required(),
            confirm_password: Joi.string().trim().required(),
        })
        this.setState({ error: await validateSchema(this.state.form, schema) });
        if (!this.state.error.status) {
            if (this.state.form.new_password !== this.state.form.confirm_password) {
                this.setState({
                    error: {
                        status: true,
                        message: 'New password and confirm password must be same!'
                    }
                })
            }else{

                let header = {
                    "language": 'en',
                    "auth_token": '@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#OLEKOO',
                    "web_app_version": "1.0.0"
                }
                let body = {
                    email: this.params.email,
                    guid: this.params.guid,
                    password: md5(this.state.form.new_password)
                }
                Emit('resetPassword', body, header);
                GetResponse(response => {
                    console.log('\n\n respo->', response);
                    if (response.code) {
                        this.setState({ success: true })
                    }
                    displayLog(response.code, response.message);
                })
            }
        }
    }

    changeValuesHandler = (e) => {
        this.setState({
            form: formValueChangeHandler(e, this.state.form), error: {
                status: false,
                message: ''
            }
        });

    }
    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            this.loginHandler()
        }
    }

    render() {
        const { email, password } = this.state;
        const { loading } = this.props;
        console.log('\n\n STATE ISS->', this.state);
        return (
            <div className="rct-session-wrapper">
                {loading &&
                    <LinearProgress />
                }
                <AppBar position="static" className="session-header">
                    <Toolbar>
                        <div className="container">
                            <div className="d-flex justify-content-between">

                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                {
                    this.state.success
                        ?
                        <div className="jumbotron paymentSuccess">
                            <div className="display-4">
                                <h1><i class="fa fa-check" aria-hidden="true"></i></h1>
                            </div>
                            <p className="lead"><h3>Password reset successfully</h3></p>
                        </div>
                        :
                        <div className="session-inner-wrapper">
                            <div className="container">
                                <div className="Center">
                                    <div className="col-sm-10 col-md-10 col-lg-8">
                                        <div className="session-logo justify-content-center">
                                            <Link to="/">
                                                <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="180" height="35" />
                                            </Link>
                                        </div>
                                        <div className="session-body text-center">
                                            <div className="session-head mb-30">
                                                <h1 className="font-weight-bold">Reset Password</h1>
                                                {
                                                    this.state.error.status ?
                                                        <Alert color="danger">
                                                            {this.state.error.message}
                                                        </Alert>
                                                        : null
                                                }
                                            </div>
                                            {/* <Form> */}
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="password"
                                                    value={email}
                                                    name="new_password"
                                                    className="has-input input-lg"
                                                    placeholder="Enter New Password"
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                />
                                                <span className="has-icon"><i className="ti-lock"></i></span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    value={password}
                                                    type="Password"
                                                    name="confirm_password"
                                                    className="has-input input-lg"
                                                    placeholder="Enter Confirm Password"
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                />
                                                <span className="has-icon"><i className="ti-lock"></i></span>
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    variant="contained"
                                                    size="large"
                                                    onClick={() => this.onUserLogin()}
                                                >
                                                    Submit
                            			</Button>
                                            </FormGroup>

                                            {/* </Form> */}

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                }
            </div>
            // </QueueAnim>
        );
    }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
    const { user, loading } = authUser;
    return { user, loading }
}

export default connect(mapStateToProps, {
    signIn,
})(ResetPassword);
