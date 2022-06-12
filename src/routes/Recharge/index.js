/**
 * Responsive
 */
import React from 'react';
import { connect } from 'react-redux';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { displayLog, apiCall, capitalizeFirstLetter, timeStampToDate, confirmBox } from '../../util/common'
import ReactPaginate from 'react-paginate';
import { Emit, GetResponse } from '../../util/connect-socket'
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment'
import 'react-datetime/css/react-datetime.css';
import Datetime from 'react-datetime';
import NumberFormat from 'react-number-format';

import {
    Button,
    Input,
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    CardBody,
    FormGroup
} from 'reactstrap';
import { Link } from 'react-router-dom';

class Recharge extends React.Component {
    state = {
        list: [],
        page_no: 1,
        limit: 10,
        total: '',
        selectedId: '',
        searchStr: '',
        open: false,
        start_date: '',
        end_date: '',
        total_coins: 0
    }
    async componentDidMount() {
        if (localStorage.getItem('rechargeFilters')) {
            let data = JSON.parse(localStorage.getItem('rechargeFilters'))
            console.log('\n\n\n rechargeFilters ___>', data);
            localStorage.removeItem('rechargeFilters')
            await this.setState({
                page_no: data.page_no,
                limit: data.limit,
                searchStr: data.searchStr,
                start_date: data.from,
                end_date: data.to
            })
        }
        this.getRecharges();
    }
    handleChange = async (id, flag) => {
        console.log("name:: ", id, flag);
        let reqData = {
            id: Number(id),
            status: flag
        }
        Emit('changeUserStatus', reqData);
        GetResponse(res => {
            console.log('\n\n RESssssss->', res);
            this.getRecharges();
        })
    };

    handlePageClick = (e) => {
        this.setState({ page_no: e.selected + 1 }, () => {
            this.getRecharges();
        });
    }

    changeLimit = (e) => {
        this.setState({ limit: +e.target.value, page_no: 1 }, () => {
            this.getRecharges();
        });
    }

    getRecharges = async () => {
        if ((this.state.start_date != '' && this.state.end_date != null) || (this.state.end_date != '' && this.state.end_date != null)) {
            if (this.state.start_date != '' && this.state.end_date == '') {
                displayLog(0, 'Please enter end date.');
                return
            }
            if (this.state.end_date != '' && this.state.start_date == '') {
                displayLog(0, 'Please enter start date.');
                return
            }
            if (moment(this.state.end_date).isBefore(moment(this.state.start_date))) {
                displayLog(0, `End date can't be less than start date`);
                return
            }
            else {
                let req_data = {
                    page_no: this.state.page_no,
                    limit: this.state.limit
                }
                if (this.state.searchStr != '') {
                    req_data.searchStr = this.state.searchStr.trim()
                }
                if (this.state.start_date !== undefined && this.state.start_date !== null && this.state.start_date !== "") {
                    req_data['start_date'] = String(Math.floor(new Date(this.state.start_date).getTime() / 1000))
                }
                if (this.state.end_date !== undefined && this.state.end_date !== null && this.state.end_date !== "") {
                    req_data['end_date'] = String(Math.floor(new Date(this.state.end_date).getTime() / 1000))
                }
                console.log("req dataa===========", req_data)
                Emit('getRechargeList', req_data);
                GetResponse(res => {
                    console.log('The res is-->', res);
                    this.setState({ list: res.data.recharges, total: res.data.total, total_coins: res.data.total_coins });
                })
            }
        } else {
            let req_data = {
                page_no: this.state.page_no,
                limit: this.state.limit
            }
            if (this.state.searchStr != '') {
                req_data.searchStr = this.state.searchStr.trim()
            }
            if (this.state.start_date !== undefined && this.state.start_date !== null && this.state.start_date !== "") {
                req_data['start_date'] = String(Math.floor(new Date(this.state.start_date).getTime() / 1000))
            }
            if (this.state.end_date !== undefined && this.state.end_date !== null && this.state.end_date !== "") {
                req_data['end_date'] = String(Math.floor(new Date(this.state.end_date).getTime() / 1000))
            }
            console.log("req dataa===========", req_data)
            Emit('getRechargeList', req_data);
            GetResponse(res => {
                console.log('The res is-->', res);
                this.setState({ list: res.data.recharges, total: res.data.total, total_coins: res.data.total_coins });
            })
        }
    }

