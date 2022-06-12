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
    limit: 15,
    total: "",
    selectedId: "",
    searchStr: "",
    sort: true,
    sortBy: "",
    open: false,
    form: {
      title: "",
      message: "",
    },
  };

  async componentDidMount() {
    console.log("this.props@@@@-->", this.props);
    if (localStorage.getItem("userFilters")) {
      let data = JSON.parse(localStorage.getItem("userFilters"));
      localStorage.removeItem("userFilters");
      await this.setState({
        page_no: data.page_no,
        limit: data.limit,
        searchStr: data.searchStr,
      });
    }
    this.getUsers();
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
    };
    if (this.state.searchStr != "") {
      req_data.searchStr = this.state.searchStr.trim();
    }
    if (this.state.sortBy != "") {
      req_data.sort = this.state.sort ? 1 : 0;
      req_data.sortBy = this.state.sortBy;
    }
    Emit("getUserList", req_data);
    GetResponse((res) => {
      console.log("The res is-->", res);
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
    this.setState({ searchStr: text });
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

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  download = async () => {
    const fileName = "Olekoo_users.xlsx";
    const finalData = [];
    let userData;
    Emit("getAllUsersList", {});
    GetResponse((res) => {
      console.log("\n\n AAZZXXSSDCVFGBHNJMKL->", res);
      userData = res;
      for (let data of res.data) {
        finalData.push({
          Id: data.user_id,
          ["First Name"]: data.first_name || "N/A",
          ["Last Name"]: data.last_name || "N/A",
          ["User Name"]: data.username,
          ["Birthdate"]: data.birthdate || "N/A",
          Gender: data.gender == 1 ? "Male" : "Female",
          Email: data.email || "N/A",
          ["Phone Number"]: data.phone_number
            ? data.country_code + "-" + data.phone_number
            : "N/A",
          Description: data.description || "N/A",
          ["Status"]: data.is_active == 1 ? "Active" : "Inactive",
        });
      }
      const ws = XLSX.utils.json_to_sheet(finalData, { dateNF: "YYYY-MM-DD" });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Edit Report");

      XLSX.writeFile(wb, fileName);
    });
  };

  brodCastPopup = () => {};

  changeValuesHandler = (e) => {
    this.setState({ form: formValueChangeHandler(e, this.state.form) });
  };

  sendBroadcastMessage = () => {
    let reqData = {
      title: this.state.form.title,
      text: this.state.form.message,
    };
    Emit("sendBroadcastMessage", reqData);
    GetResponse((res) => {});
    this.setState({
      open: false,
      form: {
        title: "",
        message: "",
      },
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
  render() {
    console.log("\n\n state-->", this.state);
    return (
      <div className="user-management">
        <PageTitleBar
          title={<IntlMessages id="sidebar.manage_user" />}
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

                      <InputGroupAddon addonType="append" onClick={this.search}>
                        <InputGroupText>
                          <i className="ti-search"></i>
                        </InputGroupText>
                      </InputGroupAddon>
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
                    {/* <th>Full Name</th> */}
                    <th>User Name</th>
                    <th>Signup With</th>
                    <th>
                      Email Id{" "}
                      <i
                        class="fas fa-sort"
                        style={{ marginLeft: "15px" }}
                        onClick={() => this.sortHandler("email")}
                      ></i>
                    </th>
                    <th>Status</th>
                    <th>Action</th>
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
                        {/* <td>{el.full_name ? capitalizeFirstLetter(el.full_name) : "-"}</td> */}
                        {/* <td>{el.username ? capitalizeFirstLetter(el.username) : "-"}</td> */}
                        <td>
                          {el.username ||
                            el.facebook_account_name ||
                            el.google_account_name}
                        </td>
                        {/* || el.sign_up_with==2?"Facebook" || el.sign_up_with==3?"Google" || el.sign_up_with==4?"Twitter" */}
                        <td>
                          {(el.sign_up_with == 1 && "Email") ||
                            (el.sign_up_with == 2 && "Facebook") ||
                            (el.sign_up_with == 3 && "Google") ||
                            (el.sign_up_with == 4 && "Twitter")}
                        </td>
                        <td>{el.email ? el.email : "-"}</td>
                        <td>
                          {el.is_active == 1 ? (
                            <Switch
                              checked={true}
                              color="primary"
                              onChange={() => this.handleChange(el.user_id, 0)}
                            />
                          ) : (
                            <Switch
                              checked={false}
                              color="primary"
                              className=".MuiSwitch-colorPrimary"
                              onChange={() => this.handleChange(el.user_id, 1)}
                            />
                          )}
                        </td>
                        <td className="list-action">
                          <Tooltip id="tooltip-fab" title="User info">
                            <Link
                              to={{
                                pathname: "users/view-user",
                                userFilters: {
                                  page_no: this.state.page_no,
                                  limit: this.state.limit,
                                  searchStr: this.state.searchStr,
                                },
                                search: `?Id=${el.user_id}`,
                              }}
                            >
                              <i className="ti-eye" aria-hidden="true"></i>
                            </Link>
                          </Tooltip>
                          {/* <Tooltip id="tooltip-fab" title="Edit">
                            <Link
                              to={{
                                pathname: "blog-post/edit-blog-post",
                                search: `?blog_post_id=${post.blog_post_id}`,
                              }}
                            >
                              <i className="ti-pencil" aria-hidden="true"></i>
                            </Link>
                          </Tooltip> */}
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
        <DeleteConfirmationDialog
          ref="deleteConfirmationDialog"
          title="Are you sure you want to delete this user?"
          onConfirm={() => this.deleteFeed()}
        />

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">OLEKOO</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              value={this.state.form.title}
              label="Enter Title"
              type="text"
              fullWidth
              onChange={(e) => this.changeValuesHandler(e)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="message"
              name="message"
              value={this.state.form.message}
              label="Enter Message"
              type="text"
              fullWidth
              onChange={(e) => this.changeValuesHandler(e)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={this.handleClose}
              color="primary"
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={this.sendBroadcastMessage}
              className="btn-info text-white"
              disabled={
                this.state.form.title == "" || this.state.form.message == ""
              }
            >
              Send
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
