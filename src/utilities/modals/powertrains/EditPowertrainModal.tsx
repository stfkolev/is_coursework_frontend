import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { Powertrain } from '../../../models/Powertrain';

interface PowertrainEditFormProps {
	powertrain: Powertrain;
	visible: boolean;
	onEdit: (values: Powertrain) => void;
	onCancel: () => void;
}

const EditPowertrainModal: React.FC<PowertrainEditFormProps> = ({
	powertrain,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(powertrain);
	}, [form, powertrain]);

	return (
		<Modal
			visible={visible}
			title='Edit powertrain'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as Powertrain);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item name='id' label='Powertrain ID' rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>

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

export { EditPowertrainModal };
