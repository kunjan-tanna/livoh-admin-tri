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
import moment from "moment";

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
    searchStr: "",
    sort: true,
    sortBy: "",
  };

  async componentDidMount() {
    this.getEventlist();
  }
  getEventlist = async () => {
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
    Emit("getEventListForAdmin", req_data);
    GetResponse((res) => {
      console.log("The res is-->", res);
      this.setState({ list: res.data.events, total: res.data.total });
    });
  };

  handlePageClick = (e) => {
    this.setState({ page_no: e.selected + 1 }, () => {
      this.getEventlist();
    });
  };
  changeLimit = (e) => {
    this.setState({ limit: +e.target.value, page_no: 1 }, () => {
      this.getEventlist();
    });
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
    this.getEventlist();
  };

  sortHandler = (sortby) => {
    this.setState(
      {
        sort: !this.state.sort,
        sortBy: sortby,
      },
      () => {
        this.getEventlist();
      }
    );
  };
  render() {
    //console.log('\n\n state-->', this.state);
    return (
      <div className="user-management">
        <PageTitleBar
          title={<IntlMessages id="sidebar.event_list" />}
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
                    <th>Event Name</th>
                    <th>Username</th>
                    <th>
                      Email Id{" "}
                      <i
                        class="fas fa-sort"
                        style={{ marginLeft: "15px" }}
                        onClick={() => this.sortHandler("email")}
                      ></i>
                    </th>
                    <th>Event Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Location</th>
                    <th>Description</th>
                    <th>action</th>
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
                        {/* <td>{el.sign_up_with == 1 && "Email" || el.sign_up_with == 2 && "Facebook" || el.sign_up_with == 3 && "Google" || el.sign_up_with == 4 && "Twitter"}</td> */}
                        <td className="Event_name" title={el.name}>
                          {el.name ? el.name : "-"}
                        </td>
                        <td>{el.username ? el.username : "-"}</td>
                        <td className="Event_email" title={el.email}>
                          {el.email ? el.email : "-"}
                        </td>
                        <td>
                          {el.date
                            ? moment(el.date).format("MMMM Do YYYY")
                            : "-"}
                        </td>
                        <td>{el.start_time ? el.start_time : "-"}</td>
                        <td>{el.end_time ? el.end_time : "-"}</td>
                        <td>{el.location ? el.location : "-"}</td>
                        <td
                          className="Event_description"
                          title={el.description}
                        >
                          {el.description ? el.description : "-"}
                        </td>
                        <td className="list-action">
                          <Tooltip id="tooltip-fab" title="Event info">
                            <Link
                              to={{
                                pathname: "eventlist/view-event",
                                userFilters: {
                                  page_no: this.state.page_no,
                                  limit: this.state.limit,
                                  searchStr: this.state.searchStr,
                                },
                                search: `?event_id=${el.event_id}`,
                              }}
                            >
                              {" "}
                              <i className="ti-eye" aria-hidden="true"></i>
                            </Link>
                          </Tooltip>
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
