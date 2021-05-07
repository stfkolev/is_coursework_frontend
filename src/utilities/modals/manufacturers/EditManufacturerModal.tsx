import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { Manufacturer } from '../../../models/Manufacturer';
import { Country } from '../../../models/Country';
import { GetCountries } from '../../../api/CountryApi';

interface ManufacturerEditFormProps {
	manufacturer: Manufacturer;
	visible: boolean;
	onEdit: (values: Manufacturer) => void;
	onCancel: () => void;
}

const { Option } = Select;

const EditManufacturerModal: React.FC<ManufacturerEditFormProps> = ({
	manufacturer,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();
	const [countries, setCountries] = useState<Country[]>([]);

	useEffect(() => {
		GetCountries().then((values) => setCountries(values));
	}, []);

	useEffect(() => {
		form.setFieldsValue(manufacturer);
	}, [form, manufacturer]);

	return (
		<Modal
			visible={visible}
			title='Edit manufacturer'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as Manufacturer);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item
					name='id'
					label='Manufacturer ID'
					rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>
				<Form.Item
					name='name'
					label='Manufacturer Name'
					rules={[
						{
							required: true,
							message: 'Please input the name of the manufacturer!',
						},
					]}>
					<Input />
				</Form.Item>

				<Form.Item
					name='countryId'
					label='Manufacturer Country'
					rules={[
						{
							required: true,
							message: 'Please input the country of the manufacturer!',
						},
					]}>
					<Select allowClear>
						{countries.map((data) => (
							<Option
								key={data.id.toString()}
								value={Number.parseInt(data.id.toString())}>
								{data.name}
							</Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { EditManufacturerModal };
