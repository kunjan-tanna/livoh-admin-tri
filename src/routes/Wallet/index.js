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
import classnames from 'classnames';
import { Link } from 'react-router-dom'


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

class Wallet extends React.Component {
    state = {
        MoneyToCoins: [],
        BlessingsToCoins: [],
        BlessingsToMoney: [],
        activeTab: '1'
    }
    getData = () => {
        Emit('getMoneyRelations');
        GetResponse(res => {
            console.log('The res is-^^^->', res);
            this.setState({
                MoneyToCoins: res.data.MoneyCoins,
                BlessingsToCoins: res.data.BlessingsCoins,
                BlessingsToMoney: res.data.BlessingsMoney
            });
        })
    }
    async componentDidMount() {
        console.log('\n\n\n TJJJJJJJJJJJJJJJJJJJ-.>', this.props.location.state);
        if (localStorage.getItem('walletFilters')) {
            let data = JSON.parse(localStorage.getItem('walletFilters'));
            localStorage.removeItem('walletFilters');
            this.setState({ activeTab: data.tab })
        }
        if (this.props.location.state) {
            await this.setState({ activeTab: this.props.location.state.tab });
        }
        this.getData();
    }
    toggle = async (tab) => {
        if (this.state.activeTab !== tab) {
            await this.setState({ activeTab: tab })
        }
    }
    deleteHandler = async (id) => {
        this.setState({ deleteId: id })
        this.refs.deleteConfirmationDialog.open();
    }

    deleteBlessing = (id) => {
        this.setState({ deleteBlessingId: id })
        this.refs.deleteblessingDialog.open();
    }

    deleteBlessingToMoney = (id) => {
        this.setState({ deleteBlessingToMoneyId: id })
        this.refs.deleteblessingToMoneyDialog.open();
    }

    deleteBlessingHandler = () => {
        this.refs.deleteblessingDialog.close();
        if (this.state.deleteBlessingId) {
            Emit('deleteBlessingsToCoins', { id: this.state.deleteBlessingId })
            GetResponse(res => {
                this.getData();
            })
        }
    }

    deleteBlessingToMoneyHandler = () => {
        this.refs.deleteblessingToMoneyDialog.close();
        if (this.state.deleteBlessingToMoneyId) {
            Emit('deleteBlessingsToMoney', { id: this.state.deleteBlessingToMoneyId })
            GetResponse(res => {
                this.getData();
            })
        }
    }

    delete = () => {
        this.refs.deleteConfirmationDialog.close();
        if (this.state.deleteId) {
            Emit('deleteMoneyToCoins', { id: this.state.deleteId })
            GetResponse(res => {
                this.getData();
            })
        }
    }

