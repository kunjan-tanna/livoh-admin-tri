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
import config from '../../util/config';
import { Emit, GetResponse } from '../../util/connect-socket'

import Editor from '../../components/editor/editor'

class Terms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: "",
            text: "",
            name: "",
            id: ''
        }
    }

    async componentDidMount() {
        console.log('\n\n PRPS:::', this.props);
        let configuration = {
            toolbar: [
                ['Cut', 'Copy', 'PasteText', 'PasteFromWord', 'SpellCheck', 'Paste', 'Undo', 'Redo', '-', 'Link', 'Unlink', 'Anchor', '-'],
                ['Image', 'Table', 'HorizontalRule', 'SpecialChar', '-', 'Maximize', '-'],
                { name: 'document', items: ['Source'] },
                '/',
                ['Bold', 'Italic', 'Strike', 'Underline', '-', 'RemoveFormat'],
                ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'],
                ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'TextColor', 'BGColor'],
                ['mkField'],
                '/',
                ['Styles', 'Format', 'Font', 'FontSize'],
            ],
            filebrowserUploadUrl: config.url + 'upload',

        }
        await this.getData();

        window.CKEDITOR.replace("1", configuration);
        window.CKEDITOR.inline("1");
        // window.CKEDITOR.plugins.addExternal( 'imageresize', '../imageresize-master/plugin', 'plugin.js' );
        window.CKEDITOR.instances["1"].on("change", function () {
            let data = window.CKEDITOR.instances[1].getData();
            this.setTxt(data);
        }.bind(this));

        window.CKEDITOR.instances["1"].on("fileUploadRequest", function () {
            store.dispatch({
                type: 'START_LOADER'
            })
        }.bind(this));

        window.CKEDITOR.instances["1"].on("fileUploadResponse", function () {
            store.dispatch({
                type: 'STOP_LOADER'
            })
        }.bind(this));

    }

    setTxt = async (data) => {
        await this.setState({ text: data })
    }

    getData = async () => {
        // let index = this.props.path.lastIndexOf("/");
        // let name = String(this.props.path).substr(index + 1, this.props.path.length);
        // let response;
        console.log('name->', name);
        Emit('adminConfig');
        GetResponse(res => {
            console.log('\n\n RES77777->', res);
            this.setState({ text: res.data.terms_of_use_text, id: res.data.admin_config_id }, () => {
            });
        })
    }
    onChangeText = (evt) => {
        var newContent = evt.editor.getData();
        this.setState({
            text: newContent
        })
    }
    onSubmitHandler = async () => {
        let reqData = {
            id: this.state.id,
            terms_of_use_text: this.state.text
        }
        Emit('updateAdminConfig', reqData);
        GetResponse(res => {
            console.log('\n\n UP RES->>', res);
            displayLog(res.code, res.message);
        })
        this.getData();
    }

    render() {
        console.log('STATE-->>', this.state);
        return (
            <div className="animated fadeIn">
                <script src="../../../"></script>
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.TermsOfUse"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <Row>
                        <Col xl={12}>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <div>
                                            <FormGroup>
                                                <Input type="textarea" name={"1"} id={"1"} value={this.state.text} onChange={() => this.onChangeText()} />
                                            </FormGroup>
                                        </div>
                                        <Button color="primary" className="secondary black-btn" onClick={this.onSubmitHandler}>Submit</Button>
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

export default Terms;
