/**
 * Responsive
 */
import React from 'react';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { displayLog, apiCall, capitalizeFirstLetter, timeStampToDate, confirmBox } from '../../util/common'
import { Emit, GetResponse } from '../../util/connect-socket'
import moment from 'moment'
import queryString from 'query-string'
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

class ViewRecharge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            open: false
        }
        this.params = queryString.parse(this.props.location.search)
    }
    async componentDidMount() {
        // if (this.props.location.rechargeFilters) {
        //     localStorage.setItem('rechargeFilters', JSON.stringify(this.props.location.rechargeFilters));
        // }
        this.getTransactions();
    }

    getTransactions = async () => {
        let req_data = {
            transaction_id: this.params.Id
        }
        Emit('getRechargeTransactionList', req_data);
        GetResponse(res => {
            console.log('The res is-->', res);
            this.setState({ list: res.data.transactions[0] });
        })
    }

    render() {
        console.log('\n\n state-->', this.state);
        return (
            <div className="user-management">
                <PageTitleBar title={<IntlMessages id="sidebar.viewRecharge" />} match={this.props.match} />
                <RctCollapsibleCard fullBlock>
                    <CardBody>
                        <Row>
                            <Col xs="12" md="6">
                                <FormGroup>
                                    <Label className="label-weight">Transaction Id</Label>
                                    <Input type="text" placeholder={`Enter transaction id`}
                                        value={this.state.list['reference_or_charge_id'] ? this.state.list['reference_or_charge_id'] : "N/A"}
                                        disabled={true}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="12" md="6">
                                <FormGroup>
                                    <Label className="label-weight">Card Number</Label>
                                    <Input type="text" placeholder={`Enter card number`}
                                        value={this.state.list['card_number'] ? this.state.list['card_number'] : "N/A"}
                                        disabled={true}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="12" md="6">
                                <FormGroup>
                                    <Label className="label-weight">Expiry Month</Label>
                                    <Input type="text" placeholder={`Enter expiry month`}
                                        value={this.state.list['exp_month'] ? this.state.list['exp_month'] : "N/A"}
                                        disabled={true}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="12" md="6">
                                <FormGroup>
                                    <Label className="label-weight">Expiry Year</Label>
                                    <Input type="text" placeholder={`Enter expiry year`}
                                        value={this.state.list['exp_year'] ? this.state.list['exp_year'] : "N/A"}
                                        disabled={true}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="12" md="6">
                                <FormGroup>
                                    <Label className="label-weight">Card Type</Label>
                                    <Input type="text" placeholder={`Enter card type`}
                                        value={this.state.list['card_type'] ? this.state.list['card_type'] : "N/A"}
                                        disabled={true}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="12" md="6">
                                <FormGroup>
                                    <Label className="label-weight">Location</Label>
                                    <Input type="text" placeholder={`Enter location`}
                                        value={this.state.list['location'] ? this.state.list['location'] == 1 ? 'Nigeria' : 'Others' : "N/A"}
                                        disabled={true}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </RctCollapsibleCard>
            </div >

        );
    }
}


export default ViewRecharge;

