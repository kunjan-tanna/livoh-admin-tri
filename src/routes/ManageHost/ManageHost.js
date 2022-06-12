/**
 * Responsive
 */
import React from "react";
import { connect } from "react-redux";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import {
  displayLog,
  apiCall,
  capitalizeFirstLetter,
  timeStampToDate,
  confirmBox,
  formValueChangeHandler,
} from "../../util/common";
import Switch from "@material-ui/core/Switch";

import ReactPaginate from "react-paginate";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import { Emit, GetResponse, Disconnect } from "../../util/connect-socket";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import XLSX from "xlsx";

import {
  Button,
  Input,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  CardBody,
} from "reactstrap";
import { Link } from "react-router-dom";

class User extends React.Component {
  state = {
    list: [],
    page_no: 1,
    limit: 10,
    total: "",
    selectedId: "",
    searchStr: "",
    sort: true,
    sortBy: "",
    open: false,
    openReject: false,
    form: {
      title: "",
      message: "",
    },
    userId: null,
    type: 1,
  };

  async componentDidMount() {
    // console.log('this.props@@@@-->', this.props);
    // if (localStorage.getItem('userFilters')) {
    //     let data = JSON.parse(localStorage.getItem('userFilters'));
    //     localStorage.removeItem('userFilters');
    //     await this.setState({
    //         page_no: data.page_no,
    //         limit: data.limit,
    //         searchStr: data.searchStr,
    //     })
    // }
    setTimeout(() => {
      this.getUsers();
    }, 1000);
  }

  handleChange = async (id, flag) => {
    console.log("name:: ", id, flag);
    let reqData = {
      user_id: Number(id),
      is_active: flag,
    };
    Emit("userStatusUpdate", reqData);
    GetResponse((res) => {
      console.log("\n\n RESssssss->", res);
      this.getUsers();
    });
    // await apiCall('POST', 'editUserStatus', reqData);
  };

  handlePageClick = (e) => {
    console.log("FFFF", e.selected);
    this.setState({ page_no: e.selected + 1 }, () => {
      this.getUsers();
    });
  };

  changeLimit = (e) => {
    this.setState({ limit: +e.target.value, page_no: 1 }, () => {
      this.getUsers();
    });
  };

  getUsers = async () => {
    let req_data = {
      page_no: this.state.page_no,
      limit: this.state.limit,
      type: this.state.type,
      sortBy: "role",
      sort: 1,
    };
    if (this.state.searchStr != "") {
      req_data.searchStr = this.state.searchStr.trim();
    }
    if (this.state.sortBy != "") {
      req_data.sort = this.state.sort ? 1 : 0;
      req_data.sortBy = this.state.sortBy;
    }
    Emit("getHostUserList", req_data);
    GetResponse((res) => {
      console.log("The res is-->kkkk", res);
      this.setState({ list: res.data.users, total: res.data.total });
    });
    // let data = await apiCall('POST', 'getUserList', req_data);
    // this.setState({ list: data.data, total: data.total })
    // console.log('\n\n LIST->', data);
  };

  deleteHandler = async (id) => {
    this.setState({ selectedId: id });
    this.refs.deleteConfirmationDialog.open();
  };

  deleteFeed = async () => {
    this.refs.deleteConfirmationDialog.close();
    let reqData = {
      id: this.state.selectedId,
    };
    let data = await apiCall("POST", "deleteUser", reqData);
    displayLog(data.code, data.message);
    this.getUsers();
    console.log("\n\n DATa->", data);
  };

