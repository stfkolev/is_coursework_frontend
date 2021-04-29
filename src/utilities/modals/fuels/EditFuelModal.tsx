import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { Fuel } from '../../../models/Fuel';

interface FuelEditFormProps {
	fuel: Fuel;
	visible: boolean;
	onEdit: (values: Fuel) => void;
	onCancel: () => void;
}

const EditFuelModal: React.FC<FuelEditFormProps> = ({
	fuel,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(fuel);
	}, [form, fuel]);

	return (
		<Modal
			visible={visible}
			title='Edit fuel'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as Fuel);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item name='id' label='Fuel ID' rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>

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

export { EditFuelModal };
