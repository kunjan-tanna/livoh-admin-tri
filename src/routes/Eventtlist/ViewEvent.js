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

class ViewEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      formValues: {
        image: "",
        name: "",
        location: "",
        date: "",
        start_time: "",
        end_time: "",
        description: "",

        ticket_type: "",
        ticket_name: "",
        quantity: "",
        service_charge: "",
        price: "",
        ticket_description: "",
        twitter_handle: "",
        instagram_handle: "",
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
    // console.log("EVENT ID", this.params);
    this.getEventData();
  }
  getEventData = async () => {
    let req_data = {
      event_id: this.params.event_id,
      isAdmin: 1,
    };
    Emit("getEventDetailsById", req_data);
    GetResponse((res) => {
      console.log("The res is-->", res);
      if (res.code == 1) {
        this.setState({ formValues: res.data.events });
        // console.log(this.state.formValues)
      }
      if (res.code == 0) {
        setTimeout(() => {
          // window.location.href = "admin-panel/eventlist"
        }, 3000);
      }
    });
  };
  inputChangedHandler = (e) => {
    this.setState({ successMsg: "" });
    let name = e.target.name;
    let form = this.state.formValues;
    //let form = this.state.list;
    if (name == "email") {
      form[name] = e.target.value.replace(/^\s+|\s+$/gm, "");
    } else {
      form[name] = e.target.value.replace(/^\s+/g, "");
    }
    this.setState({ formValues: form });
    console.log("form data", this.state.formValues);
  };

  saveProfileHandler = () => {
    let obj = {
      Event_name: this.state.formValues.name,
      location: this.state.formValues.location,
      date: this.state.formValues.date,
      start_time: this.state.formValues.start_time,
      end_time: this.state.formValues.end_time,
      description: this.state.formValues.description,
    };
    this.validateFormData(obj);
    // let reqdata = {
    //     event_id: this.params.event_id,
    //     name: this.state.formValues.name,
    //     location: this.state.formValues.location,
    //     date: this.state.formValues.date,
    //     start_time: this.state.formValues.start_time,
    //     end_time: this.state.formValues.end_time,
    //     description: this.state.formValues.description,
    // }
    // this.saveProfile(reqdata);
  };

  validateFormData = (body) => {
    let schema = Joi.object().keys({
      Event_name: Joi.string().trim().required(),
      location: Joi.string().trim().required(),
      date: Joi.string().trim().required(),
      start_time: Joi.string().trim().required(),
      end_time: Joi.string().trim().required(),
      description: Joi.string().trim().required(),
    });
    Joi.validate(body, schema, (error, value) => {
      if (error) {
        // console.log("error is", error)
        // console.log("value is", value)
        //if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
        let errorLog = functions.validateSchema(error);
        //console.log("error is 63 ", errorLog);
        this.setState({
          error: errorLog.error,
          errorField: errorLog.errorField,
        });
        this.setState({ successMsg: "" });
      } else {
        this.setState({ error: "", errorField: "" });

        let reqdata = {
          event_id: this.params.event_id,
          name: this.state.formValues.name,
          location: this.state.formValues.location,
          date: this.state.formValues.date,
          start_time: this.state.formValues.start_time,
          end_time: this.state.formValues.end_time,
          description: this.state.formValues.description,

          ticket_type: this.state.formValues.ticket_type.toString(),
          ticket_name: this.state.formValues.ticket_name,
          quantity: this.state.formValues.quantity,
          service_charge: this.state.formValues.service_charge,
          price: this.state.formValues.price,
          ticket_description: this.state.formValues.ticket_description,
          twitter_handle: this.state.formValues.twitter_handle,
          instagram_handle: this.state.formValues.instagram_handle,
        };
        this.saveProfile(reqdata);
        this.setState({ loading: true });
      }
    });
  };

  saveProfile = (reqData) => {
    Emit("updateEventForAdmin", reqData);
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
          title={<IntlMessages id={"sidebar.viewEvent"} />}
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
                          src={this.state.formValues.image || ErrorImage}
                        />
                      </center>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Event Name</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Event name`}
                        value={this.state.formValues.name || Dummy.data}
                        readOnly
                        name="name"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Location</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Location`}
                        value={this.state.formValues.location || Dummy.data}
                        readOnly
                        name="location"
                        onChange={this.inputChangedHandler}
                      />
                      {/* <Input type="select" name="select" id="exampleSelect">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Input> */}
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Event Date</Label>
                      <Input
                        className="form-input-text"
                        type="date"
                        name="date"
                        id="exampleDate"
                        // min="2021-04-13"
                        min={moment().format("YYYY-MM-DD")}
                        // max={moment(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD")}
                        value={
                          moment(this.state.formValues.date).format(
                            "YYYY-MM-DD"
                          ) || Dummy.data
                        }
                        readOnly
                        placeholder="event date"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Start Time</Label>
                      <Input
                        className="form-input-text"
                        type="time"
                        name="start_time"
                        value={this.state.formValues.start_time || Dummy.data}
                        readOnly
                        id="exampleTime"
                        placeholder="time placeholder"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">End Time</Label>
                      <Input
                        className="form-input-text"
                        type="time"
                        name="end_time"
                        value={this.state.formValues.end_time || Dummy.data}
                        readOnly
                        id="exampleTime"
                        placeholder="time placeholder"
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
                  {/* <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Ticket Type</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Ticket Type `}
                        value={this.state.formValues.ticket_type}
                        name="ticket_type"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col> */}
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Ticket Name</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Ticket Name `}
                        value={this.state.formValues.ticket_name || Dummy.data}
                        readOnly
                        name="ticket_name"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Quantity</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Quantity `}
                        value={this.state.formValues.quantity || Dummy.data}
                        readOnly
                        name="quantity"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Service Charge</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Service Charge `}
                        value={
                          this.state.formValues.service_charge || Dummy.data
                        }
                        readOnly
                        name="service_charge"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Price</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Price `}
                        value={this.state.formValues.price || Dummy.data}
                        readOnly
                        name="price"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Ticket Description</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Ticket Description `}
                        value={
                          this.state.formValues.ticket_description || Dummy.data
                        }
                        readOnly
                        name="ticket_description"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Twitter Handle</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Twitter Handle `}
                        value={
                          this.state.formValues.twitter_handle || Dummy.data
                        }
                        readOnly
                        name="twitter_handle"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="6">
                    <FormGroup>
                      <Label className="label-weight">Instagram Handle</Label>
                      <Input
                        type="text"
                        placeholder={`Enter Instagram Handle `}
                        value={
                          this.state.formValues.instagram_handle || Dummy.data
                        }
                        readOnly
                        name="instagram_handle"
                        onChange={this.inputChangedHandler}
                      />
                    </FormGroup>
                  </Col>
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

export default ViewEvent;
