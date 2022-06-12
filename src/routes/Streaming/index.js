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

class Streaming extends React.Component {
    state = {
        streamingList: [],
        reportedList: [],
        page_no: 1,
        limit: 10,
        total: '',
        streamingTotal: '',
        activeTab: '1',
        searchStr: '',
    }

    async componentDidMount() {
        if (localStorage.getItem('streamFilters')) {
            let data = JSON.parse(localStorage.getItem('streamFilters'))
            console.log('\n\n\n STREAMING ___>', data);
            localStorage.removeItem('streamFilters')
            await this.setState({
                activeTab: data.tab,
                page_no: data.page_no,
                limit: data.limit,
                searchStr: data.searchStr
            })
        }
        this.getData();
    }

    getData = async () => {
        let reqData = {
            page_no: this.state.page_no,
            limit: this.state.limit
        }
        if (this.state.searchStr != '') {
            reqData.searchStr = this.state.searchStr.trim()
        }
        await Emit('getStreamingList', reqData);
        await GetResponse(res => {
            console.log('streaming data->', res);
            this.setState({
                streamingList: res.data.getStreamingList.users,
                reportedList: res.data.getreportStreaming.streaming,
                streamingTotal: res.data.getreportStreaming.streamingTotal,
                total: res.data.getStreamingList.total
            })
        })

        // await Emit('getreportStreaming',reqData)
        // await GetResponse(res => {
        //     console.log('getreportStreaming data->', res);
        //     // this.setState({ reportedList: res.data.users, total: res.data.total })
        // })
    }
    toggle = async (tab) => {
        if (this.state.activeTab !== tab) {
            await this.setState({ activeTab: tab, page_no: 1, limit: 15, searchStr: "" })
            await this.getData();
        }
    }

    changeLimit = (e) => {
        this.setState({ limit: +e.target.value, page_no: 1 }, () => {
            this.getData();
        });
    }

    search = () => {
        this.getData();
    }

