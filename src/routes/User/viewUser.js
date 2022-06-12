import React from "react";
import { connect } from "react-redux";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import {
  displayLog,
  apiCall,
  capitalizeFirstLetter,
  timeStampToDate,
  confirmBox,
  formValueChangeHandler,
} from "../../util/common";
import Switch from "@material-ui/core/Switch";
import ReactPaginate from "react-paginate";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import { Emit, GetResponse } from "../../util/connect-socket";
import queryString from "query-string";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Fab } from "@material-ui/core";
import moment from "moment";
import ErrorImage from "../../assets/default.png";
import AppConfig from "../../constants/AppConfig";
import Joi from "joi-browser";
import * as functions from "../../util/functions";
// import { Alert } from 'reactstrap';

import {
  Alert,
  Button,
  Input,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  CardBody,
  FormGroup,
  Label,
} from "reactstrap";
import Dummy from "../../constants/Dummy";
class ViewUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      formValues: {
        image_data: "",
        image_name: "",
        profile_picture: "",
        full_name: "",
        company_name: "",
        description: "",
        email: "",
        phone_number: "",
        primary_phone_number: "",
        address: "",
        currency: "",
        web_site_url: "",
        facebook_url: "",
        twitter_handler: "",
        instagram_handler: "",
        enable_use_description: 0,
      },
      error: "",
      errorField: "",
      successMsg: "",
      imgsrc: "",
      fileError: "",
      loading: false,
    };
    this.params = queryString.parse(this.props.location.search);
  }
  componentDidMount() {
    this.getUserData();
  }
  getUserData = async () => {
    let req_data = {
      user_id: this.params.Id,
    };
    Emit("getUserDetailsById", req_data);
    GetResponse((res) => {
      console.log("The res is-->", res);
      this.setState({ formValues: res.data });
    });
  };
  inputChangedHandler = (e) => {
    this.setState({ successMsg: "" });
    let name = e.target.name;
    let form = this.state.formValues;
    //let form = this.state.list;
    if (name == "email") {
      form[name] = e.target.value.replace(/^\s+|\s+$/gm, "");
    } else if (name == "enable_use_description") {
      form[name] = !form[name];
    } else {
      form[name] = e.target.value.replace(/^\s+/g, "");
    }
    // console.log("form is", form)
    this.setState({ formValues: form });
    //this.setState({ list: form })
  };
  loadFile = (event) => {
    //let imgsrc = URL.createObjectURL(event.target.files[0]);
    let imgsrc = window.URL.createObjectURL(event.target.files[0]);
    let FileSize = event.target.files[0].size / 1024 / 1024; // in MB
    // if (FileSize > 1) {
    //   this.setState({ fileError: 'File size must be less then 1 MB' })
    //   // alert('File size exceeds 1 MB');
    // } else {
    //   this.setState({ imgsrc: imgsrc })
    // }
    let formData = new FormData();
    formData.append("name", "John");
    console.log("formdata is", formData);

    let imgvalidate_result = functions.validateImgSize(FileSize);
    if (imgvalidate_result.isvalidate) {
      this.setState({ fileError: "" });
      //this.setState({ imgsrc: imgsrc })
      let form = this.state.formValues;
      form["profile_picture"] = imgsrc;
      form["image_data"] = event.target.files[0];
      form["image_name"] = event.target.files[0].name;
      this.setState({ formValues: form });
      console.log("statee is", this.state.formValues);
    } else {
      this.setState({ fileError: imgvalidate_result.error });
    }
  };

  saveProfileHandler = () => {
    //console.log("saveProfileclick")
    let obj = {
      full_name: this.state.formValues.full_name,
      company_name: this.state.formValues.company_name,
      description: this.state.formValues.description,
      phone_number: this.state.formValues.phone_number,
      primary_phone_number: this.state.formValues.primary_phone_number,
      address: this.state.formValues.address,
      currency: this.state.formValues.currency,
      web_site_url: this.state.formValues.web_site_url,
      facebook_url: this.state.formValues.facebook_url,
      twitter_handler: this.state.formValues.twitter_handler,
      instagram_handler: this.state.formValues.instagram_handler,
      checkbox: this.state.formValues.enable_use_description ? true : false,
    };
    // this.validateFormData(obj);
    let reqdata = {
      user_id: this.params.Id,
      image_data: this.state.formValues.image_data,
      image_name: this.state.formValues.image_name,
      full_name: this.state.formValues.full_name,
      company_name: this.state.formValues.company_name,
      description: this.state.formValues.description,
      address: this.state.formValues.address,
      phone_number: this.state.formValues.phone_number,
      primary_phone_number: this.state.formValues.primary_phone_number,
      currency: this.state.formValues.currency,
      //enable_use_description: this.state.formValues.enable_use_description ? 1 : 0,
      web_site_url: this.state.formValues.web_site_url,
      facebook_url: this.state.formValues.facebook_url,
      twitter_handler: this.state.formValues.twitter_handler,
      instagram_handler: this.state.formValues.instagram_handler,
      //notification_on: this.state.formValues.notification_on ? 1 : 0,
    };
    this.saveProfile(reqdata);
  };

  // validateFormData = (body) => {
  //     let schema = Joi.object().keys({
  //         full_name: Joi.string().trim().required(),
  //         company_name: Joi.string().trim().required(),
  //         description: Joi.string().trim().required(),
  //         phone_number: Joi.string().min(9).max(13).regex(/^[0]?\d{0,13}$/),
  //         primary_phone_number: Joi.string().min(9).max(13).regex(/^[0]?\d{0,13}$/),
  //         address: Joi.string().trim().required(),
  //         currency: Joi.string().trim().required(),
  //         web_site_url: Joi.string().trim().required(),
  //         facebook_url: Joi.string().trim().required(),
  //         twitter_handler: Joi.string().trim().required(),
  //         instagram_handler: Joi.string().trim().required(),
  //         checkbox: Joi.boolean().invalid(false),
  //     })
  //     Joi.validate(body, schema, (error, value) => {
  //         if (error) {
  //             console.log("error is", error)
  //             console.log("value is", value)
  //             //if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
  //             let errorLog = functions.validateSchema(error)
  //             console.log("error is 63 ", errorLog);
  //             this.setState({ error: errorLog.error, errorField: errorLog.errorField })
  //             this.setState({ successMsg: "" })

  //             // console.log("state is ", this.state);
  //             // }
  //         }
  //         else {
  //             this.setState({ error: "", errorField: "" })

  //             //  console.log("11111111111111", ...reqData)
  //             // let formdata = new FormData();

  //             let reqdata = {
  //                 user_id: this.params.Id,
  //                 //image_data: this.state.formValues.image_data,
  //                 full_name: this.state.formValues.full_name,
  //                 company_name: this.state.formValues.company_name,
  //                 description: this.state.formValues.description,
  //                 address: this.state.formValues.address,
  //                 phone_number: this.state.formValues.phone_number,
  //                 primary_phone_number: this.state.formValues.primary_phone_number,
  //                 currency: this.state.formValues.currency,
  //                 //enable_use_description: this.state.formValues.enable_use_description ? 1 : 0,
  //                 web_site_url: this.state.formValues.web_site_url,
  //                 facebook_url: this.state.formValues.facebook_url,
  //                 twitter_handler: this.state.formValues.twitter_handler,
  //                 instagram_handler: this.state.formValues.instagram_handler,
  //                 //notification_on: this.state.formValues.notification_on ? 1 : 0,
  //             }
  //             // formdata.append(
  //             //     'myFile',
  //             //     this.state.formValues.image_data,
  //             //     )
  //             //console.log("formdata is", formdata);

  //             this.saveProfile(reqdata);
  //             this.setState({ loading: true })

  //         }
  //     })
  // }

  saveProfile = (reqData) => {
    Emit("updateUserDetailsById", reqData);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->", res);
      if (res.code === 1) {
        //this.setState({ successMsg: res });
      }
    });
  };

  render() {
    return (
      <div className="animated fadeIn">
        <PageTitleBar
          title={<IntlMessages id={"sidebar.viewUser"} />}
          match={this.props.match}
          data={this.props.location.userFilters}
        />
        <RctCollapsibleCard fullBlock>
          <Row>
            <Col xl={12}>
              <CardBody>
                <Row>
                  <Col xs="12" md="12">
                    <FormGroup>
                      <Label></Label>
                      <center>
                        <img
                          className="profile-img"
                          src={
                            this.state.formValues.profile_picture || ErrorImage
                          }
                        />
                        {/* <input type="file" id="avatar" name="avatar"
                                                    accept="image/png image/jpeg image/jpg " onChange={this.loadFile} style={{ display: "none" }} />
                                                <p><label for="avatar" style={{ cursor: "pointer" }}><img className="profile-img" src={this.state.formValues.profile_picture || ErrorImage} /></label></p>
                                                <Col xs="12" md="6">
                                                    {
                                                        this.state.fileError !== '' ?
                                                            <Alert color="danger">
                                                                {this.state.fileError}
                                                            </Alert>
                                                            : null
                                                    }
                                                </Col> */}
                      </center>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Full Name</Label>

                      <Input
                        type="text"
                        placeholder={`Enter full name`}
                        value={this.state.formValues.full_name || Dummy.data}
                        name="full_name"
                        readOnly
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Company Name</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Company name`}
                        value={this.state.formValues.company_name || Dummy.data}
                        readOnly
                        name="company_name"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Description</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Description `}
                        value={this.state.formValues.description || Dummy.data}
                        readOnly
                        name="description"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Email</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Email`}
                        value={this.state.formValues.email || Dummy.data}
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Phone Number</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Phone Number`}
                        value={this.state.formValues.phone_number || Dummy.data}
                        readOnly
                        name="phone_number"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">
                        Primary Phone Number
                      </Label>
                      <Input
                        type="text"
                        placeholder={`Enter Primary Phone Number`}
                        value={
                          this.state.formValues.primary_phone_number ||
                          Dummy.data
                        }
                        readOnly
                        name="primary_phone_number"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Address</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Address`}
                        value={this.state.formValues.address || Dummy.data}
                        readOnly
                        name="address"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Currency</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Currency`}
                        value={this.state.formValues.currency || Dummy.data}
                        readOnly
                        name="currency"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Website Url</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Website Url`}
                        value={this.state.formValues.web_site_url || Dummy.data}
                        readOnly
                        name="web_site_url"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Facebook Url</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Facebook Url`}
                        value={this.state.formValues.facebook_url || Dummy.data}
                        readOnly
                        name="facebook_url"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>

                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Twitter Handler</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Twitter Handler`}
                        value={
                          this.state.formValues.twitter_handler || Dummy.data
                        }
                        name="twitter_handler"
                        readOnly
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Instagram Handler</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Instagram Handler`}
                        value={
                          this.state.formValues.instagram_handler || Dummy.data
                        }
                        name="instagram_handler"
                        readOnly
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>

                  {/* <Col xs="12" md="6">
                                        <FormGroup className="d-flex">
                                            <Label className="label-weight">Use description on events page</Label>
                                            <Input type="checkbox" checked={this.state.formValues.enable_use_description}
                                                name="enable_use_description"
                                                onChange={this.inputChangedHandler}
                                            />
                                        </FormGroup>
                                    </Col> */}
                  <Col xs="12" md="6">
                    {this.state.error !== "" ? (
                      <Alert color="danger">{this.state.error}</Alert>
                    ) : null}
                  </Col>
                </Row>
              </CardBody>
            </Col>

            {/* <Col md="12" className=" mx-auto d-flex justify-content-center">
              <Col xs="6" md="2" className="d-flex justify-content-center">
                <Button
                  style={{ backgroundColor: "#3C16D5" }}
                  className="text-white blueinnerBtn"
                  variant="contained"
                  onClick={this.saveProfileHandler}
                >
                  Save
                </Button>
              </Col>
              <Col xs="6" md="2" className="d-flex justify-content-center">
                <Button variant="contained" className="text-white btn-danger">
                  Cancel
                </Button>
              </Col>
            </Col> */}
          </Row>
        </RctCollapsibleCard>
      </div>
    );
  }
}

export default ViewUser;
