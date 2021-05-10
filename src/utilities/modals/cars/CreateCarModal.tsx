import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import { GetColors } from '../../../api/ColorApi';
import { GetModels } from '../../../api/ModelApi';
import { GetEngines } from '../../../api/EngineApi';
import { Color } from '../../../models/Color';
import { Model } from '../../../models/Model';
import { Engine } from '../../../models/Engine';

export interface Values {
	numberPlate: string;

	seats: number;
	luggageSpace: boolean;
	technicallyApproved: boolean;

	modelId: bigint;
	colorId: bigint;
	engineId: bigint;
}

interface CarCreateFormProps {
	visible: boolean;
	onCreate: (values: Values) => void;
	onCancel: () => void;
}

const { Option } = Select;

const CreateCarModal: React.FC<CarCreateFormProps> = ({
	visible,
	onCreate,
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

	return (
		<Modal
			visible={visible}
			title='Create a new car'
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
					<InputNumber min={3} max={10} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					name='luggageSpace'
					label='Car Luggage Space'
					rules={[
						{
							required: true,
							message: 'Please input the luggage space of the car!',
						},
					]}>
					<Switch
						checkedChildren='Yes'
						unCheckedChildren='No'
						defaultChecked={false}
					/>
				</Form.Item>

				<Form.Item
					name='technicallyApproved'
					label='Car Technically Approved'
					rules={[
						{
							required: true,
							message: 'Please input the technical approvement of the car!',
						},
					]}>
					<Switch
						checkedChildren='Yes'
						unCheckedChildren='No'
						defaultChecked={false}
					/>
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

export { CreateCarModal };
