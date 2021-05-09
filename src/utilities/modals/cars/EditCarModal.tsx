import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import { Car } from '../../../models/Car';
import { GetColors } from '../../../api/ColorApi';
import { GetModels } from '../../../api/ModelApi';
import { GetEngines } from '../../../api/EngineApi';
import { Color } from '../../../models/Color';
import { Model } from '../../../models/Model';
import { Engine } from '../../../models/Engine';

interface CarEditFormProps {
	car: Car;
	visible: boolean;
	onEdit: (values: Car) => void;
	onCancel: () => void;
}

const { Option } = Select;

const EditCarModal: React.FC<CarEditFormProps> = ({
	car,
	visible,
	onEdit,
	onCancel,
}) => {
	const [form] = Form.useForm();
	const [colors, setColors] = useState<Color[]>([]);
	const [models, setModels] = useState<Model[]>([]);
	const [engines, setEngines] = useState<Engine[]>([]);

	useEffect(() => {
		GetColors().then((values) => {
			setColors(values);
		});
		GetModels().then((values) => {
			setModels(values);
		});
		GetEngines().then((values) => {
			setEngines(values);
		});
	}, []);

	useEffect(() => {
		form.setFieldsValue(car);
	}, [form, car]);

	return (
		<Modal
			visible={visible}
			title='Edit car'
			okText='Save'
			cancelText='Cancel'
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();
						console.log({values})
						onEdit(values as Car);
					})
					.catch((info) => {
						console.log('Validate Failed:', info);
					});
			}}>
			<Form form={form} layout='vertical' name='form_in_modal'>
				<Form.Item
					name='id'
					label='Car ID'
					rules={[{ required: true }]}>
					<Input disabled />
				</Form.Item>
				<Form.Item
					name='numberPlate'
					label='Car Number Plate'
					rules={[
						{
							required: true,
							message: 'Please input the number plate of the car!',
						},
					]}>
					<Input />
				</Form.Item>

				<Form.Item
					name='seats'
					label='Car Seats'
					rules={[
						{
							required: true,
							message: 'Please input the seats of the car!',
						},
					]}>
					<InputNumber min={3} max={10} style={{width: '100%'}} />
				</Form.Item>

				<Form.Item
					valuePropName='checked'
					name='luggageSpace'
					label='Car Luggage Space'
					rules={[
						{
							required: true,
							message: 'Please input the luggage space of the car!',
						},
					]}>
					<Switch checkedChildren='Yes' unCheckedChildren='No'/>
				</Form.Item>

				<Form.Item
					valuePropName='checked'
					name='technicallyApproved'
					label='Car Technically Approved'
					rules={[
						{
							required: true,
							message: 'Please input the technical approvement of the car!',
						},
					]}>
					<Switch checkedChildren='Yes' unCheckedChildren='No' defaultChecked={car.technicallyApproved}/>
				</Form.Item>

				<Form.Item
					name='modelId'
					label='Car Model'
					rules={[
						{
							required: true,
							message: 'Please input the model of the car!',
						},
					]}>
					<Select allowClear>
						{models.map((data) => (
							<Option
								key={data.id.toString()}
								value={Number.parseInt(data.id.toString())}>
								{data.name}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='colorId'
					label='Car Color'
					rules={[
						{
							required: true,
							message: 'Please input the color of the car!',
						},
					]}>
					<Select allowClear>
						{colors.map((data) => (
							<Option
								key={data.id.toString()}
								value={Number.parseInt(data.id.toString())}>
								{data.name}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='engineId'
					label='Car Engine'
					rules={[
						{
							required: true,
							message: 'Please input the engine of the car!',
						},
					]}>
					<Select allowClear>
						{engines.map((data) => (
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

export { EditCarModal };
