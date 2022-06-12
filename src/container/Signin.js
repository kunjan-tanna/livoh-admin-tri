import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Alert } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import Joi from 'joi-browser';
import { apiCall, validateSchema, formValueChangeHandler, displayLog } from '../util/common';
import config from '../util/config';
import { Emit, GetResponse } from '../util/connect-socket';
import md5 from 'md5'
import "../assets/Style/Style.css";

// app config
import AppConfig from 'Constants/AppConfig';

// redux action
import {
   signIn,
} from 'Actions';

//Auth File

class Signin extends Component {

   state = {
      form: {
         email: '',
         password: ''
      },
      error: {
         status: false,
         message: ''
      }
   }

	/**
	 * On User Login
	 */

   componentDidMount() {
      // Emit('login', { email: "" });
      // GetResponse(message => {
      //    console.log('the msg is-->', message);
      // })
   }
   onUserLogin = async () => {
      let schema = Joi.object().keys({
         email: Joi.string().trim().regex(config.EMAIL_REGEX).email().required(),
         password: Joi.string().trim().min(6).required()
      })
      this.setState({ error: await validateSchema(this.state.form, schema) });
      if (!this.state.error.status) {
         let header = {
            "language": 'en',
            "auth_token": '@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#OLEKOO',
            "web_app_version": "1.0.0"
         }
         Emit('login', { email: this.state.form.email, password: md5(this.state.form.password) }, header);
         GetResponse(response => {
            console.log('$$$$$$$ res->', response);
            if (response.code) {
               localStorage.setItem('DUDU_AUTH_TOKEN', response.data.auth_token);
               localStorage.setItem('USER', response.data.id);
               // displayLog(response.code, response.message);
               this.props.history.push('/admin-panel/users');
            } else {
               // displayLog(response.code, response.message);
            }
         })

      }
   }

   changeValuesHandler = (e) => {
      this.setState({ form: formValueChangeHandler(e, this.state.form) });
   }
   enterPressed = (event) => {
      var code = event.keyCode || event.which;
      if (code === 13) { //13 is the enter keycode
         this.onUserLogin()
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
            {/* <AppBar position="static" className="session-header">
               <Toolbar>
                  <div className="container">
                     <div className="d-flex justify-content-between">
                        <div className="session-logo">
                           <Link to="/">
                              <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="110" height="35" />
                           </Link>
                        </div>
                     </div>
                  </div>
               </Toolbar>
            </AppBar> */}
             <div className="loginPage d-flex h-100  text-center align-items-center">
                     <div className="loginPageWidth">
                      
                        <div className="session-logo logoOuter ">
                           <Link to="/">
                              <img src={AppConfig.appLogo} alt="session-logo" className="img-fluid" width="180" height="35" />
                           </Link>
                        </div>
                        <div className="">
                           <div className="session-head mb-30">
                              <h1 className="font-weight-bold"><span style={{color: 'white'}}>Login</span></h1>
                              {
                                 this.state.error.status ?
                                    <Alert color="danger">
                                       {this.state.error.message}
                                    </Alert>
                                    : null
                              }
                           </div>
                           <Form>
                              <FormGroup className="has-wrapper">
                                 <Input
                                    type="mail"
                                    value={email}
                                    name="email"
                                    id="user-mail"
                                    className=" formInput"
                                    placeholder="Enter Email Address"
                                    onChange={(e) => this.changeValuesHandler(e)}
                                    onKeyPress={(e) => this.enterPressed(e)}
                                 />
                                 <span className="has-icon"><i className="ti-email"></i></span>
                              </FormGroup>
                              <FormGroup className="has-wrapper">
                                 <Input
                                    value={password}
                                    type="Password"
                                    name="password"
                                    id="pwd"
                                    className=" formInput"
                                    placeholder="Password"
                                    onChange={(e) => this.changeValuesHandler(e)}
                                    onKeyPress={(e) => this.enterPressed(e)}
                                 />
                                 <span className="has-icon"><i className="ti-lock"></i></span>
                              </FormGroup>
                              <FormGroup className="mb-15">
                                 {/* <Button
                                    color="primary"
                                    className="btn-block text-white w-100"
                                    variant="contained"
                                    size="large"
                                    onClick={() => this.onUserLogin()}
                                 >
                                    Sign In
                            			</Button> */}
                                     <button type="button" className="blueBtn text-center"  onClick={() => this.onUserLogin()}>Sign In To Account</button>
                              </FormGroup>

                           </Form>
                           </div>
                        </div>
                     </div>

           
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
})(Signin);
