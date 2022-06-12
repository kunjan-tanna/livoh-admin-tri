import React, { Component } from "react";
import { connect } from "react-redux";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { displayLog } from "../../util/common";
import ReactPaginate from "react-paginate";
import { Emit, GetResponse, Disconnect } from "../../util/connect-socket";
import Tooltip from "@material-ui/core/Tooltip";
import XLSX from "xlsx";
import moment from "moment";

import {
  Input,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  CardBody,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";

class Transactions extends Component {
  state = {
    list: [],
    page_no: 1,
    limit: 15,
    total: "",
    searchStr: "",
    sort: true,
    sortBy: "",
    type: 1,
    subscriptionList: [],
  };
  async componentDidMount() {
    this.getTransactionlist();
  }
  getTransactionlist = async () => {
    // "type": 1(payment)/ 2(subscrription),
    const reqData = {
      eventName: "getAllTransaction",
      page_no: this.state.page_no,
      limit: this.state.limit,
      type: this.state.type,
    };

    if (this.state.searchStr != "") {
      reqData.searchStr = this.state.searchStr.trim();
    }
    console.log("BODYY---", reqData);
    // if (this.state.sortBy != "") {
    //   req_data.sort = this.state.sort ? 1 : 0;
    //   req_data.sortBy = this.state.sortBy;
    // }
    Emit("event", reqData);
    GetResponse((res) => {
      console.log("The res is-->", res);
      this.setState({ list: res.data.transactions, total: res.data.total });
      this.setState({
        subscriptionList: res.data.transactions,
        total: res.data.total,
      });
    });
  };

  //Filter the Purchase
  changeRequest = (e) => {
    this.setState({ page_no: 1, type: +e.target.value }, () => {
      this.getTransactionlist();
    });
    // this.setState({ type: +e.target.value });
  };

  handlePageClick = (e) => {
    this.setState({ page_no: e.selected + 1 }, () => {
      this.getTransactionlist();
    });
  };
  changeLimit = (e) => {
    this.setState({ limit: +e.target.value, page_no: 1 }, () => {
      this.getTransactionlist();
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
    this.getTransactionlist();
  };
  sortHandler = (sortby) => {
    this.setState(
      {
        sort: !this.state.sort,
        sortBy: sortby,
      },
      () => {
        this.getTransactionlist();
      }
    );
  };

  render() {
    return (
      <div className="user-management">
        <PageTitleBar
          title={<IntlMessages id="sidebar.transactions" />}
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
                <br />
                <Row className="align-items-right topSearch">
                  <Col sm="12" md="2" className="mb-3 mb-xl-0"></Col>

                  <Col sm="12" md="3" className="mb-3 mb-xl-0">
                    <InputGroup>
                      <Input
                        className="customSelect"
                        type="select"
                        name="limit"
                        value={this.state.type}
                        onChange={(e) => this.changeRequest(e)}
                      >
                        <option value={1}>Ticket Purchase</option>
                        <option value={2}>Subscription Purchase</option>
                      </Input>
                      &nbsp;
                      {/* <Button
                        color="primary"
                        variant="contained"
                        className="text-white"
                        onClick={() => this.handlePurchase()}
                      >
                        Search
                      </Button> */}
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
                  {this.state.type == 2 ? (
                    <tr>
                      <th>No</th>
                      <th>Viewer Name</th>
                      <th>Host Name</th>
                      <th>Subscription Name</th>
                      <th>Plan Start Time</th>
                      <th>Amount</th>
                      <th>Total Renewal</th>
                      {/* <th>action</th> */}
                    </tr>
                  ) : this.state.type == 1 ? (
                    <tr>
                      <th>No</th>
                      <th>Event Id</th>
                      <th>Event Name</th>
                      <th>Viewer Name</th>

                      <th>Payment Id</th>
                      <th>Type</th>

                      <th>Purchased Ticket Id</th>
                      <th>Amount</th>

                      <th>action</th>
                    </tr>
                  ) : (
                    ""
                  )}
                </thead>
                <tbody>
                  {this.state.type == 1 && this.state.list.length > 0 ? (
                    this.state.list.map((el, index) => (
                      <tr key={index}>
                        <td>
                          {index +
                            1 +
                            (this.state.page_no - 1) * this.state.limit}
                        </td>
                        {/* <td>{el.sign_up_with == 1 && "Email" || el.sign_up_with == 2 && "Facebook" || el.sign_up_with == 3 && "Google" || el.sign_up_with == 4 && "Twitter"}</td> */}
                        <td className="Event_name" title={el.event_id}>
                          {el.event_id ? el.event_id : "-"}
                        </td>

                        <td>{el.eventname ? el.eventname : "-"}</td>
                        <td>{el.viewername ? el.viewername : "-"}</td>
                        <td>{el.payment_id ? el.payment_id : "-"}</td>
                        <td className="Event_email" title={el.payment_type}>
                          {el.payment_type && el.payment_type == 1 ? (
                            <p>Wallet</p>
                          ) : el.payment_type && el.payment_type == 2 ? (
                            <p>Card </p>
                          ) : (
                            "-"
                          )}
                        </td>
                        {/* <td className="Event_email" title={el.payment_type}>
                          {el.payment_type && el.payment_type == 2 ? (
                            <p>Subscription</p>
                          ) : (
                            "-"
                          )}
                        </td> */}

                        <td>
                          {el.purchased_ticket_id
                            ? el.purchased_ticket_id
                            : "-"}
                        </td>
                        <td>{el.amount ? el.amount : "-"}</td>

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
                  ) : this.state.type == 2 &&
                    this.state.subscriptionList.length > 0 ? (
                    this.state.subscriptionList.map((el, index) => (
                      <tr key={index}>
                        <td>
                          {index +
                            1 +
                            (this.state.page_no - 1) * this.state.limit}
                        </td>

                        <td className="Viewer name" title={el.viewername}>
                          {el.viewername ? el.viewername : "-"}
                        </td>
                        <td>{el.hostname ? el.hostname : "-"}</td>
                        <td>
                          {el.subscriptionname ? el.subscriptionname : "-"}
                        </td>

                        <td>
                          {el.plan_start_time
                            ? moment(el.plan_start_time, "HH:mm:ss").format(
                                "hh:mm A"
                              )
                            : "-"}
                        </td>
                        <td>{el.amount ? el.amount : "-"}</td>
                        <td>{el.total_renewal ? el.total_renewal : "-"}</td>

                        {/* <td className="list-action">
                          <Tooltip id="tooltip-fab" title="Event info">
                            <Link
                              to={{
                                pathname: "eventlist/view-event",
                                userFilters: {
                                  page_no: this.state.page_no,
                                  limit: this.state.limit,
                                  searchStr: this.state.searchStr,
                                },
                                search: `?event_id=${el.host_id}`,
                              }}
                            >
                              {" "}
                              <i className="ti-eye" aria-hidden="true"></i>
                            </Link>
                          </Tooltip>
                        </td> */}
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

export default connect(mapStateToProps)(Transactions);
