/**
 * App Routes
 */
import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

// app default layout
import RctAppLayout from "Components/RctAppLayout";

// router service
import routerService from "../services/_routerService";
import _routerService from "../services/_routerService";

class DefaultLayout extends Component {
  render() {
    const { match, loading } = this.props;
    //console.log('\n\n DEFAULT LAYOUT');
    return (
      <>
        {/* {
					loading &&
					<div className="loader">
						<CircularProgress />
					</div>
				} */}
        <RctAppLayout>
          {routerService &&
            routerService.map((route, key) => (
              <Route
                key={key}
                path={`${match.url}/${route.path}`}
                exact={true}
                component={route.component}
              />
            ))}
        </RctAppLayout>
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return {
    user,
    loading,
  };
};

export default withRouter(connect(mapStateToProps)(DefaultLayout));
