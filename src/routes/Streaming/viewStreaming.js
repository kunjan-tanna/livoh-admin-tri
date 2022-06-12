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

class ViewStreaming extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            open: false,
            main_brod: "",
            co_brod: [],
            likes: "",
            streaming_mode_type: "",
            streaming_type: "",
            title: "",
            total_viewer: "",
            time: "",
            form: {


            },
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
        Emit('getStreamDetailsById', req_data);
        GetResponse(res => {
            console.log('The res is-->', res);
            this.setState({
                main_brod: res.data.data.main_data[0].main_brodcaster,
                co_brod: res.data.data.co_brodcasters,
                likes: res.data.data.main_data[0].likes,
                streaming_mode_type: res.data.data.main_data[0].streaming_mode_type,
                streaming_type: res.data.data.main_data[0].streaming_type,
                title: res.data.data.main_data[0].title,
                total_viewer: res.data.data.total_viewer,
                time: res.data.data.time
            })
            // this.setState({ list: res.data[0] });
        })
    }
    render() {
       // console.log('\n STATEEEE->', this.state);
        return (
            <div className="animated fadeIn">
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.viewStreaming"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <Row>
                        <Col xl={12}>
                            <CardBody>
                                <Row>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Main broadcaster</Label>
                                            <Input type="text"
                                                value={this.state.main_brod ? this.state.main_brod : "N/A"}
                                                disabled={true}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight"> Co-broadcaster</Label>
                                            <Input type="text"
                                                value={this.state.co_brod.length > 0 ?
                                                    this.state.co_brod.map(co => {
                                                        return co.username
                                                    })
                                                    :
                                                    "N/A"}
                                                disabled={true}
                                            />
                                        </FormGroup>
                                    </Col>
                                    {/* {
                                        this.state.co_brod.length > 0 ?
                                            this.state.co_brod.map((co, index) => (
                                                <Col xs="12" md="6">
                                                    <FormGroup>
                                                        <Label className="label-weight"> Co-broadcaster {index + 1}</Label>
                                                        <Input type="text"
                                                            value={co.username}
                                                            disabled={true}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            ))
                                            :
                                            <Col xs="12" md="6">
                                                <FormGroup>
                                                    <Label className="label-weight"> Co-broadcaster</Label>
                                                    <Input type="text"
                                                        value={"N/A"}
                                                        disabled={true}
                                                    />
                                                </FormGroup>
                                            </Col>
                                    } */}
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Viewers</Label>
                                            <Input type="text"
                                                value={this.state.total_viewer ? this.state.total_viewer : "N/A"}
                                                disabled={true}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Stream Title</Label>
                                            <Input type="text"
                                                value={this.state.title ? this.state.title : "N/A"}
                                                disabled={true}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Likes</Label>
                                            <Input type="text"
                                                value={this.state.likes ? this.state.likes : "N/A"}
                                                disabled={true}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" md="6">
                                        <FormGroup>
                                            <Label className="label-weight">Stream Time</Label>
                                            <Input type="text"
                                                value={this.state.time ? this.state.time : "N/A"}
                                                disabled={true}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Col>
                    </Row>
                </RctCollapsibleCard>

                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">OLEKOO</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText>
                            To subscribe to this website, please enter your email address here. We will send
                                   updates occationally.
            		</DialogContentText> */}
                        <TextField autoFocus margin="dense" id="name" label="Enter coins" type="number" name="coin" value={this.state.form.coin} fullWidth onChange={(e) => this.changeValuesHandler(e)} />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={this.handleClose} color="primary" className="text-white">
                            Cancel
            		</Button>
                        <Button variant="contained" onClick={this.addCoinsHandler} className="btn-info text-white">
                            Send
            		</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}

export default ViewStreaming;