    changeSearch = (e) => {
        let text = String(e.target.value);
        this.setState({ searchStr: text })
    }
    enterPressed = async (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            await this.setState({ page_no: 1 })
            this.search()
        }
    }

    search = () => {
        this.getRecharges();
    }
    endDateValidation = (currentDate, startDate) => {
        var yesterday = Datetime.moment(new Date(startDate)).subtract(1, 'day');
        return currentDate.isAfter(yesterday);
    }
    dateChangeHandler = async (e) => {
        await this.setState({ [e.target.name]: e.target.value })
    }
    render() {
        console.log('\n\n state-->', this.state);
        return (
            <div className="user-management">
                <PageTitleBar title={<IntlMessages id="sidebar.recharge" />} match={this.props.match} />
                <RctCollapsibleCard fullBlock>
                    <Row>
                        <Col xl={12}>
                            <CardBody>
                                <Row className="align-items-right">
                                    <Col sm="12" md="2" className="mb-3 mb-xl-0">
                                        <Input type="select" name="limit" value={this.state.limit} onChange={(e) => this.changeLimit(e)} >
                                            <option value={15}>15</option>
                                            <option value={30}>30</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </Input>
                                    </Col>
                                    <Col sm="12" md="2" className="mb-3 mb-xl-0">
                                        <InputGroup>
                                            <Input placeholder="Search.."
                                                type="text"
                                                id={'search'}
                                                value={this.state.searchStr}
                                                name="searchStr" onChange={(e) => this.changeSearch(e)}
                                                onKeyPress={(e) => this.enterPressed(e)} />

                                            <InputGroupAddon addonType="append" onClick={this.search}>
                                                <InputGroupText><i className="ti-search"></i></InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col xs="12" md="3">
                                        <Input type="date" name="start_date" max={this.state.start_date} value={this.state.start_date} onChange={(e) => this.dateChangeHandler(e)} placeholder={`Enter start date`}
                                        />
                                    </Col>
                                    <Col xs="12" md="3">
                                        <Input type="date" name="end_date" min={this.state.end_date} value={this.state.end_date} onChange={(e) => this.dateChangeHandler(e)} placeholder={`Enter end date`}
                                        />
                                    </Col>
                                    <Col sm="12" md="2" className="mb-3 mb-xl-0">
                                        <Button color='primary' variant="contained" className="text-white" onClick={() => this.getRecharges()} title={this.state.start_date == '' || this.state.end_date == '' ? "Select dates" : ""} disabled={this.state.start_date == '' || this.state.end_date == ''}>Select</Button>
                                    </Col>
                                    {
                                        this.state.start_date != '' && this.state.end_date != '' ?
                                            <Col sm="12" md="2" className="mb-3 mb-xl-0">Total: {this.state.total_coins}</Col> : <Col sm="12" md="1" className="mb-3 mb-xl-0"></Col>
                                    }

                                </Row>
                            </CardBody>
                        </Col>
                    </Row>
                    <div className="table-responsive">
                        <div className="unseen">
                            {/* <Table hover bordered striped> */}
                            <table className="table table-middle table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>User Name</th>
                                        <th>Total Coins</th>
                                        <th>Purchase Value</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.list.length > 0 ?
                                            this.state.list.map((el, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1 + ((this.state.page_no - 1) * this.state.limit)}</td>
                                                    <td>{el.username ? capitalizeFirstLetter(el.username) : "-"}</td>
                                                    <td>{el.total_coins ? el.total_coins : "-"}</td>
                                                    <td>{el.purchase_value_type == "Dollar" ?
                                                        <NumberFormat value={el.purchase_value} displayType={'text'} thousandSeparator={true} prefix={'$ '} /> :
                                                        //  "$ "  + el.purchase_value :
                                                        <NumberFormat value={el.purchase_value} displayType={'text'} thousandSeparator={true} prefix={'₦ '} />

                                                    }</td>

                                                    <td>{moment(new Date(el.created_date * 1000)).format('DD MMM, YYYY')}</td>
                                                    <td className="list-action">
                                                        <Tooltip id="tooltip-fab" title="Recharge info">
                                                            <Link to={{
                                                                pathname: 'recharge/view-recharge',
                                                                rechargeFilters: {
                                                                    limit: this.state.limit,
                                                                    from: this.state.start_date,
                                                                    to: this.state.end_date,
                                                                    searchStr: this.state.searchStr,
                                                                    page_no: this.state.page_no
                                                                },
                                                                search: `?Id=${el.transaction_id}`,
                                                            }}><i className="ti-info-alt" aria-hidden="true"></i></Link>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ))
                                            :
                                            <tr className="text-center"><td colSpan={7}> No Data Found </td></tr>
                                    }
                                </tbody>
                                <tfoot className="border-top">
                                    <tr>
                                        <td colSpan="100%" className="Align">
                                            <ReactPaginate
                                                pageCount={Math.ceil(this.state.total / this.state.limit)}
                                                onPageChange={this.handlePageClick}
                                                previousLabel={'Previous'}
                                                nextLabel={'Next'}
                                                breakLabel={'...'}
                                                breakClassName={'page-item'}
                                                breakLinkClassName={'page-link'}
                                                containerClassName={'pagination justify-content-end'}
                                                pageClassName={'page-item'}
                                                pageLinkClassName={'page-link'}
                                                previousClassName={'page-item'}
                                                previousLinkClassName={'page-link'}
                                                nextClassName={'page-item'}
                                                nextLinkClassName={'page-link'}
                                                activeClassName={'active'}
                                                forcePage={this.state.page_no - 1}
                                            />
                                        </td>
                                    </tr>
                                </tfoot>

                            </table>
                        </div>
                    </div>

                </RctCollapsibleCard>
            </div >
        );
    }
}
export default Recharge;