    render() {
        console.log('\n\n STATEEEW-.>', this.state);
        return (
            <div className="animated fadeIn">
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.Wallet"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}
                            >
                                Money To Coins
                    </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}
                            >
                                Blessings To Coins
                    </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={() => { this.toggle('3'); }}
                            >
                                Blessings To Money
                    </NavLink>
                        </NavItem>

                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <RctCollapsibleCard fullBlock>
                                <Row>
                                    <Col xl={12}>
                                        <CardBody>
                                            <Row className="align-items-right mb-3">
                                                <Col sm="12" md="11" className="mb-xl-0">
                                                </Col>
                                                <Col sm="12" md="1" className="mb-xl-0">
                                                    <Link to={{
                                                        pathname: 'wallet/add-money-to-coins',
                                                        walletFilters: {
                                                            tab: this.state.activeTab
                                                        }

                                                    }}><Button color='primary' variant="contained" className="text-white">Add</Button></Link>
                                                </Col>
                                            </Row>
                                            <div className="table-responsive">
                                                <div className="unseen">
                                                    {/* <Table hover bordered striped> */}
                                                    <table className="table table-middle table-hover mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Money(Dollar)</th>
                                                                <th>Money(Naira)</th>
                                                                <th>Total Coins</th>
                                                                {/* <th>Main Coins</th>
                                                                <th>Extra Coins</th> */}
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                this.state.MoneyToCoins && this.state.MoneyToCoins.length > 0
                                                                    ?
                                                                    this.state.MoneyToCoins.map((mc, index) => (
                                                                        <tr key={index}>
                                                                            <td><td>{index + 1}</td></td>
                                                                            <td>{mc.money}</td>
                                                                            <td>{mc.money_naira}</td>
                                                                            <td>{mc.total_coins}</td>
                                                                            {/* <td>{mc.main_coins}</td>
                                                                            <td>{mc.extra_coins}</td> */}
                                                                            <td className="list-action">
                                                                                <Tooltip id="tooltip-fab" title="Edit">
                                                                                    <Link to={{
                                                                                        pathname: 'wallet/edit-money-to-coins',
                                                                                        walletFilters: {
                                                                                            tab: this.state.activeTab
                                                                                        },
                                                                                        search: `?Id=${mc.money_to_coins_relation_id}`,
                                                                                    }}><i className="ti-pencil" aria-hidden="true"></i></Link>
                                                                                </Tooltip>
                                                                                <Tooltip id="tooltip-fab" title="Delete"><button type="button" className="rct-link-btn" onClick={() => this.deleteHandler(mc.money_to_coins_relation_id)}><i className="ti-close"></i></button></Tooltip>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                    :
                                                                    <tr className="text-center"><td colSpan={7}> No Data Found </td></tr>
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Col>
                                </Row>
                            </RctCollapsibleCard>
                        </TabPane>
                        <TabPane tabId="2">
                            <RctCollapsibleCard fullBlock>
                                <Row>
                                    <Col xl={12}>
                                        <CardBody>
                                            <Row className="align-items-right mb-3">
                                                <Col sm="12" md="11" className="mb-xl-0">
                                                </Col>
                                                <Col sm="12" md="1" className="mb-xl-0">
                                                    <Link to={{
                                                        pathname: 'wallet/add-blessings-to-coins',
                                                        walletFilters: {
                                                            tab: this.state.activeTab
                                                        },

                                                    }}><Button color='primary' variant="contained" className="text-white">Add</Button></Link>
                                                </Col>
                                            </Row>
                                            <div className="table-responsive">
                                                <div className="unseen">
                                                    {/* <Table hover bordered striped> */}
                                                    <table className="table table-middle table-hover mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Blessings</th>
                                                                <th>Total Coins</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                this.state.BlessingsToCoins && this.state.BlessingsToCoins.length > 0
                                                                    ?
                                                                    this.state.BlessingsToCoins.map((bc, index) => (
                                                                        <tr key={index}>
                                                                            <td><td>{index + 1}</td></td>
                                                                            <td>{bc.blessings}</td>
                                                                            <td>{bc.total_coins}</td>
                                                                            <td className="list-action">
                                                                                <Tooltip id="tooltip-fab" title="Edit">
                                                                                    <Link to={{
                                                                                        pathname: 'wallet/edit-blessings-to-coins',
                                                                                        walletFilters: {
                                                                                            tab: this.state.activeTab
                                                                                        },
                                                                                        search: `?Id=${bc.blessings_to_coins_relation_id}`,
                                                                                    }}><i className="ti-pencil" aria-hidden="true"></i></Link>
                                                                                </Tooltip>
                                                                                <Tooltip id="tooltip-fab" title="Delete"><button type="button" className="rct-link-btn" onClick={() => this.deleteBlessing(bc.blessings_to_coins_relation_id)}><i className="ti-close"></i></button></Tooltip>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                    :
                                                                    <tr className="text-center"><td colSpan={4}> No Data Found </td></tr>
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Col>
                                </Row>
                            </RctCollapsibleCard>
                        </TabPane>
                        <TabPane tabId="3">

                            <RctCollapsibleCard fullBlock>
                                <Row>
                                    <Col xl={12}>
                                        <CardBody>
                                            <Row className="align-items-right mb-3">
                                                <Col sm="12" md="11" className="mb-xl-0">
                                                </Col>
                                                <Col sm="12" md="1" className="mb-xl-0">
                                                    <Link to={{
                                                        pathname: 'wallet/add-blessings-to-money',
                                                        walletFilters: {
                                                            tab: this.state.activeTab
                                                        },

                                                    }}><Button color='primary' variant="contained" className="text-white">Add</Button></Link>
                                                </Col>
                                            </Row>
                                            <div className="table-responsive">
                                                <div className="unseen">
                                                    {/* <Table hover bordered striped> */}
                                                    <table className="table table-middle table-hover mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Blessings</th>
                                                                <th>Money(Dollar)</th>
                                                                <th>Money(Naira)</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                this.state.BlessingsToMoney && this.state.BlessingsToMoney.length > 0
                                                                    ?
                                                                    this.state.BlessingsToMoney.map((bm, index) => (
                                                                        <tr key={index}>
                                                                            <td><td>{index + 1}</td></td>
                                                                            <td>{bm.blessings}</td>
                                                                            <td>{bm.money}</td>
                                                                            <td>{bm.money_naira}</td>
                                                                            <td className="list-action">
                                                                                <Tooltip id="tooltip-fab" title="Edit">
                                                                                    <Link to={{
                                                                                        pathname: 'wallet/edit-blessings-to-money',
                                                                                        walletFilters: {
                                                                                            tab: this.state.activeTab
                                                                                        },
                                                                                        search: `?Id=${bm.blessings_to_money_relation_id}`,
                                                                                    }}><i className="ti-pencil" aria-hidden="true"></i></Link>
                                                                                </Tooltip>
                                                                                <Tooltip id="tooltip-fab" title="Delete"><button type="button" className="rct-link-btn" onClick={() => this.deleteBlessingToMoney(bm.blessings_to_money_relation_id)}><i className="ti-close"></i></button></Tooltip>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                    :
                                                                    <tr className="text-center"><td colSpan={4}> No Data Found </td></tr>
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Col>
                                </Row>
                            </RctCollapsibleCard>

                        </TabPane>
                    </TabContent>
                    <DeleteConfirmationDialog
                        ref="deleteConfirmationDialog"
                        title="Are you sure want to delete?"
                        // message="This will delete user permanently."
                        onConfirm={() => this.delete()}
                    />
                    <DeleteConfirmationDialog
                        ref="deleteblessingDialog"
                        title="Are you sure want to delete?"
                        // message="This will delete user permanently."
                        onConfirm={() => this.deleteBlessingHandler()}
                    />

                    <DeleteConfirmationDialog
                        ref="deleteblessingToMoneyDialog"
                        title="Are you sure want to delete?"
                        // message="This will delete user permanently."
                        onConfirm={() => this.deleteBlessingToMoneyHandler()}
                    />
                </RctCollapsibleCard>
            </div>
        );
    }
}
export default Wallet;
