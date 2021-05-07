import React from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';

export interface Values {
	firstName: string;
	lastName: string;
	address: string;
	ucn: string;
	license: string;
	licenseExpiryDate: Date;
}

interface ClientCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const CreateClientModal: React.FC<ClientCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();

	return (
		<Modal
			visible={visible}
			title='Create a new client'
			okText='Create'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onCreate(values as Values);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item
					name='firstName'
					label='Client First Name'
					rules={[
						{
							required: true,
							message: 'Please input the first name of the client!',
						},
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					name='lastName'
					label='Client Last Name'
					rules={[
						{
							required: true,
							message: 'Please input the last name of the client!',
						},
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					name='address'
					label='Client Address'
					rules={[
						{
							required: true,
							message: 'Please input the address of the client!',
						},
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					name='ucn'
					label='Client UCN (Uniform Civil Number)'
					rules={[
						{
							len: 10,
							required: true,
							message: 'Please input the UCN of the client!',
						},
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					name='license'
					label='Client License'
					rules={[
						{
							required: true,
							message: 'Please input the license of the client!',
						},
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					name='licenseExpiryDate'
					label='Client License Expiry Date'
					rules={[
						{
							required: true,
							message: 'Please input the license expiry date of the client!',
						},
					]}>
					<DatePicker />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { CreateClientModal };
