import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { Country } from '../../../models/Country';

interface CountryEditFormProps {
	country: Country;
	visible: boolean;
	onEdit: (values: Country) => void;
	onCancel: () => void;
}

const EditCountryModal: React.FC<CountryEditFormProps> = ({
	country,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(country);
	}, [form, country]);

	return (
		<Modal
			visible={visible}
			title='Edit country'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as Country);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item name='id' label='Country ID' rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>

				<Form.Item
					name='name'
					label='Country Name'
					rules={[
						{
							required: true,
							message: 'Please input the name of the country!',
						},
					]}>
					<Input />
				</Form.Item>

				<Form.Item
					name='code'
					label='Country Code'
					rules={[
						{
							required: true,
							message: 'Please input the code of the country!',
						},
					]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { EditCountryModal };
