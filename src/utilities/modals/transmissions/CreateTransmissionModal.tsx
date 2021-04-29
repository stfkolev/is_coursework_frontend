import React from 'react';
import { Modal, Form, Input } from 'antd';

export interface Values {
	name: string;
}

interface TransmissionCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const CreateTransmissionModal: React.FC<TransmissionCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();

	return (
		<Modal
			visible={visible}
			title='Create a new transmission'
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
					label='Transmission Name'
					rules={[
						{
							required: true,
							message: 'Please input the name of the transmission!',
						},
					]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { CreateTransmissionModal };
