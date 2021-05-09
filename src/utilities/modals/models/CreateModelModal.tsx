import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { CarType } from '../../../models/CarType';
import { Manufacturer } from '../../../models/Manufacturer';
import { GetManufacturers } from '../../../api/ManufacturerApi';
import { GetCarTypes } from '../../../api/CarTypeApi';

export interface Values {
	name: string;
	manufacturerId: number;
	carTypeId: number;
}

interface ModelCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const { Option } = Select;

const CreateModelModal: React.FC<ModelCreateFormProps> = ({
	visible,
	onCreate,
	onCancel,
}) => {
	const [form] = Form.useForm();
	const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
	const [carTypes, setCarTypes] = useState<CarType[]>([]);

	useEffect(() => {
		GetManufacturers().then((values) => setManufacturers(values));
		GetCarTypes().then((values) => setCarTypes(values));
	}, []);

	return (
		<Modal
			visible={visible}
			title='Create a new model'
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
					label='Model Name'
					rules={[
						{
							required: true,
							message: 'Please input the name of the model!',
						},
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					name='manufacturerId'
					label='Model Manufacturer'
					rules={[
						{
							required: true,
							message: 'Please input the manufacturer of the model!',
						},
					]}>
					<Select allowClear>
						{manufacturers.map((data) => (
							<Option
								key={data.id.toString()}
								value={Number.parseInt(data.id.toString())}>
								{data.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name='carTypeId'
					label='Model Car Type'
					rules={[
						{
							required: true,
							message: 'Please input the car type of the model!',
						},
					]}>
					<Select allowClear>
						{carTypes.map((data) => (
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

export { CreateModelModal };
