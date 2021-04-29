import React from 'react';
import { Modal, Form, Input } from 'antd';

export interface Values {
	name: string;
}

interface FuelCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const CreateFuelModal: React.FC<FuelCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();

	return (
		<Modal
			visible={visible}
			title='Create a new fuel'
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
					label='Fuel Name'
					rules={[
						{
							required: true,
							message: 'Please input the name of the fuel!',
						},
					]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { CreateFuelModal };
