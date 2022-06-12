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
    Label,
    NavLink,
    NavItem,
    Nav,
    TabContent,
    TabPane
} from 'reactstrap';

class AddEditBlessingToMoney extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            form: {
                blessings: "",
                money: "",
                money_naira: ""
            },
            error: {
                status: "",
                message: ""
            }
        }
        this.params = queryString.parse(this.props.location.search)
    }

    componentDidMount() {
        // if (this.props.location.walletFilters) {
        //     localStorage.setItem('walletFilters', JSON.stringify(this.props.location.walletFilters));
        // }
        if (this.params.Id) {
            Emit('getBlessingToMoneyById', { id: this.params.Id })
            GetResponse(res => {
                console.log('\n\n\n VVVVVV', res);
                this.setState({
                    form: {
                        blessings: res.data.blessings,
                        money: res.data.money,
                        money_naira: res.data.money_naira
                    }
                })
            })
        }
    }

    submitHandler = async () => {
        let schema = Joi.object().keys({
            blessings: Joi.number().label('Blessings').required(),
            money: Joi.number().label('Money').required(),
            money_naira: Joi.number().label('Money Naira').required(),
        })
        this.setState({
            error: await validateSchema({
                blessings:this.state.form.blessings,
                money: this.state.form.money,
                money_naira: this.state.form.money_naira,
            }, schema)
        });
        if (!this.state.error.status) {
            let reqData = {
                blessings: Number(this.state.form.blessings),
                money: Number(this.state.form.money),
                money_naira: Number(this.state.form.money_naira),
            }
            if (this.params.Id) {
                reqData.id = this.params.Id
                Emit('editBlessingToMoney', reqData)
                GetResponse(res => {
                    this.props.history.push('/admin-panel/wallet', this.props.location.walletFilters);
                })
            } else {
                Emit('addBlessingToMoney', reqData);
                GetResponse(res => {
                    this.props.history.push('/admin-panel/wallet', this.props.location.walletFilters);
                })
            }
        } else {
            console.log('\n\n 5555555555555555555555555');

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
                    title={<IntlMessages id={this.params.Id ? "sidebar.editBtoc" : "sidebar.addBtoc"} />}
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
                                            <Input type="number" placeholder={`Enter Blessings`}
                                                min="0"
                                                name="blessings"
                                                value={this.state.form.blessings}
                                                onChange={(e) => this.changeValuesHandler(e)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Money(Dollar)</Label>
                                            <Input type="number" placeholder={`Enter Money(Dollar)`}
                                                min="0"
                                                name="money"
                                                value={this.state.form.money}
                                                onChange={(e) => this.changeValuesHandler(e)}

                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Money(Naira)</Label>
                                            <Input type="number" placeholder={`Enter Money(Naira)`}
                                                min="0"
                                                name="money_naira"
                                                value={this.state.form.money_naira}
                                                onChange={(e) => this.changeValuesHandler(e)}

                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs="12" md="2">
                                        <Button color='primary' variant="contained" className="text-white" onClick={() => this.submitHandler()}>Submit</Button>
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

export default AddEditBlessingToMoney;