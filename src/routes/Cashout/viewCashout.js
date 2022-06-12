/**
 * Responsive
 */
import React from 'react';
import { connect } from 'react-redux';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { displayLog, apiCall, capitalizeFirstLetter, timeStampToDate, confirmBox, formValueChangeHandler } from '../../util/common'
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

class ViewCashout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            open: false,
        }
        this.params = queryString.parse(this.props.location.search)

    }
    componentDidMount() {
        this.getData();
    }
    getData = async () => {
        let req_data = {
            Id: this.params.Id
        }
        Emit('getCashoutRequestById', req_data);
        GetResponse(res => {
            console.log('The res is-->', res.data[0]);
            this.setState({ list: res.data[0] });
        })
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };


    render() {
       // console.log('\n STATEEEE->', this.state);
        return (
            <div className="animated fadeIn">
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.viewCashout"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <Row>
                        <Col xl={12}>
                            <CardBody>
                                <Row>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Blessings</Label>
                                            <Input type="text"
                                                value={this.state.list.blessings ? this.state.list.blessings : "N/A"}
                                                disabled={true}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Money {this.state.list.currency == 1 ? '(₦)' : '($)'}</Label>
                                            <Input type="text"

                                                value={this.state.list.money ?
                                                    this.state.list.money :
                                                    "N/A"}
                                                disabled={true}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Admin Commission</Label>
                                            <Input type="text"
                                                value={this.state.list.admin_commission ? this.state.list.admin_commission : "N/A"}
                                                disabled={true}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Receivable Money</Label>
                                            <Input type="text"
                                                value={this.state.list.received_money ? this.state.list.received_money : "N/A"}
                                                disabled={true}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {
                                    this.state.list.cashout_mode == 1
                                        ?
                                        <div>
                                            <Label className="Bdetails">Bank Details</Label>
                                            <Row>
                                                <Col xs="12" md="6">
                                                    <FormGroup>
                                                        <Label className="label-weight">Bank Name</Label>
                                                        <Input type="text"
                                                            value={this.state.list.bank_details ? this.state.list.bank_details.bank_name : "N/A"}
                                                            disabled={true}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col xs="12" md="6">
                                                    <FormGroup>
                                                        <Label className="label-weight">Bank Code</Label>
                                                        <Input type="text"
                                                            value={this.state.list.bank_details ? this.state.list.bank_details.bank_code : "N/A"}
                                                            disabled={true}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col xs="12" md="6">
                                                    <FormGroup>
                                                        <Label className="label-weight">Account Number</Label>
                                                        <Input type="text"
                                                            value={this.state.list.bank_details ? this.state.list.bank_details.account_number : "N/A"}
                                                            disabled={true}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                            </Row>
                                        </div>
                                        :
                                        <Row>
                                            <Col xs="12" md="6">
                                                <FormGroup>
                                                    <Label className="label-weight">Paypal Email</Label>
                                                    <Input type="text"
                                                        value={this.state.list.paypal_email ? this.state.list.paypal_email : "N/A"}
                                                        disabled={true}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                }
                            </CardBody>
                        </Col>
                    </Row>
                </RctCollapsibleCard>
            </div>
        );
    }
}

export default ViewCashout;