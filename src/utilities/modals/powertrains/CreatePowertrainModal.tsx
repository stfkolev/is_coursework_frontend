import React from 'react';
import { Modal, Form, Input } from 'antd';

export interface Values {
	name: string;
}

interface PowertrainCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const CreatePowertrainModal: React.FC<PowertrainCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();

	return (
		<Modal
			visible={visible}
			title='Create a new powertrain'
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
					label='Powertrain Name'
					rules={[
						{
							required: true,
							message: 'Please input the name of the powertrain!',
						},
					]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { CreatePowertrainModal };
