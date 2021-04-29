import React from 'react';
import { Modal, Form, Input } from 'antd';

export interface Values {
	name: string;
	code: string;
}

interface CountryCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const CreateCountryModal: React.FC<CountryCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();

	return (
		<Modal
			visible={visible}
			title='Create a new country'
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

export { CreateCountryModal };
