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

class ViewReportStreaming extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
        }
        this.params = queryString.parse(this.props.location.search)

    }
    componentDidMount() {
        // if (this.props.location.streamFilters) {
        //     localStorage.setItem('streamFilters', JSON.stringify(this.props.location.streamFilters));
        // }
        this.getData();
    }
    getData = async () => {
        let req_data = {
            id: this.params.Id
        }
        Emit('getReportedStreamDetailsById', req_data);
        GetResponse(res => {
            console.log('The res is-->', res);
            this.setState({
                list: res.data
            })
        })
    }
    render() {
       // console.log('\n STATEEEE->', this.state);
        return (
            <div className="animated fadeIn">
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.viewReported"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <Row>
                        <Col xl={12}>
                            <CardBody>
                                <Row className="align-items-right">
                                    <div className="table-responsive">
                                        <div className="unseen">
                                            {/* <Table hover bordered striped> */}
                                            <table className="table table-middle table-hover mb-0 mt-3">
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>User Name</th>
                                                        <th>Reason Text</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.list.length > 0
                                                            ?
                                                            this.state.list.map((l, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{l.username}</td>
                                                                    <td>{l.reason_text}</td>
                                                                    <td>{l.created_date}</td>
                                                                </tr>
                                                            ))
                                                            :
                                                            <tr className="text-center"><td colSpan={3}> No Data Found </td></tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </Row>

                            </CardBody>
                        </Col>
                    </Row>
                </RctCollapsibleCard>
            </div>
        );
    }

}

export default ViewReportStreaming;
