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

class AddEditMoneyToCoins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            form: {
                money: "",
                main_coins: "",
                extra_coins: 0,
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
        console.log('\n\n\n RRRRRRRRRRRRRRR->', this.props.location.walletFilters);
        // if (this.props.location.walletFilters) {
        //     localStorage.setItem('walletFilters', JSON.stringify(this.props.location.walletFilters));
        // }
        if (this.params.Id) {
            Emit('getMoneyToCoinById', { id: this.params.Id })
            GetResponse(res => {
                console.log('\n\n\n VVVVVV', res);
                this.setState({
                    form: {
                        money: res.data.money,
                        main_coins: res.data.main_coins,
                        extra_coins: res.data.extra_coins,
                        money_naira: res.data.money_naira
                    }
                })
            })
        }
    }

    submitHandler = async () => {

        let schema = Joi.object().keys({
            money: Joi.number().label('Money').required(),
            main_coins: Joi.number().integer().label('Main Coins').required(),
            extra_coins: Joi.number().integer().label('Extra Coins').required(),
            money_naira: Joi.number().label('Money Naira').required(),
        })
        this.setState({
            error: await validateSchema({
                money: this.state.form.money,
                main_coins: this.state.form.main_coins,
                extra_coins: this.state.form.extra_coins,
                money_naira: this.state.form.money_naira
            }, schema)
        });

        if (!this.state.error.status) {
            let reqData = {
                money: this.state.form.money,
                main_coins: this.state.form.main_coins,
                extra_coins: this.state.form.extra_coins,
                money_naira: this.state.form.money_naira
            }
            if (this.params.Id) {
                reqData.id = this.params.Id
                Emit('editMoneyToCoins', reqData)
                GetResponse(res => {
                    this.props.history.push('/admin-panel/wallet', this.props.location.walletFilters);
                })
            } else {
                Emit('addMoneyToCoins', reqData);
                GetResponse(res => {
                    this.props.history.push('/admin-panel/wallet', this.props.location.walletFilters);

                })
            }
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
                    title={<IntlMessages id={this.params.Id ? "sidebar.editMoney" : "sidebar.addMoney"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <Row>
                        <Col xl={12}>
                            <CardBody>
                                <Row>
                                    <Col xs="12" md="4">
                                        <FormGroup>
                                            <Label className="label-weight">Money(Dollar)</Label>
                                            <Input type="number" placeholder={`Enter Money (Dollar)`}
                                                min="0"
                                                name="money"
                                                value={this.state.form.money}
                                                onChange={(e) => this.changeValuesHandler(e)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <span className="Peding"> =</span>
                                    <Col xs="12" md="3">
                                        <FormGroup>
                                            <Label className="label-weight">Main Coins</Label>
                                            <Input type="number" placeholder={`Enter Main Coins`}
                                                min="0"
                                                name="main_coins"
                                                value={this.state.form.main_coins}
                                                onChange={(e) => this.changeValuesHandler(e)}

                                            />
                                        </FormGroup>
                                    </Col>
                                    <span className="Peding"> +</span>
                                    <Col xs="12" md="3">
                                        <FormGroup>
                                            <Label className="label-weight">Extra Coins</Label>
                                            <Input type="number" placeholder={`Enter Extra Coins`}
                                                min="0"
                                                name="extra_coins"
                                                value={this.state.form.extra_coins}
                                                onChange={(e) => this.changeValuesHandler(e)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" md="3">
                                        <FormGroup>
                                            <Label className="label-weight">Money(Naira)</Label>
                                            <Input type="number" placeholder={`Enter Money (Naira)`}
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

export default AddEditMoneyToCoins;