import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { Client } from '../../../models/Client';

interface ClientEditFormProps {
	client: Client;
	visible: boolean;
	onEdit: (values: Client) => void;
	onCancel: () => void;
}

const EditClientModal: React.FC<ClientEditFormProps> = ({
	client,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(client);
	}, [form, client]);

	return (
		<Modal
			visible={visible}
			title='Edit client'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as Client);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item name='id' label='Client ID' rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>

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
							min: 10,
							max: 10,
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
			</Form>
		</Modal>
	);
};

export { EditClientModal };
