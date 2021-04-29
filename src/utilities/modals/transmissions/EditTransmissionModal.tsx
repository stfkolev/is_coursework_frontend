import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { Transmission } from '../../../models/Transmission';

interface TransmissionEditFormProps {
	transmission: Transmission;
	visible: boolean;
	onEdit: (values: Transmission) => void;
	onCancel: () => void;
}

const EditTransmissionModal: React.FC<TransmissionEditFormProps> = ({
	transmission,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(transmission);
	}, [form, transmission]);

	return (
		<Modal
			visible={visible}
			title='Edit transmission'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as Transmission);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item
					name='id'
					label='Transmission ID'
					rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>

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

export { EditTransmissionModal };