  changeSearch = (e) => {
    let text = String(e.target.value);
    // console.log("FFF", e.target.value.length);
    this.setState({ searchStr: text });
    if (String(e.target.value.length) == 0) {
      this.setState({ type: 1 }, () => {
        this.getUsers();
      });

      // window.location.reload();
    }
  };
  enterPressed = async (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      await this.setState({ page_no: 1 });
      this.search();
    }
  };

  search = () => {
    this.getUsers();
  };

  // handleClickOpen = () => {
  //     this.setState({ open: true });
  // };

  changeValuesHandler = (e) => {
    this.setState({ form: formValueChangeHandler(e, this.state.form) });
  };

  onApproveHandler = () => {
    console.log("approve click", this.state.userId);
    let reqData = {
      user_id: this.state.userId,
      is_approve: 1,
    };
    Emit("ApproveOrRejectHost", reqData);
    GetResponse((response) => {
      console.log("$$$$$$$ res->FOR APPROVE", response);
      if (response.code === 1) {
        this.getUsers();
        this.setState({ open: false });
      }
    });
  };
  onRejectHandler = (user_id) => {
    // console.log("reject click", user_id);
    let reqData = {
      user_id: this.state.userId,
      is_approve: 0,
    };
    Emit("ApproveOrRejectHost", reqData);
    GetResponse((response) => {
      console.log("$$$$$$$ res->", response);
      if (response.code === 1) {
        this.getUsers();
        this.setState({ openReject: false });
      }
    });
  };
  sortHandler = (sortby) => {
    this.setState(
      {
        sort: !this.state.sort,
        sortBy: sortby,
      },
      () => {
        this.getUsers();
      }
    );
  };
  //Open the Modal
  handleOpen = (userId) => {
    this.setState({ open: true, userId: userId });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleOpenReject = (userId) => {
    this.setState({ openReject: true, userId: userId });
  };
  handleCloseReject = () => {
    this.setState({ openReject: false });
  };
  //Filter the Host Data
  changeRequest = (e) => {
    this.setState({ type: +e.target.value });
  };
  //Handle the Host
  handleHost = () => {
    this.setState({ page_no: 1 }, () => {
      this.getUsers();
    });

    // return this.getUsers();
  };
  render() {
    //console.log('\n\n state-->', this.state);
    return (
      <div className="user-management">
        {/* <PageTitleBar
          title={<IntlMessages id="sidebar.event_list" />}
          match={this.props.match}
        /> */}
        <PageTitleBar
          title={<IntlMessages id="sidebar.manage_host" />}
          match={this.props.match}
        />
        <RctCollapsibleCard fullBlock>
          <Row>
            <Col xl={12}>
              <CardBody>
                <Row className="align-items-right topSearch">
                  <Col sm="12" md="2" className="mb-3 mb-xl-0">
                    <Input
                      className="customSelect"
                      type="select"
                      name="limit"
                      value={this.state.limit}
                      onChange={(e) => this.changeLimit(e)}
                    >
                      <option value={15}>15</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </Input>
                  </Col>
                  {/* <Col sm="12" md="2" className="mb-3 mb-xl-0">
                                        <Button color='primary' variant="contained" className="text-white" onClick={() => this.download()}>Export to CSV</Button>
                                    </Col>
                                    <Col sm="12" md="3" className="mb-3 mb-xl-0">
                                        <Button color='primary' variant="contained" className="text-white" onClick={this.handleClickOpen}>Send Broadcast Message</Button>
                                    </Col> */}

                  {/* <Col sm="12" md="1" className="mb-3 mb-xl-0">
                                    </Col> */}
                  {/* <Col sm="12" md="1" className="mt-2 mb-xl-0">
                                        {
                                            this.state.total && "Total: " + this.state.total
                                        }
                                    </Col> */}
                  <Col sm="12" md="3" className="mb-3 mb-xl-0">
                    <InputGroup>
                      <Input
                        placeholder="Search.."
                        type="text"
                        id={"search"}
                        value={this.state.searchStr}
                        name="searchStr"
                        onChange={(e) => this.changeSearch(e)}
                        onKeyPress={(e) => this.enterPressed(e)}
                      />

                      <InputGroupAddon
                        addonType="append"
                        onClick={this.search}
                        style={{ cursor: "pointer" }}
                      >
                        <InputGroupText>
                          <i className="ti-search"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </Row>
                <br />
                <Row className="align-items-right topSearch">
                  <Col sm="12" md="2" className="mb-3 mb-xl-0"></Col>
                  {/* <Col sm="12" md="2" className="mb-3 mb-xl-0">
                                        <Button color='primary' variant="contained" className="text-white" onClick={() => this.download()}>Export to CSV</Button>
                                    </Col>
                                    <Col sm="12" md="3" className="mb-3 mb-xl-0">
                                        <Button color='primary' variant="contained" className="text-white" onClick={this.handleClickOpen}>Send Broadcast Message</Button>
                                    </Col> */}

                  {/* <Col sm="12" md="1" className="mb-3 mb-xl-0">
                                    </Col> */}
                  {/* <Col sm="12" md="1" className="mt-2 mb-xl-0">
                                        {
                                            this.state.total && "Total: " + this.state.total
                                        }
                                    </Col> */}
                  <Col sm="12" md="3" className="mb-3 mb-xl-0">
                    <InputGroup>
                      <Input
                        className="customSelect"
                        type="select"
                        name="limit"
                        // value={this.state.limit}
                        onChange={(e) => this.changeRequest(e)}
                      >
                        <option value={1}>All</option>
                        <option value={2}>Pending</option>
                        <option value={3}>Approved</option>
                        <option value={4}>Rejected</option>
                      </Input>
                      &nbsp;
                      <Button
                        color="primary"
                        variant="contained"
                        className="text-white"
                        onClick={() => this.handleHost()}
                      >
                        Search
                      </Button>
                    </InputGroup>
                  </Col>
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
                    {/* <th>Signup With</th> */}
                    <th>
                      Email Id{" "}
                      <i
                        class="fas fa-sort"
                        style={{ marginLeft: "15px" }}
                        onClick={() => this.sortHandler("email")}
                      ></i>
                    </th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.list.length > 0 ? (
                    this.state.list.map((el, index) => (
                      <tr key={index}>
                        <td>
                          {index +
                            1 +
                            (this.state.page_no - 1) * this.state.limit}
                        </td>
                        <td>
                          {el.username ||
                            el.facebook_account_name ||
                            el.google_account_name}
                        </td>
                        {/* <td>{el.sign_up_with == 1 && "Email" || el.sign_up_with == 2 && "Facebook" || el.sign_up_with == 3 && "Google" || el.sign_up_with == 4 && "Twitter"}</td> */}
                        <td>{el.email ? el.email : "-"}</td>

                        <td>
                          {el.role == 2
                            ? "Pending"
                            : el.role == 3
                            ? "Approved"
                            : el.role == 4
                            ? "Rejected "
                            : "-"}
                        </td>
                        <td>
                          <div className="d-flex justify-content-around flex-wrap">
                            {el.role == 2 ? (
                              <>
                                {" "}
                                <Button
                                  variant="contained"
                                  className="text-white btn-danger"
                                  onClick={() =>
                                    this.handleOpenReject(el.user_id)
                                  }
                                >
                                  Reject
                                </Button>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  className="text-white"
                                  onClick={() => this.handleOpen(el.user_id)}
                                >
                                  Approve
                                </Button>{" "}
                              </>
                            ) : el.role == 3 ? (
                              "-"
                            ) : el.role == 4 ? (
                              "-"
                            ) : (
                              "-"
                            )}
                          </div>
                          {/* 
                                                        <div className="row button-outer">
                                                            <div className="col-6"> <Button color='danger' variant="contained" className="text-white" onClick={() => this.onRejectHandler(el.user_id)}>Reject</Button></div>
                                                            <div className="col-6"> <Button color='primary' variant="contained" className="text-white" onClick={() => this.onApproveHandler(el.user_id)}>Approve</Button></div>
                                                        </div> */}

                          {/* <div className="row button-outer">
                            <div className="col-6">
                              {" "}
                              <button
                                type="button"
                                className="pinkBtn text-center"
                              >
                                Reject
                              </button>
                            </div>
                            <div className="col-6">
                              {" "}
                              <button
                                type="button"
                                className="blueinnerBtn text-center"
                                onClick={this.onApproveHandler}
                              >
                                save profile
                              </button>
                            </div>
                          </div> */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center">
                      <td colSpan={7}> No Data Found </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-top">
                  <tr>
                    <td colSpan="100%" className="Align">
                      <ReactPaginate
                        pageCount={Math.ceil(
                          this.state.total / this.state.limit
                        )}
                        onPageChange={this.handlePageClick}
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        containerClassName={"pagination justify-content-end"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        activeClassName={"active"}
                        forcePage={this.state.page_no - 1}
                      />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </RctCollapsibleCard>

        {/* <DeleteConfirmationDialog
          ref="deleteConfirmationDialog"
          title="Are you sure you want to delete this user?"
          onConfirm={() => this.deleteFeed()}
        /> */}

        {/* Open Dialog Box for approval */}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Are you sure you want to approve the host?
          </DialogTitle>

          <DialogActions>
            <Button
              variant="contained"
              onClick={this.handleClose}
              style={{ background: "#FD5A7F" }}
              className="text-white"
            >
              No
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={this.sendBroadcastMessage}
              className="text-white"
              onClick={() => this.onApproveHandler()}
              //   disabled={
              //     this.state.form.title == "" || this.state.form.message == ""
              //   }
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* open Dialog Box For Rejection */}
        <Dialog
          open={this.state.openReject}
          onClose={this.handleCloseReject}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Are you sure you want to reject the host?
          </DialogTitle>

          <DialogActions>
            <Button
              variant="contained"
              onClick={this.handleCloseReject}
              style={{ background: "#FD5A7F" }}
              className="text-white"
            >
              No
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={this.sendBroadcastMessage}
              className="text-white"
              onClick={() => this.onRejectHandler()}
              //   disabled={
              //     this.state.form.title == "" || this.state.form.message == ""
              //   }
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
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

export default connect(mapStateToProps)(User);

// export default User;
