/**
 * Responsive
 */
import React from 'react';
import { connect } from 'react-redux';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { displayLog, apiCall, capitalizeFirstLetter, timeStampToDate, confirmBox } from '../../util/common'
import Switch from '@material-ui/core/Switch';
import ReactPaginate from 'react-paginate';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { Emit, GetResponse, Disconnect } from '../../util/connect-socket'
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import XLSX from 'xlsx';
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
    Label
} from 'reactstrap';
import { Link } from 'react-router-dom';

class Cashout extends React.Component {
    state = {
        list: [],
        page_no: 1,
        limit: 10,
        total: '',
        selectedId: '',
        searchStr: '',
        open: false,
        counts: []
    }


    async componentDidMount() {
        await this.getData();
    }

    // getCashoutCounts = () => {
    //     Emit('getCashoutCounts', {})
    //     GetResponse((res => {
    //         console.log('\n\n COUNTSSSSS_>', res);
    //     })
    // }

    handleChange = async (id, flag) => {
        console.log("name:: ", id, flag);
        let reqData = {
            id: Number(id),
            status: flag
        }
        Emit('changeUserStatus', reqData);
        GetResponse(res => {
            console.log('\n\n RESssssss->', res);
            this.getData();
        })
        // await apiCall('POST', 'editUserStatus', reqData);
    };

    handlePageClick = (e) => {
        this.setState({ page_no: e.selected + 1 }, () => {
            this.getData();
        });
    }

    changeLimit = (e) => {
        this.setState({ limit: +e.target.value, page_no: 1 }, () => {
            this.getData();
        });
    }

