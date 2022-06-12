/**
 * Responsive
 */
import React from 'react';
import { connect } from 'react-redux';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { displayLog, apiCall, capitalizeFirstLetter, timeStampToDate, confirmBox, formValueChangeHandler, validateSchema } from '../../util/common'
import Switch from '@material-ui/core/Switch';
import ReactPaginate from 'react-paginate';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { Emit, GetResponse } from '../../util/connect-socket'
import queryString from 'query-string'
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Fab } from '@material-ui/core';
import moment from 'moment'
import ErrorImage from '../../assets/default.png'
import Joi from 'joi-browser';


import {
    Button,
    Input,
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    CardBody,
    FormGroup,
    Label
} from 'reactstrap';

class Settings extends React.Component {
    state = {
        list: [],
        form: {
            admin_name: "",
            admin_email: "",
            admin_twitter: "",
            admin_facebook: "",
            admin_commission: ""
        },
        error: {
            status: false,
            message: ""
        }
    }
    componentDidMount() {
        this.getData();
    }
    getData = () => {
        Emit('getSettingsList', {})
        GetResponse(res => {
            console.log('\n\n RESSSSS->>', res.data[0]);
            let form = {
                admin_name: res.data[0].admin_name,
                admin_email: res.data[0].admin_email,
                admin_twitter: res.data[0].admin_twitter,
                admin_facebook: res.data[0].admin_facebook,
                admin_commission: String(res.data[0].admin_commission)
            }
            this.setState({
                list: res.data[0],
                form: form
            })
        })
    }
    submitHandler = async () => {
        let schema = Joi.object().keys({
            admin_name: Joi.string().label('Name').required(),
            admin_facebook: Joi.string().label('Facebook').required(),
            admin_email: Joi.string().label('Email').required(),
            admin_twitter: Joi.string().label('Twitter').required(),
            admin_commission: Joi.string().label('Commission').required(),
        })
        this.setState({
            error: await validateSchema({
                admin_name: this.state.form.admin_name,
                admin_email: this.state.form.admin_email,
                admin_twitter: this.state.form.admin_twitter,
                admin_facebook: this.state.form.admin_facebook,
                admin_commission: this.state.form.admin_commission
            }, schema)
        });
        if (!this.state.error.status) {
            let reqData = {
                admin_name: this.state.form.admin_name,
                admin_email: this.state.form.admin_email,
                admin_twitter: this.state.form.admin_twitter,
                admin_facebook: this.state.form.admin_facebook,
                admin_commission: this.state.form.admin_commission
            }
            Emit('updateSettings', reqData)
            GetResponse(res => {

            })
        } else {
            displayLog(0, this.state.error.message)
        }
    }
    changeValuesHandler = (e) => {
        this.setState({ form: formValueChangeHandler(e, this.state.form) });
    }
    render() {
        return (
            <div className="animated fadeIn">
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.settings"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <Row>
                        <Col xl={12}>
                            <CardBody>
                                <Row>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Admin Name</Label>
                                            <Input type="text" placeholder="Enter admin name"
                                                name="admin_name"
                                                value={this.state.form.admin_name ? this.state.form.admin_name : ""}
                                                onChange={(e) => this.changeValuesHandler(e)}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Admin Email</Label>
                                            <Input type="text" placeholder="Enter admin email"
                                                name="admin_email"
                                                value={this.state.form.admin_email ? this.state.form.admin_email : ""}
                                                onChange={(e) => this.changeValuesHandler(e)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Admin Facebook</Label>
                                            <Input type="text" placeholder="Enter admin address"
                                                name="admin_facebook"
                                                value={this.state.form.admin_facebook ? this.state.form.admin_facebook : ""}
                                                onChange={(e) => this.changeValuesHandler(e)}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Admin Twitter</Label>
                                            <Input type="text" placeholder="Enter admin phone number"
                                                name="admin_twitter"
                                                value={this.state.form.admin_twitter ? this.state.form.admin_twitter : ""}
                                                onChange={(e) => this.changeValuesHandler(e)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Admin Commission For Cashout (%)</Label>
                                            <Input type="text" placeholder="Enter admin commission"
                                                name="admin_commission"
                                                value={this.state.form.admin_commission ? this.state.form.admin_commission : ""}
                                                onChange={(e) => this.changeValuesHandler(e)}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col xs="12" md="12">
                                        <FormGroup>
                                            <Button color="primary" onClick={this.submitHandler}>Submit</Button>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Col>
                    </Row>
                </RctCollapsibleCard>
            </div>
        );
    }
}

export default Settings;