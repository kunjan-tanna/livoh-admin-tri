/*  EDITOR OPTIONS

            toolbar: [
                ['Bold', 'Italic', 'Underline', 'Strike', 'TextColor', 'BGColor', 'RemoveFormat'],
                ['NumberedList', 'BulletedList', 'Outdent', 'Indent'],
                ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                ['SpecialChar', 'Bold', 'Italic', 'Strike', 'Underline'],
                { name: 'document', items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates'] },
                [
                    'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-',
                    'PasteFromWord', 'SpellCheck', 'mkField', 'Undo', 'Redo',
                ],
                '/',
                ['Styles', 'Format', 'Font', 'FontSize', 'Link', 'Image', 'Table', 'HorizontalRule'],
            ]
       
*/
import React, { Component } from 'react';
import {
    Button,
    Label,
    Input,
    FormGroup
} from 'reactstrap';
import { apiCall, displayLog } from '../../util/common';
import config from '../../util/config';
import store from '../../util/store';
import { Emit, GetResponse } from '../../util/connect-socket'

class Editor extends Component {
    state = {
        editorState: "",
        text: "",
        name: "",
        id: ''
    }

    async componentDidMount() {
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
        window.CKEDITOR.replace(this.props.id, configuration);
        window.CKEDITOR.inline(this.props.id);
        // window.CKEDITOR.plugins.addExternal( 'imageresize', '../imageresize-master/plugin', 'plugin.js' );
        window.CKEDITOR.instances[this.props.id].on("change", function () {
            let data = window.CKEDITOR.instances[this.props.id].getData();
            this.setTxt(data);
        }.bind(this));

        window.CKEDITOR.instances[this.props.id].on("fileUploadRequest", function () {
            store.dispatch({
                type: 'START_LOADER'
            })
        }.bind(this));

        window.CKEDITOR.instances[this.props.id].on("fileUploadResponse", function () {
            store.dispatch({
                type: 'STOP_LOADER'
            })
        }.bind(this));
    }

    setTxt = async (data) => {
        await this.setState({ text: data })
    }

    getData = async () => {
        let index = this.props.path.lastIndexOf("/");
        let name = String(this.props.path).substr(index + 1, this.props.path.length);
        let response;
        console.log('name->', name);
        await Emit('adminConfig');
        await GetResponse(res => {
            console.log('\n\n RES77777->', res);
            this.setState({ text: res.data.terms_of_use_text, id: res.data.admin_config_id }, () => {
            });
        })
        console.log('response is::::>', response);
        // if (name === "AboutUs") {
        //     response = await apiCall('POST', 'getAboutUs');
        // }
        // if (name === "TermsAndCondition") {
        //     // response = await apiCall('POST', 'getTermsofUse');
        //     await this.setState({ text: response.data[0].terms_of_use_text, id: response.data[0].admin_config_id }, () => {
        //     });
        // }
        // if (name === "PrivacyPolicy") {
        //     // response = await apiCall('POST', 'getPrivacyPolicy');
        //     await this.setState({ text: response.data[0].privacy_policy_text, id: response.data[0].admin_config_id }, () => {
        //     });
        // }

    }
    onChangeText = (evt) => {
        var newContent = evt.editor.getData();
        this.setState({
            text: newContent
        })
    }
    onSubmitHandler = async () => {
        let index = this.props.path.lastIndexOf("/");
        let name = String(this.props.path).substr(index + 1, this.props.path.length);
        let res;
        let reqData = {
            id: this.state.id,
            description: this.state.text
        }
        if (name === "AboutUs") {
            res = await apiCall('POST', 'updateAboutUs', reqData);
        } if (name === "TermsAndCondition") {
            res = await apiCall('POST', 'updateTermsofUse', reqData);
        } if (name === "PrivacyPolicy") {
            res = await apiCall('POST', 'updatePrivacyPolicy', reqData);
        }
        console.log('\n\n UP RES->>', res);
        displayLog(res.code, res.message);
        this.getData();
    }

    demo = () => {
        console.log('YES');
    }
    render() {
        console.log('\n STATE IS__>', this.state);
        return (
            <>
                <script src="../../../"></script>
                <div>
                    <FormGroup>
                        <Input type="textarea" name={this.props.id} id={this.props.id} value={this.state.text} onChange={() => this.onChangeText()} />
                    </FormGroup>
                </div>
                <Button color="primary" className="secondary black-btn" onClick={this.onSubmitHandler}>Submit</Button>

            </>
        );
    }
}

export default Editor;