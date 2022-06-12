/**
 * Language Select Dropdown
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
	Card,
	CardBody,
	Col,
	Row,
	Table,
	FormGroup,
	Input,
	Label, Alert, DropdownToggle, DropdownMenu, Dropdown, DropdownItem
} from 'reactstrap';
import Button from '@material-ui/core/Button';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog/DeleteConfirmationDialog';
import Joi from 'joi-browser';
import { displayLog, validateSchema, apiCall, formValueChangeHandler } from '../../util/common'
// actions

import IntlMessages from 'Util/IntlMessages';
import AppConfig from '../../constants/AppConfig'
import { join } from 'bluebird';

class LanguageProvider extends Component {
	state = {
		langDropdownOpen: false,
		show: false,
		showLogoutModal: false,
		formValues: {
			current_password: '',
			new_password: '',
			confirm_password: ''
		},
		error: {
			status: false,
			message: ''
		},
		errorField: ''
	}

	// function to toggle dropdown menu
	toggle = () => {
		this.setState({
			langDropdownOpen: !this.state.langDropdownOpen
		});
	}
	onChangeHandler = (e) => {

		var formValues = this.state.formValues;
		var name = e.target.name;

		formValues[name] = e.target.value;
		this.setState({ formValues: formValues }, () => {
			// console.log(this.state.formValues);

		});

	}

	onPressChangePwd = async () => {
		console.log('hhhhhhhhhhhhhhhhhhhhh');
		let schema = Joi.object().keys({
			current_password: Joi.string().strict().trim().min(6).label('Current Password').required(),
			new_password: Joi.string().strict().trim().min(6).label('New Password').required(),
			confirm_password: Joi.string().strict().trim().min(6).label('Confirm Password').required(),
		})
		this.setState({ error: await validateSchema(this.state.formValues, schema) });
		if (!this.state.error.status) {
			if (String(this.state.formValues.new_password) !== String(this.state.formValues.confirm_password)) {
				displayLog(0, "New password and confirm password must be same.");
			} else {
				let data = {
					old_password: this.state.formValues.current_password,
					new_password: this.state.formValues.new_password,
					confirm_new_password: this.state.formValues.confirm_password,
					user_id: localStorage.getItem('USER')
				}
				const response = await apiCall('POST', 'changePassword', data);
				displayLog(response.code, response.message);
				localStorage.clear()
				this.props.history.push('/signin');
			}
		} else {
			console.log('\n\n 333333333333333333333-->', this.state.error);
			displayLog(0, this.state.error.message);
		}
	}
	inputChangeHandler = (e) => {
		this.setState({ form: formValueChangeHandler(e, this.state.form) });
	}

	// validateFormData = async (body) => {
	// 	console.log("bosy==============", body)
	// 	// body.calledFor = localStorage.getItem('user_type')
	// 	let schema = Joi.object().keys({
	// 		// calledFor: Joi.string().required(),
	// 		current_password: Joi.string().trim().required(),
	// 		new_password: Joi.string().trim().required().min(6),
	// 		confirm_password: Joi.string()
	// 			.valid(this.state.formValues.new_password)
	// 			.required()
	// 			.label('Confirm Password')
	// 			.error(
	// 				errors => 'New Password and Confirm Password must be same!'
	// 			),
	// 	})
	// 	Joi.validate(body, schema, (error, value) => {
	// 		if (error) {
	// 			console.log('\n\n error=-->', error);
	// 			if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {

	// 				let errorLog = validateSchema(error)
	// 				console.log('\n\n error=- ghghgh ->', errorLog);
	// 				this.setState({ error: errorLog.error, errorField: errorLog.errorField });
	// 			}
	// 		}
	// 		else {
	// 			this.setState({ error: '', errorField: '' }, () => {
	// 				this.changePwd()
	// 			});
	// 		}
	// 	})
	// }
	changePwd = async () => {
		let reqData = {
			current_password: this.state.formValues.current_password.trim(),
			new_password: this.state.formValues.new_password.trim(),
			confirm_password: this.state.formValues.confirm_password.trim(),
			// calledFor: localStorage.getItem('user_type')
		}
		console.log("rteq data", reqData)
		await this.props.changePassword(reqData);
		if (this.props.changePasswordData && this.props.changePasswordData.code === 1) {
			console.log("this.props.changePasswordData", this.props.changePasswordData)
			await localStorage.clear();
			displayLog(1, this.props.changePasswordData.message)
			reqData.calledFor == AppConfig.superAdminType ? await this.props.history.push('/login') : await this.props.history.push('/carrier/login')
		}
		this.showModal()
	}
	enterPressed = (event) => {
		var code = event.keyCode || event.which;
		if (code === 13) { //13 is the enter keycode
			this.onPressChangePwd()
		}
	};
	logoutPopup = () => {
		this.refs.deleteConfirmationDialog.open();

	}
	showModal = () => {
		this.setState({
			show: !this.state.show, formValues: {
				current_password: '',
				new_password: '',
				confirm_password: ''
			}, error: ''
		});
	};
	showLogoutModal = () => {
		this.setState({
			showLogoutModal: !this.state.showLogoutModal,
			error: ''
		});
	};
	logout = () => {
		// localStorage.getItem('user_type') == AppConfig.superAdminType ? this.props.history.push('/login') : this.props.history.push('/carrier/login')
		// this.refs.deleteConfirmationDialog.close();
		localStorage.clear()
		this.props.history.push('/signin') 
	}

	render() {
		const { locale, languages, history } = this.props;
		console.log('\n\n', this.state);
		return (
			<div className="customDropdown">
				<Modal dialogClassName={"align-middle"} isOpen={this.state.show} toggle={() => this.showModal()} >
					<ModalHeader>
						Change Password
						<button type="button" className="close_btn" aria-label="Close" onClick={() => this.setState({ show: !this.state.show })}><span aria-hidden="true">×</span></button>
					</ModalHeader>
					<ModalBody>
						<Row>
							<Col md="12">
								<FormGroup>

									<Input onKeyPress={(e) => this.enterPressed(e)} type="password" id="current_password" onChange={(e) => this.onChangeHandler(e)}
										value={this.state.formValues.current_password} placeholder='Enter Current Password' name='current_password' />
								</FormGroup>
							</Col>
							<Col md="12">
								<FormGroup>

									<Input onKeyPress={(e) => this.enterPressed(e)} type="password" id="new_password" onChange={(e) => this.onChangeHandler(e)}
										value={this.state.formValues.new_password} placeholder='Enter new password' name='new_password' />
								</FormGroup>
							</Col>
							<Col md="12">
								<FormGroup>

									<Input onKeyPress={(e) => this.enterPressed(e)} type="password" id="confirm_password" onChange={(e) => this.onChangeHandler(e)}
										value={this.state.formValues.confirm_password} placeholder='Confirm password' name='confirm_password' />
								</FormGroup>
							</Col>
						</Row>
						{
							this.state.error !== '' ?
								<Col md="12">
									<Alert color="danger" >
										{this.state.error}
									</Alert>
								</Col>
								: null
						}
					</ModalBody>
					<ModalFooter>
						<Button style={{ backgroundColor: '#3C16D5' }} className="text-white" variant='contained' /* color="primary" */ onClick={() => this.onPressChangePwd()}>Save</Button>
						<Button variant='contained' className="text-white btn-danger" onClick={this.showModal}>Cancel</Button>
					</ModalFooter>
				</Modal>

				<Modal dialogClassName={"align-middle"} isOpen={this.state.showLogoutModal} toggle={() => this.showLogoutModal()} >
					<ModalHeader>
						Are you sure you want to logout?
						<button type="button" className="close_btn" aria-label="Close" onClick={() => this.setState({ showLogoutModal: !this.state.showLogoutModal })}><span aria-hidden="true">×</span></button>
					</ModalHeader>
				
						{
							this.state.error !== '' ?
							<ModalBody>
								<Col md="12">
									<Alert color="danger" >
										{this.state.error}
									</Alert>
								</Col>
								</ModalBody>
								: null
						}
					
					<ModalFooter>
						<Button style={{ backgroundColor: '#3C16D5' }} className="text-white" variant='contained' onClick={() => this.logout()}>Yes</Button>
						<Button variant='contained' className="text-white btn-danger" onClick={this.showLogoutModal}>No</Button>
					</ModalFooter>
				</Modal>


				<Dropdown nav className="list-inline-item" isOpen={this.state.langDropdownOpen} toggle={this.toggle}>
					<DropdownToggle caret nav className="header-icon language-icon" >
						{localStorage.getItem('user_type') == AppConfig.superAdminType ? 'Admin' : 'Carrier'}
					</DropdownToggle>

					<DropdownMenu>
						<DropdownItem>
							<a href="#" onClick={this.showModal}>
								<i className="zmdi zmdi-key text-info mr-3"></i>
								<span><IntlMessages id="widgets.changePassword" /></span>
							</a>
						</DropdownItem>
						<DropdownItem onClick={this.showLogoutModal}>
							<a href="#" >
								<i className="zmdi zmdi-power text-danger mr-3"></i>
								<span><IntlMessages id="widgets.logOut" /></span>
							</a>
						</DropdownItem>
						{/* <DropdownItem >
							<a href="#" >
								<i className="zmdi zmdi-power text-danger mr-3"></i>
								<span><IntlMessages id="widgets.logOut" /></span>
							</a>
						</DropdownItem> */}
					</DropdownMenu>
					{/* <DeleteConfirmationDialog
						ref="deleteConfirmationDialog"
						title="Are you sure you want to logout?"
						// message="This will delete user permanently."
						onConfirm={() => this.logout()}
					/> */}
				</Dropdown>
			</div>
		);
	}
}

// map state to props
// const mapStateToProps = ({ settings, adminAuthReducer }) => {
// 	const { changePasswordData, loading } = adminAuthReducer;
// 	return { settings, changePasswordData, loading }
// };

export default withRouter(LanguageProvider);
