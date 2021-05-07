import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import { Country } from '../../../models/Country';
import { GetCountries } from '../../../api/CountryApi';

export interface Values {
	name: string;
	createdAt: Date;
	countryId: number;
}

interface ManufacturerCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const { Option } = Select;

const CreateManufacturerModal: React.FC<ManufacturerCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();
	const [countries, setCountries] = useState<Country[]>([]);

	useEffect(() => {
		GetCountries().then((values) => setCountries(values));
	}, []);

	return (
		<Modal
			visible={visible}
			title='Create a new manufacturer'
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

				<Form.Item
					name='createdAt'
					label='Manufacturer Creation Date'
					rules={[
						{
							required: true,
							message: 'Please input the creation date of the manufacturer!',
						},
					]}>
					<DatePicker style={{ width: '100%' }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export { CreateManufacturerModal };
