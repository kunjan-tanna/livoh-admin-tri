import React, { Component } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Button,
    CardFooter,
    Label,
    Input,
    FormGroup,
    Form
} from 'reactstrap';
import Joi from 'joi-browser';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { displayLog, validateSchema, apiCall, formValueChangeHandler, capitalizeFirstLetter } from '../../util/common'
import queryString from 'query-string'

import Editor from '../../components/editor/editor'

class AboutUs extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        console.log('STATE-->>', this.state);
        return (
            <div className="animated fadeIn">
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.AboutUs"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <Row>
                        <Col xl={12}>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Editor path={this.props.history.location.pathname} id="1" />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Col>
                    </Row>
                </RctCollapsibleCard >
            </div >
        )
    }
}

export default AboutUs;
