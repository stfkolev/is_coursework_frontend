import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { Model } from '../../../models/Model';
import { CarType } from '../../../models/CarType';
import { Manufacturer } from '../../../models/Manufacturer';
import { GetManufacturers } from '../../../api/ManufacturerApi';
import { GetCarTypes } from '../../../api/CarTypeApi';

interface ModelEditFormProps {
	model: Model;
	visible: boolean;
	onEdit: (values: Model) => void;
	onCancel: () => void;
}

const { Option } = Select;

const EditModelModal: React.FC<ModelEditFormProps> = ({
	model,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();
	const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
	const [carTypes, setCarTypes] = useState<CarType[]>([]);

	useEffect(() => {		
		GetManufacturers().then((values) => setManufacturers(values));
		GetCarTypes().then((values) => setCarTypes(values));
	}, []);

	useEffect(() => {
		form.setFieldsValue({
			id: model.id,
			name: model.name,
			manufacturerId: model.manufacturerId,
			carTypeId: model.carTypeId,
		});
	}, [form, model]);

	return (
		<Modal
			visible={visible}
			title='Edit model'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();

						onEdit(values as Model);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item
					name='id'
					label='Model ID'
					rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>
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

export { EditModelModal };
