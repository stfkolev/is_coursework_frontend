import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { Color } from '../../../models/Color';

interface ColorEditFormProps {
	color: Color;
	visible: boolean;
	onEdit: (values: Color) => void;
	onCancel: () => void;
}

const EditColorModal: React.FC<ColorEditFormProps> = ({
	color,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(color);
	}, [form, color]);

	return (
		<Modal
			visible={visible}
			title='Edit color'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as Color);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item name='id' label='Color ID' rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>

				<Form.Item
					name='name'
					label='Color Name'
					rules={[
						{
							required: true,
							message: 'Please input the name of the color!',
						},
					]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { EditColorModal };
