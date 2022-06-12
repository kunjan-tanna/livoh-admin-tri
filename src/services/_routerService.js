// routes
import User from "../routes/User/index";
import ManageHost from "../routes/ManageHost/ManageHost";
import AboutUs from "../routes/Pages/Aboutus";
import Terms from "../routes/Pages/TermsOfUse";
import PrivacyPolicy from "../routes/Pages/PrivacyPolicy";
import ViewUser from "../routes/User/viewUser";
import Eventlist from "../routes/Eventtlist/Eventlist";
import Transactions from "../routes/Transactions/Transactions";
import WithdrawalRequest from "../routes/WithdrawalRequest/WithdrawalRequest";
import ViewEvent from "../routes/Eventtlist/ViewEvent";

import Wallet from "../routes/Wallet/index";
import AddEditMoneyToCoins from "../routes/Wallet/addEditMoneyToCoins";
import AddEditBlessingsToCoins from "../routes/Wallet/addEditBlessingToCoins";
import AddEditBlessingsToMoney from "../routes/Wallet/addEditBlessingToMoney";
import Dashboard from "../routes/Dashboard/index";
import Streaming from "../routes/Streaming/index";
import Recharge from "../routes/Recharge/index";
import ViewRecharge from "../routes/Recharge/view-recharge";
import ViewStreaming from "../routes/Streaming/viewStreaming";
import ViewReportStreaming from "../routes/Streaming/viewReportStreaming";
import Cashout from "../routes/Cashout/index";
import ViewCash from "../routes/Cashout/viewCashout";
import Settings from "../routes/Settings/index";

export default [
  {
    path: "dashboard",
    component: Dashboard,
    exact: true,
  },
  {
    path: "users",
    component: User,
    exact: true,
  },
  {
    path: "users/view-user",
    component: ViewUser,
    exact: true,
  },
  {
    path: "managehost",
    component: ManageHost,
    exact: true,
  },

  {
    path: "eventlist",
    component: Eventlist,
    exact: true,
  },
  {
    path: "transactions",
    component: Transactions,
    exact: true,
  },
  {
    path: "withdrawalrequest",
    component: WithdrawalRequest,
    exact: true,
  },
  {
    path: "eventlist/view-event",
    component: ViewEvent,
    exact: true,
  },
  {
    path: "recharge",
    component: Recharge,
    exact: true,
  },
  {
    path: "recharge/view-recharge",
    component: ViewRecharge,
    exact: true,
  },

  {
    path: "wallet",
    component: Wallet,
    exact: true,
  },
  {
    path: "wallet/add-money-to-coins",
    component: AddEditMoneyToCoins,
    exact: true,
  },
  {
    path: "wallet/edit-money-to-coins",
    component: AddEditMoneyToCoins,
    exact: true,
  },
  {
    path: "wallet/add-blessings-to-coins",
    component: AddEditBlessingsToCoins,
    exact: true,
  },
  {
    path: "wallet/edit-blessings-to-coins",
    component: AddEditBlessingsToCoins,
    exact: true,
  },
  {
    path: "wallet/add-blessings-to-money",
    component: AddEditBlessingsToMoney,
    exact: true,
  },
  {
    path: "wallet/edit-blessings-to-money",
    component: AddEditBlessingsToMoney,
    exact: true,
  },
  {
    path: "streaming",
    component: Streaming,
    exact: true,
  },
  {
    path: "streaming/view-streaming",
    component: ViewStreaming,
    exact: true,
  },
  {
    path: "streaming/view-reported",
    component: ViewReportStreaming,
    exact: true,
  },
  {
    path: "cashout",
    component: Cashout,
    exact: true,
  },
  {
    path: "cashout/view-cashout",
    component: ViewCash,
    exact: true,
  },
  {
    path: "settings",
    component: Settings,
    exact: true,
  },
  {
    path: "AboutUs",
    component: AboutUs,
    exact: true,
  },

  {
    path: "TermsOfUse",
    component: Terms,
    exact: true,
  },
  {
    path: "PrivacyPolicy",
    component: PrivacyPolicy,
    exact: true,
  },
];
