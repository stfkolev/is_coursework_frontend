import React from 'react';
import { Modal, Form, Input } from 'antd';

export interface Values {
	name: string;
}

interface CarTypeCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const CreateCarTypeModal: React.FC<CarTypeCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();

	return (
		<Modal
			visible={visible}
			title='Create a new car type'
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
					label='Car Type Name'
					rules={[
						{
							required: true,
							message: 'Please input the name of the car type!',
						},
					]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { CreateCarTypeModal };
