import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { CarType } from '../../models/CarType';

interface CarTypeEditFormProps {
	carType: CarType;
	visible: boolean;
	onEdit: (values: CarType) => void;
	onCancel: () => void;
}

const EditCarTypeModal: React.FC<CarTypeEditFormProps> = ({
	carType,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(carType);
	}, [form, carType]);

	return (
		<Modal
			visible={visible}
			title='Edit car type'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as CarType);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item name='id' label='Car Type ID' rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>

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

export { EditCarTypeModal };
