import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { Company } from '../../../models/Company';

interface CompanyEditFormProps {
	company: Company;
	visible: boolean;
	onEdit: (values: Company) => void;
	onCancel: () => void;
}

const EditCompanyModal: React.FC<CompanyEditFormProps> = ({
	company,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue(company);
	}, [form, company]);

	return (
		<Modal
			visible={visible}
			title='Edit company'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as Company);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item name='id' label='Company ID' rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>

				<Form.Item
					name='name'
					label='Company Name'
					rules={[
						{
							required: true,
							message: 'Please input the name of the company!',
						},
					]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { EditCompanyModal };