    getData = async () => {
        console.log('\n\n\n HHHHHHHHJJJJJJJJJJJJJJJJHHHHHHHHHHHHHHHHHHJJJJJJ');
        let req_data = {
            page_no: this.state.page_no,
            limit: this.state.limit
        }
        if (this.state.searchStr != '') {
            req_data.searchStr = this.state.searchStr.trim()
        }
        Emit('getCashoutRequestList', req_data);
        GetResponse(res => {
            console.log('cashout res is-->', res);
            this.setState({ list: res.data.result.cashout, total: res.data.result.total, counts: res.data.counts });
        })
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
        this.getData();
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleReject = async (id) => {
        this.refs.RejectConfirmationDialog.close();
        let reqData = {
            cashout_transfer_history_id: this.state.rejectableId
        }
        Emit('rejectCashout', reqData)
        GetResponse(res => {
            this.getData();
        })
    }

    handleAcceptPopup = (data) => {
        this.refs.AcceptConfirmationDialog.open();
        this.setState({ acceptData: data })
    }

    handleRejectPopup = (id) => {
        this.setState({ rejectableId: id })
        this.refs.RejectConfirmationDialog.open();
    }

    handleAccept = (data1) => {
        console.log('\n\n DATA is->', data1);
        this.refs.AcceptConfirmationDialog.close();
        let data = this.state.acceptData
        if (data.cashout_mode == 1) {
            // Bank
            let reqData = {
                cashout_transfer_history_id: data.cashout_transfer_history_id,
                amount: data.received_money,
                recipient: data.recipient_code
            }
            Emit('acceptBankAccountCashout', reqData)
            GetResponse(res => {
                this.getData()
            })
        } else {
            // paypal
            let reqData = {
                cashout_transfer_history_id: data.cashout_transfer_history_id,
                amount: data.received_money,
                email: data.paypal_email
            }
            Emit('acceptPaypalCashout', reqData)
            GetResponse(res => {
                this.getData()
            })
        }
    }

    render() {
        console.log('\n\n state-->', this.state);
        return (
            <div className="user-management">
                <PageTitleBar title={<IntlMessages id="sidebar.cashout" />} match={this.props.match} />
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
                                    <Col sm="12" md="7" className="mb-3 mb-xl-0">
                                    </Col>

                                    <Col sm="12" md="3" className="mb-3 mb-xl-0">
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
                                </Row>
                                {
                                    this.state.counts.length > 0 &&

                                    <Row className="mt-2">
                                        <Col sm="12" md="3" className="mb-xl-0">
                                            <Label>Pending Cashout</Label>
                                            <Col sm="12" md="12" className="mb-xl-0">
                                                &#8358; {this.state.counts[0].pending_naira}
                                            </Col>
                                            <Col sm="12" md="12" className="mb-xl-0">
                                                $ {this.state.counts[0].pending_dollar}
                                            </Col>
                                        </Col>
                                        <Col sm="12" md="6" className="mb-xl-0">
                                            <Label>Approved Cashout</Label>
                                            <Col sm="12" md="3" className="mb-xl-0">
                                                &#8358; {this.state.counts[0].approved_naira}
                                            </Col>
                                            <Col sm="12" md="3" className="mb-xl-0">
                                                $ {this.state.counts[0].approved_dollar}
                                            </Col>
                                        </Col>
                                        {/* <Col sm="12" md="3" className="mb-xl-0">
                                            Pending cashout: &#8358; {this.state.counts[0].pending_naira}
                                        </Col>
                                        <Col sm="12" md="3" className="mb-xl-0">
                                            Approved cashout: &#8358; {this.state.counts[0].approved_naira}
                                        </Col>
                                        <Col sm="12" md="3" className="mb-xl-0">
                                            Pending cashout: $ {this.state.counts[0].pending_dollar}
                                        </Col>
                                        <Col sm="12" md="3" className="mb-xl-0">
                                            Approved cashout: $ {this.state.counts[0].approved_dollar}
                                        </Col> */}
                                    </Row>
                                }
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
                                        {/* <th>Full Name</th> */}
                                        <th>User Name</th>
                                        <th>Blessings</th>
                                        <th>Receivable Money</th>
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
                                                    <td>{el.blessings ? el.blessings : "-"}</td>
                                                    <td>{el.received_money ? <NumberFormat value={el.received_money} displayType={'text'} thousandSeparator={true} prefix={el.currency == 1 ? '₦ ' : '$ '} /> : "-"}</td>
                                                    <td>{el.date}</td>

                                                    <td className="list-action">
                                                        <Tooltip id="tooltip-fab" title="User info">
                                                            <Link to={{
                                                                pathname: 'cashout/view-cashout',
                                                                search: `?Id=${el.cashout_transfer_history_id}`,
                                                            }}
                                                            ><i className="ti-info-alt" aria-hidden="true"></i></Link>
                                                        </Tooltip>
                                                        <Tooltip id="tooltip-fab" title="Accept"><i className="ti-check infoIconCashout" aria-hidden="true" onClick={() => this.handleAcceptPopup(el)}></i></Tooltip>
                                                        <Tooltip id="tooltip-fab" title="Reject"><i className="ti-close infoIconCashout" aria-hidden="true" onClick={() => this.handleRejectPopup(el.cashout_transfer_history_id)}></i></Tooltip>

                                                    </td>
                                                </tr>
                                            ))
                                            :
                                            <tr className="text-center"><td colSpan={6}> No Data Found </td></tr>
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
                <DeleteConfirmationDialog
                    ref="RejectConfirmationDialog"
                    title="Are you sure want to reject?"
                    onConfirm={() => this.handleReject()}
                />

                <DeleteConfirmationDialog
                    ref="AcceptConfirmationDialog"
                    title="Are you sure want to accept?"
                    onConfirm={() => this.handleAccept()}
                />

                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">OLEKOO</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText>
                            To subscribe to this website, please enter your email address here. We will send
                                   updates occationally.
            		</DialogContentText> */}
                        <TextField autoFocus margin="dense" id="name" label="Enter coins" type="number" fullWidth />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={this.handleClose} color="primary" className="text-white">
                            Cancel
            		</Button>
                        <Button variant="contained" onClick={this.handleClose} className="btn-info text-white">
                            Send
            		</Button>
                    </DialogActions>
                </Dialog>
            </div >

        );
    }
}

const mapStateToProps = ({ authUser }) => {
    const { user } = authUser;
    return {
        user,
        loading: authUser.loading,
    };
};

export default connect(mapStateToProps)(Cashout);

        // export default User;