    handlePageClick = (e) => {
        this.setState({ page_no: e.selected + 1 }, () => {
            this.getData();
        });
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

    deactiveStreamer = (streamerId) => {

        let reqData = {
            streamerId: this.state.streamerId
        }
        this.refs.deleteConfirmationDialog.close();
        Emit('inActiveStreamer', reqData);
        GetResponse(res => {
            this.getData();
        })
    }

    deleteConfirmation = (id) => {
        this.setState({ streamerId: id })
        this.refs.deleteConfirmationDialog.open();
    }

    handleChange = (id, status) => {
        let reqData = {
            streamerId: id,
            status: status
        }
        // this.refs.deleteConfirmationDialog.close();
        Emit('inActiveStreamer', reqData);
        GetResponse(res => {
            this.getData();
        })
    }

    render() {
        return (
            <div className="animated fadeIn">
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.streaming"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}
                            >
                                Streaming
                    </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}
                            >
                                Reported Streamers
                    </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <div className="user-management">
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
                                                    <Col sm="12" md="7" className="mb-3 mb-xl-0"></Col>

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
                                                <div className="table-responsive">
                                                    <div className="unseen">
                                                        {/* <Table hover bordered striped> */}
                                                        <table className="table table-middle table-hover mb-0 mt-3">
                                                            <thead>
                                                                <tr>
                                                                    <th>No</th>
                                                                    <th>User Name</th>
                                                                    <th>Stream Name</th>
                                                                    <th>Stream Mode</th>
                                                                    <th>Stream Type</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    this.state.streamingList.length > 0
                                                                        ?
                                                                        this.state.streamingList.map((st, index) => (
                                                                            <tr key={index}>
                                                                                <td>{index + 1 + ((this.state.page_no - 1) * this.state.limit)}</td>
                                                                                <td>{st.username}</td>
                                                                                <td>{st.streaming_title}</td>
                                                                                <td>{st.streaming_mode_type ?
                                                                                    st.streaming_mode_type == 1 ?
                                                                                        "Single" :
                                                                                        st.streaming_mode_type == 2 ?
                                                                                            "Multiperson" : "-"
                                                                                    : "-"}</td>
                                                                                <td>{st.streaming_type ?
                                                                                    st.streaming_type == 1 ?
                                                                                        "Video" :
                                                                                        st.streaming_type == 2 ?
                                                                                            "Audio" : "-"
                                                                                    : "-"}</td>
                                                                                <td className="list-action">
                                                                                    <Tooltip id="tooltip-fab" title="Stream info">
                                                                                        <Link to={{
                                                                                            pathname: 'streaming/view-streaming',
                                                                                            streamFilters: {
                                                                                                tab: this.state.activeTab,
                                                                                                page_no: this.state.page_no,
                                                                                                limit: this.state.limit,
                                                                                                searchStr: this.state.searchStr
                                                                                            },
                                                                                            search: `?Id=${st.streaming_id}`,
                                                                                        }}><i className="ti-info-alt" aria-hidden="true"></i></Link>
                                                                                    </Tooltip>
                                                                                    {/* <Tooltip id="tooltip-fab" title="Send coins"><i className="ti-share" aria-hidden="true" onClick={this.handleClickOpen}></i></Tooltip> */}

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
                                            </CardBody>
                                        </Col>
                                    </Row>
                                </RctCollapsibleCard>
                            </div>
                        </TabPane>
                        <TabPane tabId="2">
                            <div className="user-management">
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
                                                    <Col sm="12" md="7" className="mb-3 mb-xl-0"></Col>

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
                                                <div className="table-responsive">
                                                    <div className="unseen">
                                                        {/* <Table hover bordered striped> */}
                                                        <table className="table table-middle table-hover mb-0 mt-3">
                                                            <thead>
                                                                <tr>
                                                                    <th>No</th>
                                                                    <th>Streamer Name</th>
                                                                    <th>Stream Title</th>
                                                                    <th>Date</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    this.state.reportedList.length > 0
                                                                        ?
                                                                        this.state.reportedList.map((rt, index) => (
                                                                            <tr key={index}>
                                                                                <td>{index + 1 + ((this.state.page_no - 1) * this.state.limit)}</td>
                                                                                <td>{rt.username}</td>
                                                                                <td>{rt.streaming_title}</td>
                                                                                <td>{rt.date}</td>
                                                                                <td className="list-action">
                                                                                    <div>
                                                                                        {
                                                                                            rt.user_status == 1 ?
                                                                                                <Switch checked={true} onChange={() => this.handleChange(rt.streamer_id, 0)} />
                                                                                                :
                                                                                                <Switch checked={false} onChange={() => this.handleChange(rt.streamer_id, 1)} />

                                                                                        }
                                                                                   
                                                                                    <Tooltip id="tooltip-fab" title="Stream info">
                                                                                        <Link to={{
                                                                                            pathname: 'streaming/view-reported',
                                                                                            streamFilters: {
                                                                                                tab: this.state.activeTab,
                                                                                                page_no: this.state.page_no,
                                                                                                limit: this.state.limit,
                                                                                                searchStr: this.state.searchStr
                                                                                            },
                                                                                            search: `?Id=${rt.streaming_id}`,
                                                                                        }}><i className="ti-info-alt infoIcon" aria-hidden="true"></i></Link>
                                                                                    </Tooltip>
                                                                                    </div>
                                                                                    {/* <Tooltip id="tooltip-fab" title="Inactive User"><i className="ti-close" aria-hidden="true" onClick={() => this.deleteConfirmation(rt.streamer_id)}></i></Tooltip> */}

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
                                                                            pageCount={Math.ceil(this.state.streamingTotal / this.state.limit)}
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
                                            </CardBody>
                                        </Col>
                                    </Row>
                                </RctCollapsibleCard>
                                <DeleteConfirmationDialog
                                    ref="deleteConfirmationDialog"
                                    title="Are you sure you want to Inactive this streamer?"
                                    onConfirm={() => this.deactiveStreamer()}
                                />
                            </div>
                        </TabPane>
                    </TabContent>
                </RctCollapsibleCard>

            </div>
        );
    }
}

export default Streaming;